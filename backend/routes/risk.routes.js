const router = require("express").Router();
const controller = require("../controllers/risk.controller");
const auth = require("../middleware/auth");
const role = require("../middleware/roles");

// READ (All authenticated users)
router.get("/", auth, controller.getAll);
router.get("/:id", auth, controller.getOne);

// WRITE (Quality Control Officer + Admin)
router.post("/", auth, role("Quality Control Officer", "Admin"), controller.create);
router.put("/:id", auth, role("Quality Control Officer", "Admin"), controller.update);
router.delete("/:id", auth, role("Quality Control Officer", "Admin"), controller.remove);

// AI EVALUATION (Quality Control Officer + Admin)
router.post("/evaluate/:batchId", auth, role("Quality Control Officer", "Admin"), controller.evaluate);

module.exports = router;
