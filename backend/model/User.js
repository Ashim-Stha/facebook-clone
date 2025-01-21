const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: { type: String, required: [true, "Password is required"] },
    gender: { type: String, default: null },
    dateOfBirth: { type: Date, default: null },
    profilePicture: { type: String, default: null },
    coverPhoto: { type: String, default: null },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followerCount: { type: String, default: 0 },
    followingCount: { type: String, default: 0 },
    bio: { type: mongoose.Schema.Types.ObjectId, ref: "Bio" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
