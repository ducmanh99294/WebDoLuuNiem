const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  user: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
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
    timestamp: {
      type: Date,
      default: Date.now
    },
    parentMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    }
  }]
}, {
  timestamps: true
});

// Validation: Đảm bảo user không trùng lặp
chatSchema.pre('save', function (next) {
  const uniqueUsers = new Set(this.user.map(id => id.toString()));
  if (uniqueUsers.size !== this.user.length) {
    throw new Error('Danh sách user không được chứa trùng lặp');
  }
  if (this.user.length < 2) {
    throw new Error('Chat phải có ít nhất 2 người dùng');
  }
  next();
});

// Index để tối ưu truy vấn
chatSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Chat', chatSchema, 'chats');