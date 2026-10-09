const router = require("express").Router();
const controller = require("../controllers/categories.controller");
const auth = require("../middleware/auth");
const role = require("../middleware/roles");

// READ (All authenticated users)
router.get("/", auth, controller.getAll);
router.get("/:id", auth, controller.getOne);

// WRITE (Admin only)
router.post("/", auth, role("Admin"), controller.create);
router.put("/:id", auth, role("Admin"), controller.update);
router.delete("/:id", auth, role("Admin"), controller.remove);

module.exports = router;