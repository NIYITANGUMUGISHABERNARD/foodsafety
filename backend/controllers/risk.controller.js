const db = require("../config/db");
const ai = require("../services/aiService");

exports.getAll = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM risk_analysis");
        res.json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getOne = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM risk_analysis WHERE risk_id=?",
            [req.params.id]
        );
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.create = async (req, res) => {
    try {
        const { batch_id, risk_level, ai_score } = req.body;

        const [result] = await db.query(`
            INSERT INTO risk_analysis (batch_id, risk_level, ai_score)
            VALUES (?,?,?)
        `, [batch_id, risk_level, ai_score]);

        // Auto-generate alert if risk is Warning or Unsafe
        if (risk_level === "Warning" || risk_level === "Unsafe") {
            const alertMessage = risk_level === "Unsafe" 
                ? `CRITICAL: Batch ${batch_id} has been identified as UNSAFE (AI Score: ${ai_score}). Immediate action required.`
                : `WARNING: Batch ${batch_id} has elevated risk (AI Score: ${ai_score}). Monitor closely.`;

            await db.query(`
                INSERT INTO alerts (batch_id, risk_id, alert_message, alert_type, status)
                VALUES (?,?,?,?,?)
            `, [batch_id, result.insertId, alertMessage, risk_level, "Unread"]);
        }

        res.json({ message: "Risk analysis created" });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.update = async (req, res) => {
    try {
        const { batch_id, risk_level, ai_score } = req.body;

        await db.query(`
            UPDATE risk_analysis SET batch_id=?, risk_level=?, ai_score=? WHERE risk_id=?
        `, [batch_id, risk_level, ai_score, req.params.id]);

        // Auto-generate alert if risk is Warning or Unsafe
        if (risk_level === "Warning" || risk_level === "Unsafe") {
            const alertMessage = risk_level === "Unsafe" 
                ? `CRITICAL: Batch ${batch_id} risk updated to UNSAFE (AI Score: ${ai_score}). Immediate action required.`
                : `WARNING: Batch ${batch_id} risk updated to Warning (AI Score: ${ai_score}). Monitor closely.`;

            await db.query(`
                INSERT INTO alerts (batch_id, risk_id, alert_message, alert_type, status)
                VALUES (?,?,?,?,?)
            `, [batch_id, req.params.id, alertMessage, risk_level, "Unread"]);
        }

        res.json({ message: "Risk analysis updated" });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.remove = async (req, res) => {
    try {
        await db.query(
            "DELETE FROM risk_analysis WHERE risk_id=?",
            [req.params.id]
        );

        res.json({ message: "Risk analysis deleted" });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.evaluate = async (req, res) => {
    try {
        const batchId = req.params.batchId;

        const [batch] = await db.query(
            "SELECT * FROM batches WHERE batch_id=?",
            [batchId]
        );

        const [storage] = await db.query(
            "SELECT * FROM storage_conditions WHERE batch_id=? ORDER BY recorded_at DESC LIMIT 1",
            [batchId]
        );

        const result = ai.calculateRisk(
            storage[0]?.temperature || 0,
            storage[0]?.humidity || 0,
            batch[0].expiry_date
        );

        await db.query(`
            INSERT INTO risk_analysis (batch_id, risk_level, ai_score)
            VALUES (?,?,?)
        `, [batchId, result.risk, result.score]);

        res.json(result);

    } catch (err) {
        res.status(500).json(err);
    }
};