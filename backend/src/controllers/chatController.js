const Chat = require('../models/Chat');
const logger = require('../utils/logger');

const createChat = async (req, res) => {
    try {
        const {user , messages} = req.body;
        logger.info(`Creating chat for user: ${user}`);
        if(!user) {
            logger.warn('User ID is required to create a chat');
            return res.status(400).json({ 
                success: false,
                error: 'User ID is required' 
            });
        } 
        const chat = await Chat.create({user, messages});
        logger.info(`Chat created successfully: ${chat._id}`);
        res.status(201).json({
            success: true,
            message: 'Chat created successfully',
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
}

const getAllChats = async (req, res) => {
    try {
        const chats = await Chat.find()
                .populate('user', 'name email')
                .populate('messages.sender', 'name email')
                .populate('product', 'name price');;
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
    createChat,
    getAllChats,
    getChatById,
    updateChat,
    deleteChat,
};