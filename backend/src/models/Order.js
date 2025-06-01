const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  order_number: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  total_price: {
    type: Number,
    required: true
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products'
      },
      quantity: Number,
      price: Number,
      total_price: Number
    }
  ],
  shipping: {
    shipping_company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ShippingCompanies'
    },
    shipper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shippers'
    },
    address: String,
    price: Number,
    description: String
  },
  payment: {
    method: {
      type: String,
      enum: ['cod', 'paypal', 'momo', 'bank'],
      default: 'cod'
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    time: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Orders', orderSchema);
