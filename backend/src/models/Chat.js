const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  user: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Products',
    default: null
  },
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 1000
    },
    type: {
      type: String,
      required: true,
      enum: ['text', 'image', 'file'],
      default: 'text'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    parentMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    is_read: {
      type: Boolean,
      default: false
    }
  }]
}, { timestamps: true });

// Đảm bảo user không trùng lặp
chatSchema.pre('save', function (next) {
  const uniqueUsers = new Set(this.user.map(id => id.toString()));
  if (uniqueUsers.size !== this.user.length) {
    throw new Error('Danh sách user không được chứa trùng lặp');
  }
  next();
});

// Index để tối ưu truy vấn
chatSchema.index({ user: 1, product: 1, createdAt: -1 });

module.exports = mongoose.model('Chats', chatSchema);