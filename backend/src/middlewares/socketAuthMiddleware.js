const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

function socketAuthMiddleware(socket, next) {
  const tokenWithBearer = socket.handshake.auth.token;
  
    if (!tokenWithBearer) {
        logger.warn('Authentication token missing');
        return next(new Error('Authentication token missing'));
    }

    const token = tokenWithBearer.split(' ')[1]; 

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
        logger.warn('Authentication failed: Invalid token');
        return next(new Error('Authentication failed'));
    }
    socket.user = user;
    next();
  });
}

module.exports = socketAuthMiddleware;
