const io = require("socket.io-client");

const socket = io("http://localhost:8080", {
  query: { userId: "66499d903aab95ac81d4fa2c" },
});

socket.on("connect", () => {
  console.log("Connected to WebSocket server with socket ID:", socket.id);

  // Send a test message
  socket.emit("sendMessage", {
    sender: "66499d903aab95ac81d4fa2c",
    receiver: "6648ba21a1f79127b4c7344b",
    messageType: "text",
    content: "Hello!",
  });
});

socket.on("getOnlineUsers", (userIds) => {
  userIds.forEach((Id) => {
    console.log("Online id:", Id);
  });
});

// Listen for incoming messages
// socket.on("receiveMessage", (messageData) => {
//   console.log("Received message:", messageData);
// });
