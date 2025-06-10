const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

function socketAuthMiddleware(socket, next) {
  const authToken = socket.handshake.auth?.token;
  const token = authToken?.startsWith('Bearer ') ? authToken.split(' ')[1] : authToken;

  if (!token) {
    logger.warn('Socket authentication failed: No token provided');
    return next(new Error('Authentication error: No token provided'));
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = { id: user._id, role: user.role };
    logger.info(`Socket authenticated for user ${_id}`);
    next();
  } catch (error) {
    logger.error(`Socket authentication failed: ${error.message}`);
    return next(new Error(`Authentication error: ${error.message}`));
  }
}

module.exports = socketAuthMiddleware;