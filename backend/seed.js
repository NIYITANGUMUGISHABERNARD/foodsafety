const db = require("./config/db");
const bcrypt = require("bcrypt");
require("dotenv").config();

async function seedAdmin() {
    try {
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (!email || !password) {
            throw new Error(
                "Set ADMIN_EMAIL and ADMIN_PASSWORD in your local environment."
            );
        }

        if (password.length < 12) {
            throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
        }

        const [existing] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (existing.length > 0) {
            console.log("Admin user already exists.");
            return;
        }

        const hash = await bcrypt.hash(password, 10);

        await db.query(
            `INSERT INTO users (full_name, email, password_hash, role)
             VALUES (?, ?, ?, ?)`,
            ["System Admin", email, hash, "Admin"]
        );

        console.log("Admin user created successfully.");
        console.log("Use your configured admin email to sign in.");
        console.log("Keep your password private.");

    } catch (error) {
        console.error("Error seeding admin user:", error.message);
        process.exitCode = 1;
    } finally {
        await db.end?.();
    }
}

seedAdmin();