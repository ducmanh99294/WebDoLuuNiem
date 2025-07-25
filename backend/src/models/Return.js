const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Người dùng là bắt buộc'],
    index: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Đơn hàng là bắt buộc'],
    index: true
  },
  images: {
    type: [String],
    required: [true, 'Hình ảnh là bắt buộc'],
    validate: {
      validator: function(v) {
        return v.length >= 3;
      },
      message: 'Cần ít nhất 3 hình ảnh'
    }
  },
  description: {
    type: String,
    required: [true, 'Mô tả là bắt buộc'],
    minlength: [5, 'Mô tả cần ít nhất 5 ký tự'],
    maxlength: [500, 'Mô tả tối đa 500 ký tự']
  },
  reason: {
    type: String,
    required: [true, 'Lý do là bắt buộc'],
    enum: {
      values: ['wrong_item', 'damaged', 'not_as_described', 'other'],
      message: 'Lý do không hợp lệ'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  processedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index phức hợp
returnSchema.index({ user: 1, status: 1 });
returnSchema.index({ order: 1, status: 1 });

// Virtual populate
returnSchema.virtual('userInfo', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: true
});

returnSchema.virtual('orderInfo', {
  ref: 'Order',
  localField: 'order',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.model('Return', returnSchema);