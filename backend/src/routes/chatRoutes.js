const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authRoles = require('../middlewares/authRoles');


router.post('/', chatController.createChat);
router.get('/', authRoles, chatController.getAllChats);
router.get('/:id', chatController.getChatById);
router.put('/:id', chatController.updateChat);
router.delete('/:id', chatController.deleteChat);

// 
// router.post('/', validateToken, chatController.createChat); // Yêu cầu token để tạo chat
// router.get('/', validateToken, authRoles('admin'), chatController.getAllChats); // Chỉ admin được xem tất cả chat
// router.get('/:id', validateToken, chatController.getChatById); // Yêu cầu token để xem chat theo ID
// router.put('/:id', validateToken, authRoles('admin'), chatController.updateChat); // Chỉ admin được cập nhật chat
// router.delete('/:id', validateToken, authRoles('admin'), chatController.deleteChat); // Chỉ admin được xóa chat
//

module.exports = router;