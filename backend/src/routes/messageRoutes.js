const express = require('express');
const messageController = require('../controllers/messageControllers');
const { validateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', validateToken, messageController.getAllMessages);
router.get('/:id', validateToken, messageController.getMessageById);
router.post('/', validateToken, messageController.createMessage);
router.put('/:id', validateToken, messageController.updateMessage);
router.delete('/:id', validateToken, messageController.deleteMessage);

module.exports = router;