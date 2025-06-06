const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { validateToken } = require('../middlewares/authMiddleware');
const authRoles = require('../middlewares/authRoles');

// ______________CHAT______________
router.post('/chat',validateToken, chatController.createChat);
router.get('/chat',validateToken, authRoles('admin'), chatController.getAllChats);
router.get('/chat/:id',validateToken, chatController.getChatById);
router.put('/chat/:id',validateToken, authRoles('admin'), chatController.updateChat);
router.delete('/chat/:id',validateToken, authRoles('admin'), chatController.deleteChat);


// _____________COMMENT______________
router.post('/comment',validateToken, chatController.createComment);
router.get('/comment',validateToken, authRoles('admin'), chatController.getAllComments);
router.get('/comment/:id', chatController.getCommentById);
router.put('/comment/:id',validateToken, authRoles('admin'), chatController.updateComment);
router.delete('/comment/:id',validateToken, authRoles('admin'), chatController.deleteComment);

module.exports = router;