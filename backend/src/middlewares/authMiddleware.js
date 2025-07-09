const jwt = require('jsonwebtoken');
const User = require('../models/User');

const validateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token not provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('_id name email role');

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // Gán cả _id và id để tương thích
    req.user = {
      ...user._doc,
      id: user._id  // giữ nguyên `id`
    };

    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

module.exports = {
  validateToken
};
