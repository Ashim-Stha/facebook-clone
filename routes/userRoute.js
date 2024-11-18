const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  followUser,
  unfollowUser,
  deleteUserFromRequest,
} = require("../controllers/userController");
const router = express.Router();

router.post("/follow", authMiddleware, followUser);
router.post("/unfollow", authMiddleware, unfollowUser);
router.post("/remove/friend-request", authMiddleware, deleteUserFromRequest);

module.exports = router;
