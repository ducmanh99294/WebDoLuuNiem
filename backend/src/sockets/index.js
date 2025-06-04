const Notification = require('../models/Notification');
const Message = require('../models/Message');
const logger = require('../utils/logger');

const onlineUsers = new Map(); // userId -> socket.id

module.exports = (io) => {
  logger.info("📡 Socket handler initialized");

  io.on('connection', (socket) => {
    logger.info(`✅ Client connected: ${socket.id}`);

    // Khi client xác định danh tính người dùng
    socket.on('user_connected', (userId) => {
      onlineUsers.set(userId, socket.id);
      logger.info(`👤 User online: ${userId}`);
      io.emit('online_users', Array.from(onlineUsers.keys()));
    });

    // Khi client rời đi
    socket.on('disconnect', () => {
      for (const [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          logger.info(`❌ User disconnected: ${userId}`);
          break;
        }
      }
      io.emit('online_users', Array.from(onlineUsers.keys()));
    });

    // 📌 [1] User tham gia phiên hỗ trợ hoặc chat
    socket.on('join-session', (sessionId) => {
      logger.info(`Socket ${socket.id} attempting to join session ${sessionId}`);
      if (!sessionId) {
        logger.warn(`join-session called with invalid sessionId`);
        return;
      }
      socket.join(sessionId);
      logger.info(`Socket ${socket.id} joined session ${sessionId}`);
    });

    // 📌 [2] Gửi tin nhắn mới vào 1 phiên (support/chat)
    socket.on('send-message', async (msg) => {
      try {
        logger.info(`Received send-message event from socket ${socket.id}`);
        const { session_id, content, type } = msg;
        const sender_id = socket.user?.id; // socket.user được set từ middleware auth

        if (!session_id || !sender_id || !content || !type) {
          logger.warn("Invalid message payload received:", msg);
          return;
        }

        // Lưu tin nhắn
        const message = new Message({
          session_id,
          sender_id,
          content,
          type
        });
        await message.save();

        logger.info(`💬 Message saved and emitted to session ${session_id}`);
        io.to(session_id).emit('receive-message', {
          _id: message._id,
          session_id,
          sender_id,
          content,
          type,
          timestamp: message.timestamp,
          is_read: false,
        });

        // 🔔 Gửi thông báo tới người tham gia khác trong session
        const participants = await Message.distinct('sender_id', { session_id });
        for (const participantId of participants) {
          if (participantId.toString() !== sender_id) {
            const noti = await Notification.create({
              user: participantId,
              type: 'support',
              message: `Tin nhắn mới trong phiên hỗ trợ`
            });

            const receiverSocket = onlineUsers.get(participantId.toString());
            if (receiverSocket) {
              io.to(receiverSocket).emit('notification', noti);
            }
          }
        }

      } catch (err) {
        logger.error(`❌ Error in send-message: ${err.message}`);
      }
    });

    // [Optional] Đơn hàng mới (nếu client emit socket)
    socket.on('order_created', async ({ userId, orderNumber }) => {
      const noti = await Notification.create({
        user: userId,
        type: 'order',
        message: `Đơn hàng ${orderNumber} của bạn đã được tạo.`
      });

      const receiverSocket = onlineUsers.get(userId);
      if (receiverSocket) {
        io.to(receiverSocket).emit('notification', noti);
      }
    });

    // Hệ thống xử lý sự kiện kỹ thuật
    socket.on("upgrade", () => {
      logger.info("Transport upgraded:", socket.transport);
    });

    socket.on("error", (err) => {
      logger.error(`Socket error: ${err.message}`);
    });
  });
};
