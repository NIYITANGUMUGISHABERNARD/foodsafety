const router = require("express").Router();
const controller = require("../controllers/inspection.controller");
const auth = require("../middleware/auth");
const role = require("../middleware/roles");

// READ (All authenticated users)
router.get("/", auth, controller.getAll);
router.get("/:id", auth, controller.getOne);

// WRITE (Quality Control Officer + Admin)
router.post("/", auth, role("Quality Control Officer", "Admin"), controller.create);
router.put("/:id", auth, role("Quality Control Officer", "Admin"), controller.update);
router.delete("/:id", auth, role("Quality Control Officer", "Admin"), controller.remove);

module.exports = router;
