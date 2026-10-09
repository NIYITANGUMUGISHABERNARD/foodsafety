const router = require("express").Router();
const controller = require("../controllers/users.controller");
const auth = require("../middleware/auth");
const role = require("../middleware/roles");

// ONLY ADMIN CAN MANAGE USERS
router.get("/", auth, role("Admin"), controller.getAll);
router.get("/:id", auth, role("Admin"), controller.getOne);
router.put("/:id", auth, role("Admin"), controller.update);
router.delete("/:id", auth, role("Admin"), controller.remove);

module.exports = router;