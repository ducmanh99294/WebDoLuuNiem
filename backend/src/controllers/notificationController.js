const Notification = require('../models/Notification');

// 📌 Lấy tất cả thông báo của user
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ created_at: -1 });
    
    res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (err) {
    console.error('Error in getUserNotifications:', err);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ. Không thể lấy thông báo.'
    });
  }
};

// 📌 Đánh dấu tất cả thông báo là đã đọc
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, is_read: false },
      { $set: { is_read: true } }
    );

    res.status(200).json({
      success: true,
      message: 'Tất cả thông báo đã được đánh dấu là đã đọc.'
    });
  } catch (err) {
    console.error('Error in markAllAsRead:', err);
    res.status(500).json({
      success: false,
      message: 'Không thể cập nhật trạng thái đọc của thông báo.'
    });
  }
};

// 📌 Xoá tất cả thông báo của user
exports.deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user._id });

    res.status(200).json({
      success: true,
      message: 'Đã xoá toàn bộ thông báo.'
    });
  } catch (err) {
    console.error('Error in deleteAllNotifications:', err);
    res.status(500).json({
      success: false,
      message: 'Không thể xoá thông báo.'
    });
  }
};
