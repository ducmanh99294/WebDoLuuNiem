require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Server } = require('socket.io');
const {rateLimit} = require('express-rate-limit')

const errorHandler = require('./middlewares/errorHandler');
const logger = require('./utils/logger');
const connectMongoDB = require('./config/mongodbConfig');
const { validateToken } = require('./middlewares/authMiddleware');
const { validateToken: socketValidateToken } = require('./middlewares/socketAuthMiddleware');
const socketHandler = require('./sockets/index');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});
//check user token before allowing socket connection
io.use(socketValidateToken);

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;
const API_VERSION = process.env.API_VERSION || 'v1'

//connect to MongoDB
connectMongoDB()
socketHandler(io);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    if (req.url.startsWith('/socket.io')) {
        return next();
    }
  logger.info(`Received request: ${req.method} ${req.url}`);
  logger.info(`Received body $ ${res.body}`);
  next();
})

const sensitiveEnpointsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.warn(`Sensitive endpoint rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many requests'
    })
  }
});

//route imports
app.use(`/api/${API_VERSION}/users`, validateToken, require('./routes/userRoutes'));
app.use(`/api/${API_VERSION}/auth`, require('./routes/identity'));
app.use(`/api/${API_VERSION}/products`, validateToken, require('./routes/productRoutes'));
app.use(`/api/${API_VERSION}/public`, require('./routes/publicRouters'));

app.use(`/api/${API_VERSION}/products`, validateToken,require('./routes/productRoutes'));
app.use(`/api/${API_VERSION}/orders`, validateToken, require('./routes/orderRoutes'));
app.use(`/api/${API_VERSION}/categories`, require('./routes/categoryRoutes'));
app.use(`/api/${API_VERSION}/shipping-companies`, require('./routes/shippingCompanyRoutes'));
app.use(`/api/${API_VERSION}/shippers`, require('./routes/shipperRoutes'));
app.use(`/api/${API_VERSION}/messages`, validateToken, require('./routes/messageRoutes'));
app.use(`/api/${API_VERSION}/support-sessions`, require('./routes/supportSessionRoutes'));
app.use(`/api/${API_VERSION}/reviews`, validateToken, require('./routes/reviewRoutes'));
app.use(`/api/${API_VERSION}/chats`, validateToken, require('./routes/chatRoutes'));
// Nhan quản
app.use(`/api/${API_VERSION}/categories`, require('./routes/categoryRoutes'));
app.use(`/api/${API_VERSION}/shipping-companies`, require('./routes/shippingCompanyRoutes'));
app.use(`/api/${API_VERSION}/shippers`, require('./routes/shipperRoutes'));
app.use(`/api/${API_VERSION}/coupons`, require('./routes/couponRoutes'));

//error handler
app.use(errorHandler);

server.listen(PORT, () => {
  logger.info(`Server is running on http://${HOST}:${PORT}`);
});

// Handle uncaught exceptions and unhandled rejections
process.on('unhandleRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
})