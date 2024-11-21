const { Server: SocketIOServer } = require("socket.io");
const Message = require("../model/Message");
const setupSocket = (server) => {
  const userSocketMap = new Map();
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket ID: ${socket.id} `);
    } else {
      console.log("User ID not provided during connection");
    }

    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
    socket.on("sendMessage", async (message) => sendMessage(message));
    socket.on("disconnect", () => disconnect(socket));
  });

  //handle disconnect
  const disconnect = (socket) => {
    console.log(`Client disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  //handle message
  const sendMessage = async (message) => {
    const senderSocketId = userSocketMap.get(message.sender);
    const receiverSocketId = userSocketMap.get(message.receiver);

    const createdMessage = await Message.create(message);
    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "_id username email profilePicture")
      .populate("receiver", "_id username email profilePicture");

    if (receiverSocketId)
      io.to(receiverSocketId).emit("receiveMessage", messageData);
    if (senderSocketId)
      io.to(senderSocketId).emit("receiveMessage", messageData);
  };

  const getReceiverSocketId = (userId) => {
    return userSocketMap.get(userId);
  };
};

module.exports = setupSocket;
