const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getMessages } = require("../controllers/messageController");
const router = express.Router();
const Message = require("../model/Message");

router.get("/get-messages/:id", authMiddleware, getMessages);

module.exports = router;
