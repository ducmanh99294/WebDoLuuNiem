const mongoose = require('mongoose');
const Chat = require('../models/Chat');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const logger = require('../utils/logger');

const onlineUsers = new Map(); // userId -> socket.id

module.exports = (io) => {
  logger.info('📡 Socket handler initialized');

  io.on('connection', (socket) => {
    logger.info(`✅ Client connected: ${socket.id}`);

    // Khi client xác định danh tính người dùng
    socket.on('user_connected', (userId) => {
      if (!mongoose.isValidObjectId(userId)) {
        logger.warn(`Invalid userId: ${userId}`);
        socket.emit('error', { message: 'Invalid user ID' });
        return;
      }
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
      if (!mongoose.isValidObjectId(sessionId)) {
        logger.warn(`Invalid sessionId: ${sessionId}`);
        socket.emit('error', { message: 'Invalid session ID' });
        return;
      }
      socket.join(sessionId);
      logger.info(`Socket ${socket.id} joined session ${sessionId}`);
    });

    // 📌 [2] Gửi tin nhắn mới vào 1 phiên (chat)
    socket.on('send-message', async (msg) => {
      try {
        const { session_id, content, type, parentMessageId } = msg;
        const sender_id = socket.user?.id;

        if (!mongoose.isValidObjectId(session_id) || !mongoose.isValidObjectId(sender_id) || !content || !type) {
          logger.warn('Invalid message payload:', msg);
          socket.emit('error', { message: 'Invalid session ID, sender ID, content, or type' });
          return;
        }

        const message = new Message({
          content,
          type,
        });
        await message.save();
        const chat = await Chat.findById(session_id);
        if (!chat || !chat.user.map(id => id.toString()).includes(sender_id)) {
          logger.warn(`Access denied for chat ${session_id} by user ${sender_id}`);
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        const newMessage = {
          sender: sender_id,
          content,
          type,
          timestamp: new Date(),
          parentMessageId: parentMessageId && mongoose.isValidObjectId(parentMessageId) ? parentMessageId : null
        };
        chat.messages.push(newMessage);
        await chat.save();

        const messageId = chat.messages[chat.messages.length - 1]._id;

        io.to(session_id).emit('receive-message', {
          _id: message._id,
          session_id: message.session_id,
          sender_id: message.sender_id,
          content: message.content,
          type: message.type,
          timestamp: message.timestamp,
          is_read: message.is_read,
          _id: messageId,
          session_id,
          sender_id,
          content,
          type,
          parentMessageId: newMessage.parentMessageId,
          timestamp: newMessage.timestamp,
          is_read: false
        });

        // Gửi thông báo tới người tham gia khác
        await Promise.all(chat.user.map(async userId => {
          if (userId.toString() !== sender_id) {
            const noti = await Notification.create({
              user: userId,
              sender: sender_id,
              type: 'chat',
              message: `Tin nhắn mới trong cuộc trò chuyện #${session_id}`,
              data: { chatId: session_id, message: content },
              priority: 'normal'
            });

            const receiverSocket = onlineUsers.get(userId.toString());
            if (receiverSocket) {
              io.to(receiverSocket).emit('notification', noti);
            }
          }
        }));

        logger.info(`💬 Message sent in chat ${session_id} by user ${sender_id}`);
      } catch (err) {
        logger.error(`❌ Error in send-message: ${err.message}`);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // 📌 [3] Đơn hàng mới
    socket.on('order_created', async ({ userId, orderNumber, orderId }) => {
      try {
        if (!mongoose.isValidObjectId(userId) || !orderNumber || !mongoose.isValidObjectId(orderId)) {
          logger.warn('Invalid order_created payload');
          socket.emit('error', { message: 'Invalid user ID, order number, or order ID' });
          return;
        }

        // Thông báo cho user
        const userNoti = await Notification.create({
          user: userId,
          type: 'order',
          message: `Đơn hàng ${orderNumber} của bạn đã được tạo`,
          data: { orderId },
          priority: 'high'
        });

        const receiverSocket = onlineUsers.get(userId.toString());
        if (receiverSocket) {
          io.to(receiverSocket).emit('notification', userNoti);
        }

        // Thông báo cho admin
        const admins = await mongoose.model('User').find({ role: 'admin' });
        await Promise.all(admins.map(async admin => {
          const adminNoti = await Notification.create({
            user: admin._id,
            sender: userId,
            type: 'order',
            message: `Đơn hàng mới #${orderNumber} từ người dùng`,
            data: { orderId },
            priority: 'high'
          });

          const adminSocket = onlineUsers.get(admin._id.toString());
          if (adminSocket) {
            io.to(adminSocket).emit('notification', adminNoti);
          }
        }));

        logger.info(`📦 Order notification sent for order ${orderNumber}`);
      } catch (err) {
        logger.error(`❌ Error in order_created: ${err.message}`);
        socket.emit('error', { message: 'Failed to process order notification' });
      }
    });

    // 📌 [4] Tham gia bình luận sản phẩm
    socket.on('join-comment', (productId) => {
      if (!mongoose.isValidObjectId(productId)) {
        logger.warn(`Invalid productId: ${productId}`);
        socket.emit('error', { message: 'Invalid product ID' });
        return;
      }
      socket.join(`product_${productId}`);
      logger.info(`Socket ${socket.id} joined comment room for product ${productId}`);
    });

    // 📌 [5] Gửi bình luận mới
    socket.on('send-comment', async ({ productId, senderId, content, parentMessageId }) => {
      try {
        if (!mongoose.isValidObjectId(productId) || !mongoose.isValidObjectId(senderId) || !content) {
          logger.warn('Invalid send-comment payload');
          socket.emit('error', { message: 'Invalid product ID, sender ID, or content' });
          return;
        }

        let commentThread = await Comment.findOne({ product: productId });

        const newMessage = {
          sender: senderId,
          content,
          timestamp: new Date(),
          parentMessageId: parentMessageId && mongoose.isValidObjectId(parentMessageId) ? parentMessageId : null
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

        const messageId = commentThread.messages[commentThread.messages.length - 1]._id;

        io.to(`product_${productId}`).emit('receive-comment', {
          productId,
          senderId,
          content,
          parentMessageId: newMessage.parentMessageId,
          timestamp: newMessage.timestamp,
          messageId
        });

        // Gửi thông báo
        await Promise.all(commentThread.user.map(async userId => {
          if (userId.toString() !== senderId) {
            const noti = await Notification.create({
              user: userId,
              sender: senderId,
              type: 'comment',
              message: `Bình luận mới cho sản phẩm #${productId}`,
              data: { productId, commentId: commentThread._id, message: content },
              priority: 'normal'
            });

            const receiverSocket = onlineUsers.get(userId.toString());
            if (receiverSocket) {
              io.to(receiverSocket).emit('notification', noti);
            }
          }
        }));

        logger.info(`📤 Comment emitted for product ${productId}`);
      } catch (err) {
        logger.error(`❌ Error in send-comment: ${err.message}`);
        socket.emit('error', { message: 'Failed to send comment' });
      }
    });

    // Hệ thống xử lý sự kiện kỹ thuật
    socket.on('upgrade', () => {
      logger.info('Transport upgraded:', socket.transport);
    });
  });
};