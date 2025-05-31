require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const {rateLimit} = require('express-rate-limit')

const errorHandler = require('./middlewares/errorHandler');
const logger = require('./utils/logger');
const connectMongoDB = require('./config/mongodbConfig');
const { validateToken } = require('./middlewares/authMiddleware');

const app = express();

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;
const API_VERSION = process.env.API_VERSION || 'v1'

//connect to MongoDB
connectMongoDB()

// Middleware
app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
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

// app.use(`/api/${API_VERSION}/`, validateToken)

//route imports
app.use(`/api/${API_VERSION}/users`, validateToken, require('./routes/userRoutes'));
app.use(`/api/${API_VERSION}/auth`, require('./routes/identity'));

//error handler
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server is running on http://${HOST}:${PORT}`);
});

// Handle uncaught exceptions and unhandled rejections
process.on('unhandleRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
})
