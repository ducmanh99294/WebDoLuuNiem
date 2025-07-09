const mongoose = require('mongoose');
const logger = require('../utils/logger');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Products',
      required: true
    },  
  }],
  customer: {
    fullName: { 
      type: String ,
      required: true
    },
    phone: { 
      type: String,
      required: true
    },
    email: { 
      type: String,
      required: true
    }
},

  order_number: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
    match: /^[A-Z0-9]{6,12}$/
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
  coupon: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupons',
    default: null
  }],
  shipping: {
    shipping_company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ShippingCompanies'
    },
    shipper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shippers'
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
orderSchema.index({ user: 1, status: 1, createdAt: -1 });

const Order = mongoose.model('Order', orderSchema, 'orders');
module.exports = Order;