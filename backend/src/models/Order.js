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
      enum: [
            'pending',
            'processing',
            'paid', 
            'failed', 
            'cancelled',
            'refunded'  
      ],
      default: 'pending'
    },
    time: Date
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema, 'orders');

Order.watch().on('change', async (change) => {
    if (['insert', 'update', 'replace'].includes(change.operationType)) {
        let orderDoc = null;

        if (change.operationType === 'insert' || change.operationType === 'replace') {
            orderDoc = change.fullDocument;
        } else if (change.operationType === 'update') {
            orderDoc = await Order.findById(change.documentKey._id);
        }

        if (orderDoc && orderDoc.status === 'delivered') {
            for (const item of orderDoc.products) {
                const sellCount = await Order.aggregate([
                    { $match: { status: 'delivered' } },
                    { $unwind: '$products' },
                    { $match: { 'products.product': item.product } },
                    { $group: { _id: '$products.product', total: { $sum: '$products.quantity' } } }
                ]);
                const totalSold = sellCount[0]?.total || 0;
                await mongoose.model('Products').findByIdAndUpdate(
                    item.product,
                    { sell_count: totalSold }
                );
            }
        }
    }
});

module.exports = Order;
