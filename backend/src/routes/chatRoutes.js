const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { validateToken } = require('../middlewares/authMiddleware');
const authRoles = require('../middlewares/authRoles');

router.post('/private',validateToken, chatController.createChatOneToOne);
router.post('/group',validateToken, chatController.createChatGroupProduct);
router.get('/', validateToken, authRoles('admin'),  chatController.getAllChats);
router.get('/:id',validateToken, chatController.getChatById);
router.put('/:id',validateToken, authRoles('admin'), chatController.updateChat);
router.delete('/:id',validateToken, authRoles('admin'), chatController.deleteChat);

// 
// router.post('/', validateToken, chatController.createChat); // Yêu cầu token để tạo chat
// router.get('/', validateToken, authRoles('admin'), chatController.getAllChats); // Chỉ admin được xem tất cả chat
// router.get('/:id', validateToken, chatController.getChatById); // Yêu cầu token để xem chat theo ID
// router.put('/:id', validateToken, authRoles('admin'), chatController.updateChat); // Chỉ admin được cập nhật chat
// router.delete('/:id', validateToken, authRoles('admin'), chatController.deleteChat); // Chỉ admin được xóa chat
//


module.exports = router;