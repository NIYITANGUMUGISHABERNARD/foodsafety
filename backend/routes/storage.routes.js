const router = require("express").Router();
const controller = require("../controllers/storage.controller");
const auth = require("../middleware/auth");
const role = require("../middleware/roles");

// READ (All authenticated users)
router.get("/", auth, controller.getAll);
router.get("/:id", auth, controller.getOne);

// WRITE (Production Staff + Admin)
router.post("/", auth, role("Production Staff", "Admin"), controller.create);
router.put("/:id", auth, role("Production Staff", "Admin"), controller.update);
router.delete("/:id", auth, role("Production Staff", "Admin"), controller.remove);

module.exports = router;
