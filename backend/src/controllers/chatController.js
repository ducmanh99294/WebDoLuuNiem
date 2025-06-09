const Chat = require('../models/Chat');
const logger = require('../utils/logger');

const createChat = async (req, res) => {
    try {
        const { senderId, recipientId, parentMessageId } = req.body;

        if (!senderId || !recipientId) {
            logger.error('need are validation required: ' + error.message);
            return res.status(400).json({
                success: false,
                message: 'need are validation required'
            });
        }

        let chat = await Chat.findOne({ 
            user: { $all: [senderId, recipientId] },
        });

        if (!chat) {
            chat = new Chat({
                user: [senderId, recipientId],
                parentMessageId: parentMessageId || null,
                messages: messages || []
            });
        }

        await chat.save();
        
        logger.info(`Chat created successfully with ID: ${chat._id}`);
        res.status(200).json({
            success: true,
            message: 'send messages successfully',
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
}

const getAllChats = async (req, res) => {
    try {
        const chats = await Chat.find()
                .populate('user', 'name email')
                .populate('messages.sender', 'name email');
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
}

const getChatById = async (req, res) => {
    try {
        const chat = await Chat.findOne({_id: req.params.id})
            .populate('user', 'name email')
            .populate('messages.sender', 'name email')
        if (!chat) {
            logger.warn(`Chat not found with ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Chat not found'
            });
        }
        logger.info(`Retrieved chat with ID: ${req.params.id}`);
        res.status(200).json({
            success: true,
            message: 'Retrieved chat successfully',
            chat
        });
    } catch (error) {
        logger.error(`Error retrieving chat: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve chat',
            error: error.message
        });
    }
}

const updateChat = async (req, res) => {
    try {
        const chat = await Chat.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        ).populate('user', 'name email');
        logger.info(`Updating chat with ID: ${req.params.id}`);
        if (!chat) {
            logger.warn(`Chat not found with ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Chat not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Chat updated successfully',
            chat
        });
    } catch (error) {
        logger.error(`Error updating chat: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to update chat',
            error: error.message
        });
    }
}

const deleteChat = async (req, res) => {
    try {
        const chat = await Chat.findByIdAndDelete(req.params.id);
        if (!chat) {
            logger.warn(`Chat not found with ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Chat not found'
            });
        }
        logger.info(`Deleted chat with ID: ${req.params.id}`);
        res.status(200).json({
            success: true,
            message: 'Chat deleted successfully',
            chat
        });
    } catch (error) {
        logger.error(`Error deleting chat: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to delete chat',
            error: error.message
        });
    }
}

module.exports = {
    // Chat
    createChat,
    getAllChats,
    getChatById,
    updateChat,
    deleteChat,
};