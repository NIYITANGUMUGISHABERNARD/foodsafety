const db = require("../config/db");

exports.getAll = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT p.*, c.category_name FROM products p LEFT JOIN product_categories c ON p.category_id = c.category_id"
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getOne = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT p.*, c.category_name FROM products p LEFT JOIN product_categories c ON p.category_id = c.category_id WHERE p.product_id=?",
            [req.params.id]
        );
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.create = async (req, res) => {
    try {
        const { product_name, category_id } = req.body;

        await db.query(
            "INSERT INTO products (product_name, category_id) VALUES (?,?)",
            [product_name, category_id]
        );

        res.json({ message: "Product created" });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { product_name, category_id } = req.body;

        await db.query(
            "UPDATE products SET product_name=?, category_id=? WHERE product_id=?",
            [product_name, category_id, id]
        );

        res.json({ message: "Product updated" });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.remove = async (req, res) => {
    try {
        await db.query("DELETE FROM products WHERE product_id=?", [req.params.id]);
        res.json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json(err);
    }
};