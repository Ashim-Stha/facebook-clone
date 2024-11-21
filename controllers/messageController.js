const { uploadFileToCloudinary } = require("../config/cloudinary");
const Message = require("../model/Message");

const getMessages = async (req, res) => {
  try {
    const user1Id = req?.user?.userId;
    const { id: user2Id } = req.params;
    if (!user1Id || !user2Id)
      return res.status(400).send("Both user ID's are required");
    const messages = await Message.find({
      $or: [
        { sender: user1Id, receiver: user2Id },
        { sender: user2Id, receiver: user1Id },
      ],
    }).sort({ createdAt: -1 });
    return res.status(200).json(messages);
  } catch (e) {
    console.log("error getting posts", e);
    return res.status(500).send("Internal Server Error", e);
  }
};

const getUsers = async (req, res) => {
  try {
    const userId = req?.user?.userId;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );
    return res.status(200).json(filteredUsers);
  } catch (e) {
    console.log("error getting posts", e);
    return res.status(500).send("Internal Server Error", e);
  }
};

const sendMessage = async (req, res) => {
  try {
    const sender = req?.user?.userId;
    const { id: receiver } = req.params;
    const { text, file } = req.body;
    let fileUrl = null;
    let messageType = null;
    let content = null;
    if (file) {
      const uploadResult = await uploadFileToCloudinary(file);
      fileUrl = uploadResult.secure_url;
      messageType = "file";
    }
    if (text) {
      content = text;
      messageType = "text";
    }

    const newMessage = new Message({
      sender,
      receiver,
      messageType,
      content,
      fileUrl,
    });

    await newMessage.save();
    return res.status(201).json(newMessage);
  } catch (e) {
    console.log("error getting posts", e);
    return res.status(500).send("Internal Server Error", e);
  }
};

module.exports = { getMessages };
