const io = require("socket.io-client");

const socket = io("http://localhost:8080", {
  query: { userId: "673b2f194fd14920207e1950" },
});

socket.on("connect", () => {
  console.log("Connected to WebSocket server with socket ID:", socket.id);

  // Send a test message
  //   socket.emit("sendMessage", {
  //     sender: "673b3d1d5c2fe4c59123c8f7",
  //     receiver: "673971cde47879e7acf189c5",
  //     messageType: "text",
  //     content: "Oi Luffy!",
  //   });
});

//673971cde47879e7acf189c5 luffy
//673b3d1d5c2fe4c59123c8f7 zoro
//673b2f194fd14920207e1950 tony

socket.on("getOnlineUsers", (userIds) => {
  userIds.forEach((Id) => {
    console.log("Online id:", Id);
  });
});

// Listen for incoming messages
socket.on("receiveMessage", (messageData) => {
  console.log("Received message:", messageData);
});
