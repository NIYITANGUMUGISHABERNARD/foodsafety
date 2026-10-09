const router = require("express").Router();
const controller = require("../controllers/batches.controller");
const auth = require("../middleware/auth");
const role = require("../middleware/roles");

// GET ALL
router.get("/", auth, controller.getAll);

// CREATE (Production Staff + Admin)
router.post("/", auth, role("Production Staff", "Admin"), controller.create);

// GET ONE
router.get("/:id", auth, controller.getOne);

// UPDATE/DELETE (Production Staff + Admin)
router.put("/:id", auth, role("Production Staff", "Admin"), controller.update);
router.delete("/:id", auth, role("Production Staff", "Admin"), controller.remove);

module.exports = router;