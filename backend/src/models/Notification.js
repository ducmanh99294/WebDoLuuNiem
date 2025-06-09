const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: {
    type: String,
    enum: ['order', 'chat', 'comment', 'coupon', 'review'],
    required: true
  },
  message: { type: String, required: true, trim: true },
  data: { type: mongoose.Schema.Types.Mixed },
  is_read: { type: Boolean, default: false },
  //Thêm trường priority: Để phân loại thông báo (ví dụ: high cho đơn hàng, normal cho chat)
  priority: {
    type: String,
    enum: ['low', 'normal', 'high'],
    default: 'normal'
  },
  created_at: { type: Date, default: Date.now }
});

// Validation cho trường data dựa trên type
notificationSchema.pre('save', function (next) {
  if (this.data) {
    switch (this.type) {
      case 'order':
        if (!this.data.orderId) throw new Error('data.orderId is required for order notifications');
        break;
      case 'chat':
        if (!this.data.chatId) throw new Error('data.chatId is required for chat notifications');
        break;
      case 'comment':
        if (!this.data.productId || !this.data.commentId) {
          throw new Error('data.productId and data.commentId are required for comment notifications');
        }
        break;
    }
  }
  next();
});

// Index để tối ưu truy vấn
notificationSchema.index({ user: 1, is_read: 1, created_at: -1 });
notificationSchema.index({ type: 1 });

module.exports = mongoose.model('Notification', notificationSchema);