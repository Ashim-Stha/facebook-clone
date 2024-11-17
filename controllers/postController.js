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

const likePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.userId;
  try {
    const post = await Post.findById(postId);
    if (!post) return response(res, 404, "post not found");
    const hasLiked = post.likes.includes(userId);
    if (hasLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      post.likeCount = Math.max(0, post.likeCount - 1);
    } else {
      post.likes.push(userId);
      post.likeCount += 1;
    }

    const updatedPost = await post.save();
    return response(
      res,
      201,
      hasLiked ? "Post unliked" : "Post liked",
      updatedPost
    );
  } catch (e) {
    console.log(e);
    return response(res, 500, "Internal Server Error", e.message);
  }
};

const commentPost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.user;
  const { text } = req.body;
  try {
    const post = await Post.findById(postId);
    if (!post) return response(res, 404, "post not found");
    post.comments.push({ user: userId, text });
    post.commentCount += 1;

    await post.save();
    return response(res, 201, "Comment added successfully", post);
  } catch (e) {
    console.log(e);
    return response(res, 500, "Internal Server Error", e.message);
  }
};

const sharePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.user;
  try {
    const post = await Post.findById(postId);
    if (!post) return response(res, 404, "post not found");
    const hasShared = post.share.includes(userId);
    if (!hasShared && userId) {
      post.share.push(userId);
    }

    post.shareCount += 1;
    await post.save();
    return response(res, 201, "Post shared successfully", post);
  } catch (e) {
    console.log(e);
    return response(res, 500, "Internal Server Error", e.message);
  }
};
module.exports = {
  createPost,
  getAllPosts,
  getPostByUserId,
  likePost,
  commentPost,
  sharePost,
};
