const Notification = require('../models/Notification');

// Lấy danh sách thông báo của user
exports.getUserNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10, unreadOnly = false } = req.query;
    const filter = { user: req.user._id };
    if (unreadOnly === 'true') filter.is_read = false;

    const notifications = await Notification.find(filter)
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('sender', 'name email')
      .lean();

    const total = await Notification.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: notifications,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể lấy thông báo',
      error: error.message
    });
  }
};

// Đánh dấu một thông báo là đã đọc
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { is_read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Thông báo không tồn tại'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Đã đánh dấu là đã đọc',
      data: notification
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đánh dấu đã đọc',
      error: err.message
    });
  }
};

// Đánh dấu tất cả thông báo là đã đọc
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, is_read: false },
      { $set: { is_read: true } }
    );

    res.status(200).json({
      success: true,
      message: 'Tất cả thông báo đã được đánh dấu là đã đọc'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Không thể cập nhật trạng thái đọc của thông báo',
      error: err.message
    });
  }
};

// Xoá tất cả thông báo của user
exports.deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user._id });

    res.status(200).json({
      success: true,
      message: 'Đã xoá toàn bộ thông báo'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Không thể xoá thông báo',
      error: err.message
    });
  }
};
