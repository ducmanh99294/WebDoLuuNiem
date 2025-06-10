const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { validateToken } = require('../middlewares/authMiddleware');

router.use(validateToken);

// Lấy danh sách thông báo (hỗ trợ phân trang, lọc unreadOnly, type, priority)
router.get('/', notificationController.getUserNotifications);

// Lấy số lượng thông báo chưa đọc
router.get('/unread-count', notificationController.getUnreadCount);

// Đánh dấu một thông báo là đã đọc
router.patch('/:id/read', notificationController.markAsRead);

// Đánh dấu tất cả thông báo là đã đọc
router.patch('/read-all', notificationController.markAllAsRead);

// Xóa một thông báo cụ thể
router.delete('/:id', notificationController.deleteNotification);

// Xóa tất cả thông báo của user
router.delete('/', notificationController.deleteAllNotifications);

module.exports = router;