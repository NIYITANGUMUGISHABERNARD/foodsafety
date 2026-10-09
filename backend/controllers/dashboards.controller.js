const db = require("../config/db");

exports.getDashboard = async (req, res) => {
    try {
        const [products] = await db.query("SELECT COUNT(*) as total FROM products");
        const [batches] = await db.query("SELECT COUNT(*) as total FROM batches");
        const [unsafe] = await db.query(`
            SELECT COUNT(*) as total FROM risk_analysis WHERE risk_level='Unsafe'
        `);

        res.json({
            totalProducts: products[0].total,
            totalBatches: batches[0].total,
            unsafeBatches: unsafe[0].total
        });

    } catch (err) {
        res.status(500).json(err);
    }
};