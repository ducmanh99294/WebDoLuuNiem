const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

function socketAuthMiddleware(socket, next) {
    const authToken = socket.handshake.auth?.token;
    const token = authToken?.startsWith('Bearer ') ? authToken.split(' ')[1] : authToken;

    if (!token) {
        logger.warn('Access attempt without valid token');
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            logger.warn('Invalid token');
            console.log(err)
            
            return next(new Error('Invalid token'));
        }

        socket.user = user;
        next();
    })
}

module.exports = socketAuthMiddleware;
