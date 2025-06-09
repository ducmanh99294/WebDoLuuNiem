const mongoose = require('mongoose');
const logger = require('../utils/logger');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order_number: {
    type: String,
    required: true,
    unique: true,
    match: /^[A-Z0-9]{6,12}$/ // Ví dụ: mã đơn hàng 6-12 ký tự chữ/số
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  total_price: {
    type: Number,
    required: true,
    min: 0
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true, min: 0 },
      total_price: { type: Number, required: true, min: 0 }
    }
  ],
  shipping: {
    shipping_company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ShippingCompany'
    },
    shipper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shipper'
    },
    address: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true }
  },
  payment: {
    method: {
      type: String,
      enum: ['cod', 'paypal', 'momo', 'bank'],
      default: 'cod'
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'paid', 'failed', 'cancelled', 'refunded'],
      default: 'pending'
    },
    time: { type: Date }
  }
}, {
  timestamps: true
});

// Validation trước khi lưu
orderSchema.pre('save', function (next) {
  if (this.products.length === 0) {
    throw new Error('Đơn hàng phải có ít nhất một sản phẩm');
  }
  if (this.total_price <= 0) {
    throw new Error('Tổng giá phải lớn hơn 0');
  }
  next();
});

// Index để tối ưu truy vấn
orderSchema.index({ order_number: 1 });
orderSchema.index({ user: 1, status: 1, createdAt: -1 });

const Order = mongoose.model('Order', orderSchema, 'orders');

// Pipeline watch để cập nhật sell_count
Order.watch().on('change', async (change) => {
  try {
    if (['insert', 'update', 'replace'].includes(change.operationType)) {
      let orderDoc = null;

      if (change.operationType === 'insert' || change.operationType === 'replace') {
        orderDoc = change.fullDocument;
      } else if (change.operationType === 'update') {
        orderDoc = await Order.findById(change.documentKey._id);
      }

      if (orderDoc && orderDoc.status === 'delivered') {
        const sellCounts = await Order.aggregate([
          { $match: { status: 'delivered' } },
          { $unwind: '$products' },
          { $group: { _id: '$products.product', total: { $sum: '$products.quantity' } } }
        ]);

        await Promise.all(sellCounts.map(async ({ _id, total }) => {
          await mongoose.model('Product').findByIdAndUpdate(
            _id,
            { sell_count: total },
            { new: true }
          );
        }));
        logger.info(`Updated sell_count for products in order ${orderDoc._id}`);
      }
    }
  } catch (error) {
    logger.error(`Error in Order watch pipeline: ${error.message}`);
  }
});

module.exports = Order;