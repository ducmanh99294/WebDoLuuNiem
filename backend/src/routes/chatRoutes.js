const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { validateToken } = require('../middlewares/authMiddleware');

// Bảo vệ tất cả route bằng JWT
router.use(validateToken);

// Tạo cuộc trò chuyện mới
router.post('/', validateToken, chatController.createChat);
// Lấy tất cả cuộc trò chuyện của người dùng
router.get('/', validateToken, chatController.getAllChats);

// Lấy cuộc trò chuyện theo ID
router.get('/:id', validateToken, chatController.getChatById);

router.get('/user/:id', validateToken, chatController.getChatByUserId)

// Cập nhật cuộc trò chuyện (user trong chat hoặc admin)
router.patch('/:id', validateToken, chatController.updateChat);

// Xóa cuộc trò chuyện (user trong chat hoặc admin)
router.delete('/:id', validateToken, chatController.deleteChat);
 
// router file
router.post('/messages', validateToken, chatController.sendMessage);

module.exports = router;