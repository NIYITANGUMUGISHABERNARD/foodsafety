const router = require("express").Router();
const controller = require("../controllers/dashboards.controller");
const auth = require("../middleware/auth");
const role = require("../middleware/roles");

// DASHBOARD (Manager + Admin)
router.get("/", auth, role("Manager", "Admin"), controller.getDashboard);

module.exports = router;
