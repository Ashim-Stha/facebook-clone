const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mediaUrl: { type: String },
    mediaType: { type: String, enum: ["image", "video"] },
    // likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // likeCount: { type: Number, default: 0 },
    // comments: [
    //   {
    //     user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    //     text: { type: String, required: true },
    //     createdAt: { type: Date, required: Date.now() },
    //   },
    // ],
    // commentCount: { type: Number, default: 0 },
    // share: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // shareCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Story = mongoose.model("Story", storySchema);

module.exports = Story;
