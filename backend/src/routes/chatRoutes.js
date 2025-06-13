const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { validateToken } = require('../middlewares/authMiddleware');

// Bảo vệ tất cả route bằng JWT
router.use(validateToken);

// Tạo cuộc trò chuyện mới
router.post('/', chatController.createChat);
// Lấy tất cả cuộc trò chuyện của người dùng
router.get('/', chatController.getAllChats);

// Lấy cuộc trò chuyện theo ID
router.get('/:id', chatController.getChatById);

// Cập nhật cuộc trò chuyện (user trong chat hoặc admin)
router.patch('/:id', chatController.updateChat);

// Xóa cuộc trò chuyện (user trong chat hoặc admin)
router.delete('/:id', chatController.deleteChat);

module.exports = router;