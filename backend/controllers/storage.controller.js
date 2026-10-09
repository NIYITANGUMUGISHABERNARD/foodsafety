const db = require("../config/db");
const ai = require("../services/aiService");

exports.getAll = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM storage_conditions");
        res.json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getOne = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM storage_conditions WHERE storage_id=?",
            [req.params.id]
        );
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.create = async (req, res) => {
    try {
        const { batch_id, temperature, humidity, storage_type } = req.body;

        await db.query(`
            INSERT INTO storage_conditions (batch_id, temperature, humidity, storage_type)
            VALUES (?,?,?,?)
        `, [batch_id, temperature, humidity, storage_type]);

        // Auto-trigger risk evaluation
        const [batch] = await db.query(
            "SELECT * FROM batches WHERE batch_id=?",
            [batch_id]
        );

        if (batch.length > 0) {
            const result = ai.calculateRisk(temperature, humidity, batch[0].expiry_date);
            
            await db.query(`
                INSERT INTO risk_analysis (batch_id, risk_level, ai_score)
                VALUES (?,?,?)
            `, [batch_id, result.risk, result.score]);
        }

        res.json({ message: "Storage recorded and risk evaluated" });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.update = async (req, res) => {
    try {
        const { batch_id, temperature, humidity, storage_type } = req.body;

        await db.query(`
            UPDATE storage_conditions SET batch_id=?, temperature=?, humidity=?, storage_type=? WHERE storage_id=?
        `, [batch_id, temperature, humidity, storage_type, req.params.id]);

        // Auto-trigger risk evaluation
        const [batch] = await db.query(
            "SELECT * FROM batches WHERE batch_id=?",
            [batch_id]
        );

        if (batch.length > 0) {
            const result = ai.calculateRisk(temperature, humidity, batch[0].expiry_date);
            
            // Update existing risk analysis or create new one
            const [existingRisk] = await db.query(
                "SELECT * FROM risk_analysis WHERE batch_id=? ORDER BY risk_id DESC LIMIT 1",
                [batch_id]
            );

            if (existingRisk.length > 0) {
                await db.query(`
                    UPDATE risk_analysis SET risk_level=?, ai_score=? WHERE risk_id=?
                `, [result.risk, result.score, existingRisk[0].risk_id]);
            } else {
                await db.query(`
                    INSERT INTO risk_analysis (batch_id, risk_level, ai_score)
                    VALUES (?,?,?)
                `, [batch_id, result.risk, result.score]);
            }
        }

        res.json({ message: "Storage updated and risk re-evaluated" });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.remove = async (req, res) => {
    try {
        await db.query(
            "DELETE FROM storage_conditions WHERE storage_id=?",
            [req.params.id]
        );

        res.json({ message: "Storage deleted" });
    } catch (err) {
        res.status(500).json(err);
    }
};