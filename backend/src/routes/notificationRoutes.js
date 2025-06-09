const express = require('express');
const router = express.Router();
const { validateToken } = require('../middlewares/authMiddleware');
const controller = require('../controllers/notificationController');

// all route cần xác thực token
router.use(validateToken);

router.get('/', controller.getUserNotifications);

// Đánh dấu all đã đọc
router.put('/mark-all-read', controller.markAllAsRead);

//  Xoá all thông báo
router.delete('/delete-all', controller.deleteAllNotifications);

module.exports = router;
