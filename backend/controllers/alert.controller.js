const db = require("../config/db");

exports.getAll = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT a.*, r.risk_level
            FROM alerts a
            JOIN risk_analysis r ON a.risk_id = r.risk_id
        `);

        res.json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getOne = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM alerts WHERE alert_id=?",
            [req.params.id]
        );
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.create = async (req, res) => {
    try {
        const { batch_id, risk_id, alert_message, alert_type, status } = req.body;

        await db.query(`
            INSERT INTO alerts (batch_id, risk_id, alert_message, alert_type, status)
            VALUES (?,?,?,?,?)
        `, [batch_id, risk_id, alert_message, alert_type, status]);

        res.json({ message: "Alert created" });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.update = async (req, res) => {
    try {
        const { batch_id, risk_id, alert_message, alert_type, status } = req.body;

        await db.query(`
            UPDATE alerts SET batch_id=?, risk_id=?, alert_message=?, alert_type=?, status=? WHERE alert_id=?
        `, [batch_id, risk_id, alert_message, alert_type, status, req.params.id]);

        res.json({ message: "Alert updated" });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.remove = async (req, res) => {
    try {
        await db.query(
            "DELETE FROM alerts WHERE alert_id=?",
            [req.params.id]
        );

        res.json({ message: "Alert deleted" });
    } catch (err) {
        res.status(500).json(err);
    }
};