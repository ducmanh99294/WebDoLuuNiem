const express = require('express');
const connectMongoDB = require('./config/mongodbConfig.js');
const productRoute = require('./routes/productRoute.js');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Xin chào từ Node.js + Express!');
});

connectMongoDB()

app.use('/api/products', productRoute);

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
