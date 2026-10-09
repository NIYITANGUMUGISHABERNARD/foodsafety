const db = require("../config/db");

exports.getAll = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM product_categories");
        res.json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getOne = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM product_categories WHERE category_id=?",
            [req.params.id]
        );
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.create = async (req, res) => {
    try {
        const { category_name } = req.body;

        await db.query(
            "INSERT INTO product_categories (category_name) VALUES (?)",
            [category_name]
        );

        res.json({ message: "Category created" });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.update = async (req, res) => {
    try {
        const { category_name } = req.body;

        await db.query(
            "UPDATE product_categories SET category_name=? WHERE category_id=?",
            [category_name, req.params.id]
        );

        res.json({ message: "Category updated" });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.remove = async (req, res) => {
    try {
        await db.query(
            "DELETE FROM product_categories WHERE category_id=?",
            [req.params.id]
        );

        res.json({ message: "Category deleted" });
    } catch (err) {
        res.status(500).json(err);
    }
};
