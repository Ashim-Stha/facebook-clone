const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { multerMiddleware } = require("../config/cloudinary");
const {
  createPost,
  getAllPosts,
  getPostByUserId,
  likePost,
  commentPost,
  sharePost,
  getAllStory,
  createStory,
} = require("../controllers/postController");

const router = express.Router();

router.post(
  "/posts",
  authMiddleware,
  multerMiddleware.single("media"),
  createPost
);

router.get("/posts", authMiddleware, getAllPosts);
router.get("/posts/user/:userId", authMiddleware, getPostByUserId);
router.post("/posts/likes/:postId", authMiddleware, likePost);
router.post("/posts/comments/:postId", authMiddleware, commentPost);
router.post("/posts/share/:postId", authMiddleware, sharePost);
router.post(
  "/story",
  authMiddleware,
  multerMiddleware.single("media"),
  createStory
);
router.get("/story", authMiddleware, getAllStory);

module.exports = router;
