const io = require("socket.io-client");
const readline = require("readline");

//login với token
const socket = io('http://localhost:3000', {
  auth: {
    token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4M2FjMDc0NGI4ZGVjYjQ1NDJmNzZlYSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ5NDAwNjEyLCJleHAiOjE3NDk0MDE1MTJ9.BAA8-3AluO5CPfr1V8SJmzL13oPVEd2xlgHIBFkISL0'
  }
});
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

socket.on("connect", () => {
  console.log(`✅ Client 1 connected: ${socket.id}`);
  socket.emit("join-session", "6845bae536fdb891a9b60e8b"); // Thay đổi session_id nếu cần

  rl.setPrompt("Bạn: ");
  rl.prompt();eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4M2FlZGExMWM0MzU2OGZmNTMwYzQ3MSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ5Mzk4NTA3LCJleHAiOjE3NDkzOTk0MDd9.SdUBCtJbY_H9O9vqXLdZf_gabUcPg8Cu0UuHX8WXopo

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
