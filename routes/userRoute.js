const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  followUser,
  unfollowUser,
  deleteUserFromRequest,
  getAllFriendRequest,
  getAllUserForRequest,
  getAllMutualFriends,
  getUserProfile,
  getAllUser,
  checkUserAuth,
} = require("../controllers/userController");
const {
  createOrUpdateBio,
  updateUserProfile,
  updateCoverPhoto,
} = require("../controllers/createOrUpdateController");
const { multerMiddleware } = require("../config/cloudinary");
const router = express.Router();

router.post("/follow", authMiddleware, followUser);
router.post("/unfollow", authMiddleware, unfollowUser);
router.post("/friend-request/remove", authMiddleware, deleteUserFromRequest);
router.get("/friend-request", authMiddleware, getAllFriendRequest);
router.get("/user-to-request", authMiddleware, getAllUserForRequest);
router.get("/mutual-friends", authMiddleware, getAllMutualFriends);
router.get("/", authMiddleware, getAllUser);
router.get("/profile/:userId", authMiddleware, getUserProfile);
router.get("/check-auth", authMiddleware, checkUserAuth);

//bio
router.put("/bio/:userId", authMiddleware, createOrUpdateBio);
router.put(
  "/profile/:userId",
  authMiddleware,
  multerMiddleware.single("profilePicture"),
  updateUserProfile
);
router.put(
  "/profile/cover-photo/:userId",
  authMiddleware,
  multerMiddleware.single("coverPhoto"),
  updateCoverPhoto
);
module.exports = router;
