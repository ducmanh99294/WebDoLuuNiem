const Notification = require('../models/Notification');
const Message = require('../models/Message');
const Comment = require('../models/Comment');
const logger = require('../utils/logger');
const { propfind } = require('../routes/commentRoutes');

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

        const message = new Message({
          content,
          type,
        });
        await message.save();

        logger.info(`💬 Message saved and emitted to session ${session_id}`);
        io.to(session_id).emit('receive-message', {
          _id: message._id,
          session_id: message.session_id,
          sender_id: message.sender_id,
          content: message.content,
          type: message.type,
          timestamp: message.timestamp,
        
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

    // Tham gia bình luận sản phẩm
    socket.on('join-comment', (productId) => {
      if (!productId) return;
      socket.join(`product_${productId}`);
      logger.info(`Socket ${socket.id} joined comment room for product ${productId}`);
    });

    // Gửi bình luận mới
    socket.on('send-comment', async ({ productId, senderId, content, parentMessageId }) => {
      try {
        if (!productId || !senderId || !content) {
          logger.warn("Invalid send-comment payload");
          return;
        }

        let commentThread = await Comment.findOne({ product: productId });

        const newMessage = {
          sender: senderId,
          content,
          timestamp: new Date(),
          parentMessageId: parentMessageId || null
        };

        if (!commentThread) {
          commentThread = await Comment.create({
            product: productId,
            user: [senderId],
            messages: [newMessage]
          });
        } else {
          if (!commentThread.user.includes(senderId)) {
            commentThread.user.push(senderId);
          }
          commentThread.messages.push(newMessage);
          await commentThread.save();
        }

        // Gửi comment mới tới room đúng
        io.to(`product_${productId}`).emit('receive-comment', {
          productId,
          senderId,
          content,
          parentMessageId,
          timestamp: newMessage.timestamp,
        });

        logger.info(`📤 Comment emitted for product ${productId}`);
      } catch (err) {
        logger.error(`❌ Error in send-comment: ${err.message}`);
      }
    });

  });
};

