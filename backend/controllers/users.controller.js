const db = require("../config/db");

exports.getAll = async (req, res) => {
    const [rows] = await db.query("SELECT * FROM users");
    res.json(rows);
};

exports.getOne = async (req, res) => {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE user_id=?",
        [req.params.id]
    );
    res.json(rows[0]);
};

exports.update = async (req, res) => {
    const { full_name, role } = req.body;

    await db.query(
        "UPDATE users SET full_name=?, role=? WHERE user_id=?",
        [full_name, role, req.params.id]
    );

    res.json({ message: "User updated" });
};

exports.remove = async (req, res) => {
    await db.query(
        "DELETE FROM users WHERE user_id=?",
        [req.params.id]
    );

    res.json({ message: "User deleted" });
};