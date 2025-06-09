const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // người nhận thông báo
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // người tạo hành động
  type: {
    type: String,
    enum: ['order', 'chat', 'comment', 'coupon', 'review'],
    required: true
  },
  message: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed },
  is_read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
