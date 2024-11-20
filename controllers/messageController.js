const Message = require("../model/Message");

const getMessages = async (req, res) => {
  try {
    const user1Id = req?.user?.userId;
    const { user2Id } = req.body;
    if (!user1Id || !user2Id)
      return response.status(400).send("Both user ID's are required");
    const messages = await Message.find({
      $or: [
        { sender: user1Id, recipient: user2Id },
        { sender: user2Id, recipient: user1Id },
      ],
    }).sort({ createdAt: -1 });
    return response.status(200).json({ messages });
  } catch (e) {
    console.log("error getting posts", e);
    return response.status(500).send("Internal Server Error", e);
  }
};

module.exports = { getMessages };
