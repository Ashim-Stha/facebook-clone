const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { multerMiddleware } = require("../config/cloudinary");
const {
  createPost,
  getAllPosts,
  getPostByUserId,
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

module.exports = router;
