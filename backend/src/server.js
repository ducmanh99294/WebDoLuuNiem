require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Server } = require('socket.io');
const { rateLimit } = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const errorHandler = require('./middlewares/errorHandler');
const logger = require('./utils/logger');
const connectMongoDB = require('./config/mongodbConfig');
const socketAuthMiddleware = require('./middlewares/socketAuthMiddleware');
const socketHandler = require('./sockets/index');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3001;
const API_VERSION = process.env.API_VERSION || 'v1';

// 1. Khởi tạo thư mục upload
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  logger.info(`Created upload directory at ${uploadDir}`);
}

// 2. Cấu hình Multer
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5 // Tối đa 5 files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG/PNG/JPG/WEBP are allowed'));
    }
  }
});

// Connect to MongoDB
connectMongoDB();

// Socket.IO setup
io.use(socketAuthMiddleware);
socketHandler(io);

// Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173', // Cho phép Vite frontend
  credentials: true,               // Nếu frontend gửi cookie hoặc token
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Disposition']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDir));

// Truyền io vào request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middleware xử lý lỗi upload
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    logger.error('Multer error:', err);
    return res.status(400).json({
      success: false,
      message: err.code === 'LIMIT_FILE_SIZE' 
        ? 'File too large (max 10MB)' 
        : 'File upload error'
    });
  } else if (err) {
    logger.error('Upload error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'File processing failed'
    });
  }
  next();
});

// Logging middleware
app.use((req, res, next) => {
  if (req.url.startsWith('/socket.io')) return next();
  logger.info(`Received request: ${req.method} ${req.url}`);
  if (req.file || req.files) {
    logger.info(`Uploaded files: ${JSON.stringify({
      count: req.files?.length || 1,
      names: req.files?.map(f => f.originalname) || [req.file.originalname]
    })}`);
  }
  next();
});

// Rate limit middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({ success: false, message: 'Too many requests' });
  },
});

// Routes
app.use(`/api/${API_VERSION}/users`, require('./routes/userRoutes'));
app.use(`/api/${API_VERSION}/auth`, require('./routes/identity'));
app.use(`/api/${API_VERSION}/products`, require('./routes/productRoutes'));
app.use(`/api/${API_VERSION}/public`, require('./routes/publicRouters'));
app.use(`/api/${API_VERSION}/like-lists`, require('./routes/likeListRoutes'));
app.use(`/api/${API_VERSION}/orders`, require('./routes/orderRoutes'));
app.use(`/api/${API_VERSION}/categories`, require('./routes/categoryRoutes'));
app.use(`/api/${API_VERSION}/shipping-companies`, require('./routes/shippingCompanyRoutes'));
app.use(`/api/${API_VERSION}/messages`, require('./routes/messageRoutes'));
app.use(`/api/${API_VERSION}/reviews`, require('./routes/reviewRoutes'));
app.use(`/api/${API_VERSION}/chats`, require('./routes/chatRoutes'));
app.use(`/api/${API_VERSION}/comments`, require('./routes/commentRoutes'));
app.use(`/api/${API_VERSION}/coupons`, require('./routes/couponRoutes'));
app.use(`/api/${API_VERSION}/payments`, require('./routes/paymentRoutes'));
app.use(`/api/${API_VERSION}/notifications`, require('./routes/notificationRoutes'));
app.use(`/api/${API_VERSION}/events`, require('./routes/eventRoutes'));
app.use(`/api/${API_VERSION}/blogs`, require('./routes/blogRoutes'));
app.use(`/api/${API_VERSION}/carts`, require('./routes/cartRoutes'));
app.use(`/api/${API_VERSION}/cart-details`, require('./routes/cartDetailRoutes'));
app.use(`/api/${API_VERSION}/payment-online`, require('./routes/paymentOnlineRoutes'));
app.use(`/api/${API_VERSION}/about`, require('./routes/aboutUsRoutes'));
app.use(`/api/${API_VERSION}/contacts`, require('./routes/contacRoutes'));
app.use(`/api/${API_VERSION}/cancel-requests`, require('./routes/cancelRequestRoutes'));
app.use(`/api/${API_VERSION}/returns`, require('./routes/returnRoutes'));

// Error handler
app.use(errorHandler);

// Start server
server.listen(PORT, () => {
  logger.info(`Server is running on http://${HOST}:${PORT}`);
  logger.info(`Upload directory: ${uploadDir}`);
});

// Handle errors
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception thrown:', err);
  process.exit(1);
});
