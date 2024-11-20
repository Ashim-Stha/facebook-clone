const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getMessages } = require("../controllers/messageController");
const router = express.Router();

router.get("/get-messages", authMiddleware, getMessages);

module.exports = router;
