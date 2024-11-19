const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  followUser,
  unfollowUser,
  deleteUserFromRequest,
  getAllFriendRequest,
  getAllUserForRequest,
  getAllMutualFriends,
} = require("../controllers/userController");
const router = express.Router();

router.post("/follow", authMiddleware, followUser);
router.post("/unfollow", authMiddleware, unfollowUser);
router.post("/friend-request/remove", authMiddleware, deleteUserFromRequest);
router.get("/friend-request", authMiddleware, getAllFriendRequest);
router.get("/user-to-request", authMiddleware, getAllUserForRequest);
router.get("/mutual-friends", authMiddleware, getAllMutualFriends);

module.exports = router;
