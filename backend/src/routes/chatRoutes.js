const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { validateToken } = require('../middlewares/authMiddleware');
const authRoles = require('../middlewares/authRoles');

router.post('/',validateToken, chatController.createChat);
router.get('/', chatController.getAllChats);
router.get('/:id',validateToken, chatController.getChatById);
router.put('/:id',validateToken, authRoles('admin'), chatController.updateChat);
router.delete('/:id',validateToken, authRoles('admin'), chatController.deleteChat);

module.exports = router;