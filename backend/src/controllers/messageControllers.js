const messageService = require('../services/messageServices');
const logger = require('../utils/logger');

async function getMessageById(req, res) {
    try {
        logger.info(`Fetching message by ID: ${req.params.id}`);
        const message = await messageService.getMessageById(req.params.id);
        if (!message) {
            logger.warn(`Message not found: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                error: 'Message not found'
            });
        }
        res.status(200).json({
            success: true,
            message
        });
    } catch (err) {
        logger.error(`Error fetching message: ${err.message}`);
        res.status(400).json({
            success: false,
            error: 'Failed to fetch message',
            details: err.message
        });
    }
}

async function getAllMessages(req, res) {
    try {
        logger.info('Fetching all messages');
        const messages = await messageService.getAllMessages();
        res.status(200).json({
            success: true,
            messages
        });
    } catch (err) {
        logger.error(`Error fetching all messages: ${err.message}`);
        res.status(400).json({
            success: false,
            error: 'Failed to fetch messages',
            details: err.message
        });
    }
}

async function createMessage(req, res) {
    try {
        logger.info('Creating new message');
        const message = await messageService.createMessage(req.body);
        res.status(201).json({
            success: true,
            message
        });
    } catch (err) {
        logger.error(`Error creating message: ${err.message}`);
        res.status(400).json({
            success: false,
            error: 'Failed to create message',
            details: err.message
        });
    }
}

async function updateMessage(req, res) {
    try {
        logger.info(`Updating message by ID: ${req.params.id}`);
        const updatedMessage = await messageService.updateMessage(req.params.id, req.body);
        if (!updatedMessage) {
            logger.warn(`Message not found for update: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                error: 'Message not found'
            });
        }
        res.status(200).json({
            success: true,
            message: updatedMessage
        });
    } catch (err) {
        logger.error(`Error updating message: ${err.message}`);
        res.status(400).json({
            success: false,
            error: 'Failed to update message',
            details: err.message
        });
    }
}

async function deleteMessage(req, res) {
    try {
        logger.info(`Deleting message by ID: ${req.params.id}`);
        const deleted = await messageService.deleteMessage(req.params.id);
        if (!deleted) {
            logger.warn(`Message not found for deletion: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                error: 'Message not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Message deleted successfully'
        });
    } catch (err) {
        logger.error(`Error deleting message: ${err.message}`);
        res.status(400).json({
            success: false,
            error: 'Failed to delete message',
            details: err.message
        });
    }
}

module.exports = {
    getMessageById,
    getAllMessages,
    createMessage,
    updateMessage,
    deleteMessage
};
