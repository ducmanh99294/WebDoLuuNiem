const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const validateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    logger.warn('Token not provided');
    return res.status(401).json({
      success: false,
      message: 'Token not provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('_id name email role');

    if (!user) {
      logger.warn(`User not found for ID: ${decoded.id}`);
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // Gán các trường cần thiết, ưu tiên _id và giữ id cho tương thích
    req.user = {
      _id: user._id,
      id: user._id, // Đảm bảo id bằng _id để tránh xung đột
      name: user.name,
      email: user.email,
      role: user.role
    };

    logger.info(`Token validated for user: ${req.user._id}`);
    next();
  } catch (err) {
    logger.error(`Token validation failed: ${err.message}`);
    return res.status(403).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

module.exports = {
  validateToken
};