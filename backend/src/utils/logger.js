// utils/logger.js
const winston = require('winston');

const baseLogger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Cho phép logger("msg") gọi như .info
const logger = (msg) => baseLogger.info(msg);

// Gắn thêm các phương thức info, warn, error
logger.info = baseLogger.info.bind(baseLogger);
logger.warn = baseLogger.warn.bind(baseLogger);
logger.error = baseLogger.error.bind(baseLogger);
logger.debug = baseLogger.debug.bind(baseLogger);

module.exports = logger;
