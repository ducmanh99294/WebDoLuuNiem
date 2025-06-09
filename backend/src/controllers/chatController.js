const mongoose = require('mongoose');
const Chat = require('../models/Chat');
const Notification = require('../models/Notification');
const logger = require('../utils/logger');

const createChat = async (req, res) => {
  try {
    const { senderId, recipientId, messages, parentMessageId } = req.body;

    // Validation
    if (!senderId || !recipientId || !messages || !Array.isArray(messages) || messages.length === 0) {
      logger.error('senderId, recipientId, and messages are required');
      return res.status(400).json({
        success: false,
        message: 'senderId, recipientId, and messages are required'
      });
    }
    if (!mongoose.isValidObjectId(senderId) || !mongoose.isValidObjectId(recipientId)) {
      return res.status(400).json({
        success: false,
        message: 'senderId hoặc recipientId không hợp lệ'
      });
    }
    if (senderId === recipientId) {
      return res.status(400).json({
        success: false,
        message: 'senderId và recipientId không được trùng nhau'
      });
    }
    if (messages.some(msg => !msg.content || typeof msg.content !== 'string')) {
      return res.status(400).json({
        success: false,
        message: 'Mỗi tin nhắn phải có nội dung hợp lệ'
      });
    }

    let chat = await Chat.findOne({ 
      user: { $all: [senderId, recipientId], $size: 2 }
    });

    if (!chat) {
      chat = new Chat({
        user: [senderId, recipientId],
        parentMessageId: parentMessageId && mongoose.isValidObjectId(parentMessageId) ? parentMessageId : null,
        messages: []
      });
    }

    chat.messages.push(...messages.map(msg => ({
      sender: senderId,
      content: msg.content,
      timestamp: new Date()
    })));
    await chat.save();

    // Tạo thông báo cho recipient
    await Notification.create({
      user: recipientId,
      sender: senderId,
      type: 'chat',
      message: `Bạn nhận được tin nhắn mới trong cuộc trò chuyện #${chat._id}`,
      data: { chatId: chat._id, message: messages[messages.length - 1].content },
      priority: 'normal'
    });

    logger.info(`Messages sent successfully in chat with ID: ${chat._id}`);
    res.status(200).json({
      success: true,
      message: 'Messages sent successfully',
      chat
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

const getAllChats = async (req, res) => {
  try {
    // Chỉ lấy chat của người dùng hiện tại
    const chats = await Chat.find({ user: req.user._id })
      .select('user messages createdAt updatedAt')
      .populate('user', 'name email')
      .populate('messages.sender', 'name email');

    logger.info(`Retrieved ${chats.length} chats for user ${req.user._id}`);
    res.status(200).json({
      success: true,
      message: 'Retrieved all chats successfully',
      chats
    });
  } catch (error) {
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
        message: 'ID cuộc trò chuyện không hợp lệ'
      });
    }

    const chat = await Chat.findById(req.params.id)
      .select('user messages createdAt updatedAt')
      .populate('user', 'name email')
      .populate('messages.sender', 'name email');

    if (!chat) {
      logger.warn(`Chat not found with ID: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Kiểm tra quyền truy cập
    if (!chat.user.map(id => id.toString()).includes(req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xem cuộc trò chuyện này'
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

const updateChat = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'ID cuộc trò chuyện không hợp lệ'
      });
    }

    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.some(msg => !msg.content)) {
      return res.status(400).json({
        success: false,
        message: 'Danh sách tin nhắn không hợp lệ'
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

    // Kiểm tra quyền truy cập
    if (!chat.user.map(id => id.toString()).includes(req.user._id.toString()) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền cập nhật cuộc trò chuyện này'
      });
    }

    chat.messages.push(...messages.map(msg => ({
      sender: req.user._id,
      content: msg.content,
      timestamp: new Date()
    })));
    await chat.save();

    // Tạo thông báo cho các user khác trong chat
    await Promise.all(chat.user.map(async userId => {
      if (userId.toString() !== req.user._id.toString()) {
        await Notification.create({
          user: userId,
          sender: req.user._id,
          type: 'chat',
          message: `Cuộc trò chuyện #${chat._id} đã được cập nhật với tin nhắn mới`,
          data: { chatId: chat._id, message: messages[messages.length - 1].content },
          priority: 'normal'
        });
      }
    }));

    const populatedChat = await Chat.findById(req.params.id)
      .populate('user', 'name email')
      .populate('messages.sender', 'name email');

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
        message: 'ID cuộc trò chuyện không hợp lệ'
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

    // Kiểm tra quyền truy cập
    if (!chat.user.map(id => id.toString()).includes(req.user._id.toString()) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xóa cuộc trò chuyện này'
      });
    }

    await chat.deleteOne();

    // Tạo thông báo cho các user khác
    await Promise.all(chat.user.map(async userId => {
      if (userId.toString() !== req.user._id.toString()) {
        await Notification.create({
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
  updateChat,
  deleteChat
};