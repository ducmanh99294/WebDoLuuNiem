const mongoose = require('mongoose');
const Chat = require('../models/Chat');
const { sendNotification } = require('../services/notifyService');
const logger = require('../utils/logger');

const createChat = async (req, res) => {
    try {
        const { senderId, recipientId } = req.body;

        // Validation
        if (!senderId || !recipientId) {
            logger.error('senderId and recipientId are required');
            return res.status(400).json({
                success: false,
                message: 'senderId and recipientId are required'
            });
        }
        if (!mongoose.isValidObjectId(senderId) || !mongoose.isValidObjectId(recipientId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid senderId or recipientId'
            });
        }

        let chat = await Chat.findOne({ 
            user: { $all: [senderId, recipientId] }
        });

        if (!chat) {
            chat = new Chat({
                user: [senderId, recipientId],
            });
            await chat.save();

            // Gửi thông báo cho recipient
            await sendNotification({
                user: recipientId,
                sender: senderId,
                type: 'chat',
                message: `Bạn có một cuộc trò chuyện mới từ người dùng ${req.user.name}`,
                data: { chatId: chat._id },
                priority: 'normal',
                io: req.io,
                socketRoom: recipientId.toString(),
                socketEvent: 'chat_created',
                socketPayload: {
                    chatId: chat._id,
                    senderId,
                    recipientId
                }
            });
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

const getAllChats = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admins can view all chats'
            });
        }

        const chats = await Chat.find()
            .populate('user', 'name email')
            .populate('messages.sender', 'name email')
            .populate('product', 'name price');

        logger.info(`Retrieved ${chats.length} chats`);
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
                timestamp: new Date()
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
    updateChat,
    deleteChat,
};