const Message = require('../models/Message');
const logger = require('../utils/logger');

function socketHandler(io) {
  console.log("Socket handler initialized");
  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);
    console.log(`Client connected: ${socket.id}`);


    socket.on('join-session', (sessionId) => {
      logger.info(`Socket ${socket.id} attempting to join session ${sessionId}`);
      if (!sessionId) {
        logger.warn(`join-session called with invalid sessionId`);
        return;
      }
      
      socket.join(sessionId);
      logger.info(`Socket ${socket.id} joined session ${sessionId}`);
    });

    socket.on('send-message', async (msg) => {
      try {
        logger.info(`Received send-message event from socket ${socket.id}`);
        const { session_id, content, type } = msg;
        const sender_id = socket.user.id;

        if (!session_id || !sender_id || !content || !type) {
          logger.warn("Invalid message payload received:", msg);
          return;
        }

        const message = new Message({
          session_id,
          sender_id,
          content,
          type,
        });

        await message.save();

        logger.info(`New message saved and broadcasted in session ${session_id}`);
        console.log(`🔹 Clients in room ${session_id}:`, io.sockets.adapter.rooms.get(session_id));

        io.to(session_id).emit('receive-message', {
          _id: message._id,
          session_id,
          sender_id,
          content,
          type,
          timestamp: message.timestamp,
          is_read: false,
        });
      } catch (err) {
        logger.error(`Error while handling send-message: ${err.message}`);
      }
    });

    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });

    socket.on("upgrade", () => {
      logger.info("Transport upgraded:", socket.transport);
    });
    socket.on("error", (err) => {
      logger.error(`Socket error: ${err.message}`);
    });
  });
  
}

module.exports = socketHandler;
