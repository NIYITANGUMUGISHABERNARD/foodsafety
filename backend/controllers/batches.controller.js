const db = require("../config/db");

exports.getAll = async (req, res) => {
    const [rows] = await db.query("SELECT * FROM batches");
    res.json(rows);
};

exports.create = async (req, res) => {
    const { product_id, batch_number, production_date, expiry_date, quantity } = req.body;

    await db.query(
        "INSERT INTO batches (product_id, batch_number, production_date, expiry_date, quantity) VALUES (?,?,?,?,?)",
        [product_id, batch_number, production_date, expiry_date, quantity]
    );

    res.json({ message: "Batch created" });
};

exports.getOne = async (req, res) => {
    const [rows] = await db.query(
        "SELECT * FROM batches WHERE batch_id=?",
        [req.params.id]
    );

    res.json(rows[0]);
};

exports.update = async (req, res) => {
    try {
        const { product_id, batch_number, production_date, expiry_date, quantity } = req.body;

        await db.query(
            "UPDATE batches SET product_id=?, batch_number=?, production_date=?, expiry_date=?, quantity=? WHERE batch_id=?",
            [product_id, batch_number, production_date, expiry_date, quantity, req.params.id]
        );

        res.json({ message: "Batch updated" });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.remove = async (req, res) => {
    try {
        await db.query(
            "DELETE FROM batches WHERE batch_id=?",
            [req.params.id]
        );

        res.json({ message: "Batch deleted" });
    } catch (err) {
        res.status(500).json(err);
    }
};