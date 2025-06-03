const express = require('express');
const messageController = require('../controllers/messageControllers');

const router = express.Router();

// Get all messages
router.get('/', messageController.getAllMessages);

// Get a single message by ID
router.get('/:id', messageController.getMessageById);

// Create a new message
router.post('/', messageController.createMessage);

// Update a message by ID
router.put('/:id', messageController.updateMessage);

// Delete a message by ID
router.delete('/:id', messageController.deleteMessage);

module.exports = router;