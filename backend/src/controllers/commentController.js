const Comment = require('../models/Comment');
const logger = require('../utils/logger');

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

        let comment = await Comment.findOne({ product: productId });
        if (!comment) {
            comment = new Comment({
                users: [senderId],
                product: productId,
                parentMessageId: parentMessageId || null,
                messages: []
            });
        } else if (!comment.user.includes(senderId)) {
            comment.user.push(senderId); // thêm người dùng nếu chưa có
        }
        
        comment.messages.push(...messages);
        
        await comment.save();

        logger.info(`Messages added to comment with ID: ${chat._id}`);
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
        const comment = await Comment.find()
                .populate('user', 'name email')
                .populate('messages.sender', 'name email')
                .populate('product', 'name price');;
        logger.info(`Retrieved ${comment.length} comment`);
        res.status(200).json({
            success: true,
            message: 'Retrieved all comment successfully',
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

const getCommentById = async (req, res) => {
    try {
        const comment = await Comment.findOne({
            _id: req.params.id,
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
        const comment = await Comment.findOneAndUpdate(
            {id: req.params.id},
            req.body, 
            { new: true }
        ).populate('user', 'name email');
        logger.info(`Updating Comment with ID: ${req.params.id}`);
        if (!comment) {
            logger.warn(`Comment not found with ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Comment updated successfully',
            comment
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
        const comment = await Comment.findOneAndDelete({id: req.params.id});
        if (!comment) {
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
            comment
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
    createComment,
    getAllComments,
    getCommentById,
    updateComment,
    deleteComment
};