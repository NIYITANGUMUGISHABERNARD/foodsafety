const router = require("express").Router();
const controller = require("../controllers/batches.controller");
const auth = require("../middleware/auth");
const role = require("../middleware/roles");

router.get("/", auth, controller.getAll);

router.post("/", auth, role("Production Staff", "Admin"), controller.create);

router.get("/:id", auth, controller.getOne);

module.exports = router;