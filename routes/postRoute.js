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

module.exports = router;
