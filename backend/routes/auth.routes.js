const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const auth = require("../middleware/auth");
const role = require("../middleware/roles");

// ONLY LOGIN (PUBLIC)
router.post("/login", authController.login);

// ADMIN ONLY - CREATE USERS
router.post(
    "/create-user",
    auth,
    role("Admin"),
    authController.createUser
);

module.exports = router;