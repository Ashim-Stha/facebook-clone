const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { followUser } = require("../controllers/userController");
const router = express.Router();

router.post("/follow", authMiddleware, followUser);

module.exports = router;
