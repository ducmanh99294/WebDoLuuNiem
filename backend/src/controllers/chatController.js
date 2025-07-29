const mongoose = require('mongoose');
const Chat = require('../models/Chat');
const Product = require('../models/Product');
const { sendNotification } = require('../services/notifyService');
const logger = require('../utils/logger');

const createChat = async (req, res) => {
  try {
    const { senderId, recipientId, productId } = req.body;

    if (!senderId || !recipientId) {
      logger.error('senderId and recipientId are required');
      return res.status(400).json({
        success: false,
        message: 'senderId and recipientId are required'
      });
    }
    if (!mongoose.isValidObjectId(senderId) || !mongoose.isValidObjectId(recipientId) || (productId && !mongoose.isValidObjectId(productId))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid senderId, recipientId, or productId'
      });
    }

    let chat = await Chat.findOne({ 
      user: { $all: [senderId, recipientId] },
      product: productId || null
    });

    if (!chat) {
      chat = new Chat({
        user: [senderId, recipientId],
        product: productId || null,
      });
      await chat.save();
    }

    logger.info(`Chat created successfully with ID: ${chat._id}`);
    res.status(200).json({
      success: true,
      message: 'Chat created successfully',
      data: chat
    });
  } catch (error) {
    logger.error(`Error creating chat: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to create chat',
      error: error.message
    });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;
    const senderId = req.user._id;

    if (!chatId || !content) {
      return res.status(400).json({
        success: false,
        message: 'chatId and content are required'
      });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    const message = {
      sender: senderId,
      content,
      timestamp: new Date(),
      is_read: false
    };
    chat.messages.push(message);
    await chat.save();

    // Gửi thông báo cho các user trong chat (trừ người gửi)
    await Promise.all(chat.user.map(async userId => {
      if (userId.toString() !== senderId.toString()) {
        await sendNotification({
          user: userId,
          sender: senderId,
          type: 'chat',
          message: `Bạn có tin nhắn mới trong cuộc trò chuyện #${chat._id}`,
          data: { chatId: chat._id, content },
          priority: 'normal',
          io: req.io,
          socketRoom: userId.toString(),
          socketEvent: 'chat_updated',
          socketPayload: {
            chatId: chat._id,
            senderId,
            content,
            timestamp: message.timestamp,
            messageId: chat.messages[chat.messages.length - 1]._id
          }
        });
      }
    }));

    res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      chat
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      err: err.message
    });
  }
};

const getAllChats = async (req, res) => {
  try {
    const { productId, userId } = req.query;
    let query = {};

    if (req.user.role !== 'admin') {
      if (!userId || userId !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized access to chats'
        });
      }
      query = { user: { $in: [new mongoose.Types.ObjectId(userId)] } }; // Sửa ở đây
    } else {
      // Admin xem tất cả chat mà admin là thành viên
      query = { user: { $in: [new mongoose.Types.ObjectId(req.user._id)] } }; // Sửa ở đây
    }

    if (productId) {
      if (!mongoose.isValidObjectId(productId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid productId'
        });
      }
      query = { ...query, product: new mongoose.Types.ObjectId(productId) }; // Sửa ở đây
    }

    const chats = await Chat.find(query)
      .populate('user', 'name email')
      .populate('messages.sender', 'name email')
      .populate('product', 'name price images discount')
      .lean();

    logger.info(`Retrieved ${chats.length} chats`);
    res.status(200).json({
      success: true,
      message: 'Retrieved all chats successfully',
      chats
    });
  } catch (error) {
    console.error('Error in getAllChats:', error.stack);
    logger.error(`Error retrieving chats: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve chats',
      error: error.message
    });
  }
};

const getChatById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid chat ID'
      });
    }

    const chat = await Chat.findById(req.params.id)
      .populate('user', 'name email')
      .populate('messages.sender', 'name email')
      .populate('product', 'name price');

    if (!chat) {
      logger.warn(`Chat not found with ID: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    if (req.user.role !== 'admin' && !chat.user.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this chat'
      });
    }

    logger.info(`Retrieved chat with ID: ${req.params.id}`);
    res.status(200).json({
      success: true,
      message: 'Retrieved chat successfully',
      chat
    });
  } catch (error) {
    logger.error(`Error retrieving chat ${req.params.id}: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve chat',
      error: error.message
    });
  }
};

const getChatByUserId = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid chat ID'
      });
    }

    const userId = req.params.id;
    if (userId !== req.user._id.toString()) {
      logger.warn('Unauthorized access to chat by user ID');
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access to chat'
      });
    }

    const chats = await Chat.find({ user: { $in: [new mongoose.Types.ObjectId(userId)] } }) // Sửa ở đây
      .populate('user', 'name email')
      .populate('messages.sender', 'name email')
      .populate('product', 'name price images discount')
      .lean();

    if (!chats || chats.length === 0) {
      logger.warn(`No chats found for user ID: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'No chats found'
      });
    }

    logger.info(`Retrieved chats for user ID: ${req.params.id}`);
    res.status(200).json({
      success: true,
      message: 'Retrieved chats successfully',
      data: chats
    });
  } catch (error) {
    logger.error(`Error retrieving chats for user ${req.params.id}: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve chats',
      error: error.message
    });
  };
};

const updateChat = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid chat ID'
      });
    }

    const { messages } = req.body;
    if (messages && (!Array.isArray(messages) || messages.some(msg => !msg.content))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid messages array'
      });
    }

    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      logger.warn(`Chat not found with ID: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    if (req.user.role !== 'admin' && !chat.user.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this chat'
      });
    }

    if (messages) {
      const newMessages = messages.map(msg => ({
        sender: req.user._id,
        content: msg.content,
        timestamp: new Date(),
        is_read: false
      }));
      chat.messages.push(...newMessages);
    }

    await chat.save();

    // Gửi thông báo cho các user trong chat (trừ người gửi)
    if (messages) {
      await Promise.all(chat.user.map(async userId => {
        if (userId.toString() !== req.user._id.toString()) {
          await sendNotification({
            user: userId,
            sender: req.user._id,
            type: 'chat',
            message: `Cuộc trò chuyện #${chat._id} có tin nhắn mới từ ${req.user.name}`,
            data: { chatId: chat._id, message: newMessages[0].content },
            priority: 'normal',
            io: req.io,
            socketRoom: userId.toString(),
            socketEvent: 'chat_updated',
            socketPayload: {
              chatId: chat._id,
              senderId: req.user._id,
              content: newMessages[0].content,
              timestamp: newMessages[0].timestamp,
              messageId: chat.messages[chat.messages.length - 1]._id
            }
          });
        }
      }));
    }

    const populatedChat = await Chat.findById(req.params.id)
      .populate('user', 'name email')
      .populate('messages.sender', 'name email')
      .populate('product', 'name price');

    logger.info(`Updated chat with ID: ${req.params.id}`);
    res.status(200).json({
      success: true,
      message: 'Chat updated successfully',
      chat: populatedChat
    });
  } catch (error) {
    logger.error(`Error updating chat ${req.params.id}: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to update chat',
      error: error.message
    });
  }
};

const deleteChat = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid chat ID'
      });
    }

    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      logger.warn(`Chat not found with ID: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete chats'
      });
    }

    await chat.deleteOne();

    // Gửi thông báo cho các user trong chat
    await Promise.all(chat.user.map(async userId => {
      if (userId.toString() !== req.user._id.toString()) {
        await sendNotification({
          user: userId,
          sender: req.user._id,
          type: 'chat',
          message: `Cuộc trò chuyện #${chat._id} đã bị xóa`,
          data: { chatId: chat._id },
          priority: 'normal'
        });
      }
    }));

    logger.info(`Deleted chat with ID: ${req.params.id}`);
    res.status(200).json({
      success: true,
      message: 'Chat deleted successfully',
      chat
    });
  } catch (error) {
    logger.error(`Error deleting chat ${req.params.id}: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to delete chat',
      error: error.message
    });
  }
};

module.exports = {
  createChat,
  getAllChats,
  getChatById,
  getChatByUserId,
  updateChat,
  deleteChat,
  sendMessage,
};