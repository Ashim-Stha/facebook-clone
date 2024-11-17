const { uploadFileToCloudinary } = require("../config/cloudinary");
const Post = require("../model/Post");
const response = require("../utils/responseHandler");

const createPost = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("this is my auth userid ", userId);

    const { content } = req.body;
    const file = req.file;
    let mediaUrl = null;
    let mediaType = null;

    if (file) {
      const uploadResult = await uploadFileToCloudinary(file);
      console.log("upload file", uploadResult);
      mediaUrl = uploadResult?.secure_url;
      mediaType = file.mimetype.startsWith("video") ? "video" : "image";
    }

    //create a new post
    const newPost = await new Post({
      user: userId,
      content,
      mediaUrl,
      mediaType,
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
    });

    await newPost.save();
    return response(res, 201, "Post created successfully", newPost);
  } catch (e) {
    console.log("Error creating post", e);
    return response(res, 500, "Internal Server Error", e.message);
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "_id username profilePicture email")
      .populate({
        path: "comments.user",
        select: "username, profilePicture",
      });
    return response(res, 201, "Got all posts successfully", posts);
  } catch (e) {
    console.log("error getting posts", e);
    return response(res, 500, "Internal Server Error", e.message);
  }
};

const getPostByUserId = async (req, res) => {
  const { userId } = req.params;
  if (!userId) return response(res, 400, "UserId is require to get user post");
  try {
    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "_id username profilePicture email")
      .populate("comments.user", "username profilePicture");
    return response(res, 201, "Got user post successfully", posts);
  } catch (e) {
    console.log("error getting posts", e);
    return response(res, 500, "Internal Server Error", e.message);
  }
};
module.exports = { createPost, getAllPosts, getPostByUserId };
