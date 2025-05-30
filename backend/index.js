const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Xin chào từ Node.js + Express!');
});

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
