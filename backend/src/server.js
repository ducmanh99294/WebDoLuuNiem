require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Server } = require('socket.io');
const { rateLimit } = require('express-rate-limit');

const errorHandler = require('./middlewares/errorHandler');
const logger = require('./utils/logger');
const connectMongoDB = require('./config/mongodbConfig');
const socketAuthMiddleware = require('./middlewares/socketAuthMiddleware');
const socketHandler = require('./sockets/index');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;
const API_VERSION = process.env.API_VERSION || 'v1';

// Connect to MongoDB
connectMongoDB();

// Socket.IO setup
io.use(socketAuthMiddleware);
socketHandler(io);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware (excluding socket.io)
app.use((req, res, next) => {
  if (req.url.startsWith('/socket.io')) return next();
  logger.info(`Received request: ${req.method} ${req.url}`);
  logger.info(`Received body: ${JSON.stringify(req.body)}`);
  next();
});

// Optional: Rate limit middleware (chưa gắn vào route cụ thể)
const sensitiveEnpointsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Sensitive endpoint rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({ success: false, message: 'Too many requests' });
  },
});

// Routes (đã không dùng validateToken toàn cục)
app.use(`/api/${API_VERSION}/users`, require('./routes/userRoutes'));
app.use(`/api/${API_VERSION}/auth`, require('./routes/identity'));
app.use(`/api/${API_VERSION}/products`, require('./routes/productRoutes'));
app.use(`/api/${API_VERSION}/public`, require('./routes/publicRouters'));
app.use(`/api/${API_VERSION}/like-lists`, require('./routes/likeListRoutes'));
app.use(`/api/${API_VERSION}/orders`, require('./routes/orderRoutes'));
app.use(`/api/${API_VERSION}/categories`, require('./routes/categoryRoutes'));
app.use(`/api/${API_VERSION}/shipping-companies`, require('./routes/shippingCompanyRoutes'));
app.use(`/api/${API_VERSION}/shippers`, require('./routes/shipperRoutes'));
app.use(`/api/${API_VERSION}/messages`, require('./routes/messageRoutes'));
app.use(`/api/${API_VERSION}/support-sessions`, require('./routes/supportSessionRoutes'));
app.use(`/api/${API_VERSION}/reviews`, require('./routes/reviewRoutes'));
app.use(`/api/${API_VERSION}/chats`, require('./routes/chatRoutes'));
app.use(`/api/${API_VERSION}/comments`, require('./routes/commentRoutes'));
app.use(`/api/${API_VERSION}/coupons`, require('./routes/couponRoutes'));
app.use(`/api/${API_VERSION}/payments`, require('./routes/paymentRoutes'));
app.use(`/api/${API_VERSION}/notifications`, require('./routes/notificationRoutes'));

// Error handler
app.use(errorHandler);

// Start server
server.listen(PORT, () => {
  logger.info(`Server is running on http://${HOST}:${PORT}`);
});

// Handle errors
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception thrown:', err);
  process.exit(1);
});