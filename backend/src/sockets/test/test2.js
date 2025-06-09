const io = require("socket.io-client");
const readline = require("readline");

const socket = io('http://localhost:3000', {
  auth: {
    token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4M2FlZGExMWM0MzU2OGZmNTMwYzQ3MSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ5NDAwNTg0LCJleHAiOjE3NDk0MDE0ODR9.hAdUgD41caHcLlpJ2u2ieC4O1OgU3PYiMmScSwXQpI0'
  }
});
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

socket.on("connect", () => {
  console.log(`✅ Client 2 connected: ${socket.id}`);
  socket.emit("join-session", "6845bae536fdb891a9b60e8b");

  rl.setPrompt("Bạn: ");
  rl.prompt();

  rl.on("line", (message) => {
    socket.emit("send-message", {
      session_id: "6845bae536fdb891a9b60e8b",
      content: message,
      type: "text",
    });
    rl.prompt();
  });
});

socket.on("receive-message", (msg) => {
  console.log(`📩 Tin nhắn từ ${msg.sender_id}: ${msg.content}`);
});
