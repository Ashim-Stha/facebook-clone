const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { multerMiddleware } = require("../config/cloudinary");
const { createPost } = require("../controllers/postController");
const router = express.Router();

router.post(
  "/posts",
  authMiddleware,
  multerMiddleware.single("media"),
  createPost
);

module.exports = router;
