const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// 🔐 LOGIN (PUBLIC)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [user] = await db.query(
            "SELECT * FROM users WHERE email=?",
            [email]
        );

        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const valid = await bcrypt.compare(password, user[0].password_hash);

        if (!valid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            {
                id: user[0].user_id,
                role: user[0].role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            token,
            user: {
                id: user[0].user_id,
                name: user[0].full_name,
                role: user[0].role
            }
        });

    } catch (err) {
        res.status(500).json(err);
    }
};


// 👤 CREATE USER (ADMIN ONLY)
exports.createUser = async (req, res) => {
    try {
        const { full_name, email, password, role } = req.body;

        // check if exists
        const [existing] = await db.query(
            "SELECT * FROM users WHERE email=?",
            [email]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hash = await bcrypt.hash(password, 10);

        await db.query(
            `INSERT INTO users (full_name, email, password_hash, role)
             VALUES (?,?,?,?)`,
            [full_name, email, hash, role]
        );

        res.json({ message: "User created successfully by Admin" });

    } catch (err) {
        res.status(500).json(err);
    }
};