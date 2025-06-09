const mongoose = require('mongoose');
const Notification = require('../models/Notification');

// Lấy danh sách thông báo của user
exports.getUserNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10, unreadOnly = false, type, priority } = req.query;

    // Validation
    const pageNum = Number(page);
    const limitNum = Number(limit);
    if (isNaN(pageNum) || pageNum < 1) throw new Error('Page phải là số lớn hơn 0');
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) throw new Error('Limit phải từ 1 đến 100');

    const filter = { user: req.user._id };
    if (Boolean(unreadOnly)) filter.is_read = false;
    if (type) {
      if (!['order', 'chat', 'comment', 'coupon', 'review'].includes(type)) {
        throw new Error('Type không hợp lệ');
      }
      filter.type = type;
    }
    if (priority) {
      if (!['low', 'normal', 'high'].includes(priority)) {
        throw new Error('Priority không hợp lệ');
      }
      filter.priority = priority;
    }

    const notifications = await Notification.find(filter)
      .sort({ created_at: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .select('type message data is_read priority created_at')
      .populate('sender', 'name email')
      .lean();

    const total = await Notification.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: notifications,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Không thể lấy thông báo',
      error: error.message
    });
  }
};

// Đánh dấu một thông báo là đã đọc
exports.markAsRead = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'ID thông báo không hợp lệ'
      });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { is_read: true },
      { new: true }
    ).select('type message data is_read priority created_at');

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đánh dấu đã đọc',
      error: error.message
    });
  }
};

// Đánh dấu tất cả thông báo là đã đọc
exports.markAllAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { user: req.user._id, is_read: false },
      { $set: { is_read: true } }
    );

    res.status(200).json({
      success: true,
      message: `Đã đánh dấu ${result.modifiedCount} thông báo là đã đọc`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể cập nhật trạng thái đọc',
      error: error.message
    });
  }
};

// Xóa tất cả thông báo của user
exports.deleteAllNotifications = async (req, res) => {
  try {
    const result = await Notification.deleteMany({ user: req.user._id });

    res.status(200).json({
      success: true,
      message: `Đã xóa ${result.deletedCount} thông báo`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể xóa thông báo',
      error: error.message
    });
  }
};

// Xóa một thông báo cụ thể
exports.deleteNotification = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'ID thông báo không hợp lệ'
      });
    }

    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Thông báo không tồn tại'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Đã xóa thông báo'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa thông báo',
      error: error.message
    });
  }
};

// Lấy số lượng thông báo chưa đọc
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user._id,
      is_read: false
    });

    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể lấy số lượng thông báo chưa đọc',
      error: error.message
    });
  }
};

module.exports = {
  getUserNotifications: exports.getUserNotifications,
  markAsRead: exports.markAsRead,
  markAllAsRead: exports.markAllAsRead,
  deleteAllNotifications: exports.deleteAllNotifications,
  deleteNotification: exports.deleteNotification,
  getUnreadCount: exports.getUnreadCount
};