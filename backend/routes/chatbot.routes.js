const router = require("express").Router();
const controller = require("../controllers/chatbot.controller");
const auth = require("../middleware/auth");

// Chatbot endpoint (all authenticated users)
router.post("/", auth, controller.chat);

module.exports = router;
