const Chat = require('../models/Chat');
const logger = require('../utils/logger');

// ______________CHAT______________
const createChat = async (req, res) => {
    try {
        const { senderId, recipientId, productId, messages, parentMessageId } = req.body;

        if (!senderId || !recipientId || !messages || !Array.isArray(messages) || messages.length === 0) {
            logger.error('need are validation required');
            return res.status(400).json({
                success: false,
                message: 'need are validation required'
            });
        }

        let chat = await Chat.findOne({ 
            user: { $all: [senderId, recipientId] },
            product: productId
        });

        if (!chat) {
            chat = new Chat({
                session: 'chat',
                user: [senderId, recipientId],
                product: productId,
                parentMessageId: parentMessageId || null,
                messages: messages || []
            });
        }

        chat.messages.push(...messages);

        await chat.save();
        
        logger.info(`Messages sent successfully in chat with ID: ${chat._id}`);
        res.status(200).json({
            success: true,
            message: 'send messages successfully',
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
        const chats = await Chat.find({session: 'chat'})
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
        const chat = await Chat.findOne({_id: req.params.id, session: 'chat'})
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

// ______________COMMENT______________
const createComment = async (req, res) => {
    try {
        const { senderId, productId, messages, parentMessageId} = req.body;

        if (!senderId || !productId || !messages || !Array.isArray(messages) || messages.length === 0) {
            logger.error('sender ID and Product ID and Messages are required');
            return res.status(400).json({
                success: false,
                message: 'sender ID and Product ID and Messages are required'
            });
        }

        let chat = await Chat.findOne({ product: productId });
        if (!chat) {
            chat = new Chat({
                session: 'comment',
                users: [senderId],
                product: productId,
                parentMessageId: parentMessageId || null,
                messages: []
            });
        } else if (!chat.user.includes(senderId)) {
            chat.user.push(senderId); // thêm người dùng nếu chưa có
        }
        
        chat.messages.push(...messages);
        
        await chat.save();

        logger.info(`Messages added to chat with ID: ${chat._id}`);
        res.status(200).json({
            success: true,
            message: 'messages added successfully',
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

const getAllComments = async (req, res) => {
    try {
        const chats = await Chat.find({session: 'comment'})
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

const getCommentById = async (req, res) => {
    try {
        const comment = await Chat.findOne({
            _id: req.params.id,
            session: 'comment'
        })
        .populate('user', 'name email')
        .populate('messages.sender', 'name email')
        .populate('product', 'name price');

        if (!comment) {
            logger.warn(`Comment not found with ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        logger.info(`Retrieved comment with ID: ${req.params.id}`);
        res.status(200).json({
            success: true,
            message: 'Retrieved comment successfully',
            comment
        });
    } catch (error) {
        logger.error(`Error retrieving comment: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve comment',
            error: error.message
        });
    }
}

const updateComment = async (req, res) => {
    try {
        const chat = await Chat.findOneAndUpdate(
            {id: req.params.id,session: 'comment'},
            req.body, 
            { new: true }
        ).populate('user', 'name email');
        logger.info(`Updating Comment with ID: ${req.params.id}`);
        if (!chat) {
            logger.warn(`Comment not found with ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Comment updated successfully',
            chat
        });
    } catch (error) {
        logger.error(`Error updating Comment: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to update Comment',
            error: error.message
        });
    }
}

const deleteComment = async (req, res) => {
    try {
        const chat = await Chat.findOneAndDelete({id: req.params.id, session: 'comment'});
        if (!chat) {
            logger.warn(`Comment not found with ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }
        logger.info(`Deleted Comment with ID: ${req.params.id}`);
        res.status(200).json({
            success: true,
            message: 'Comment deleted successfully',
            chat
        });
    } catch (error) {
        logger.error(`Error deleting Comment: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to delete Comment',
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
    // Comment
    createComment,
    getAllComments,
    getCommentById,
    updateComment,
    deleteComment
};