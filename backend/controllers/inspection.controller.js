const db = require("../config/db");

exports.getAll = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM inspections");
        res.json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getOne = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM inspections WHERE inspection_id=?",
            [req.params.id]
        );
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.create = async (req, res) => {
    try {
        const { batch_id, inspected_by, inspection_status, remarks } = req.body;

        await db.query(`
            INSERT INTO inspections (batch_id, inspected_by, inspection_status, remarks)
            VALUES (?,?,?,?)
        `, [batch_id, inspected_by, inspection_status, remarks]);

        res.json({ message: "Inspection saved" });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.update = async (req, res) => {
    try {
        const { batch_id, inspected_by, inspection_status, remarks } = req.body;

        await db.query(`
            UPDATE inspections SET batch_id=?, inspected_by=?, inspection_status=?, remarks=? WHERE inspection_id=?
        `, [batch_id, inspected_by, inspection_status, remarks, req.params.id]);

        res.json({ message: "Inspection updated" });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.remove = async (req, res) => {
    try {
        await db.query(
            "DELETE FROM inspections WHERE inspection_id=?",
            [req.params.id]
        );

        res.json({ message: "Inspection deleted" });
    } catch (err) {
        res.status(500).json(err);
    }
};