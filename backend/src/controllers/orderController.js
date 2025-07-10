const mongoose = require('mongoose');
const Order = require('../models/Order');
// const OrderDetail = require('../models/OrderDetail');
const Product = require('../models/Product');
const { sendNotification } = require('../services/notifyService');
const logger = require('../utils/logger');
const { Console } = require('winston/lib/winston/transports');

const createOrder = async (req, res) => {
  try {
    const { user, order_number, products, shipping, payment, customer, coupon = [] } = req.body;

    // ✅ Validate cơ bản
    if (!user || !order_number || !products || !shipping || !payment || !customer) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc: user, order_number, products, shipping, payment, customer'
      });
    }

    if (!customer.fullName || !customer.phone || !customer.email) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin người nhận: fullName, phone, email'
      });
    }

    if (!mongoose.isValidObjectId(user)) {
      return res.status(400).json({
        success: false,
        message: 'ID người dùng không hợp lệ'
      });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Danh sách sản phẩm không hợp lệ'
      });
    }

    if (products.some(p => !mongoose.isValidObjectId(p.product) || p.quantity < 1 || p.price < 0)) {
      return res.status(400).json({
        success: false,
        message: 'Sản phẩm không hợp lệ'
      });
    }

    if (!shipping.address || shipping.price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Thông tin vận chuyển không hợp lệ'
      });
    }

    // ✅ Kiểm tra tồn kho từng sản phẩm
    await Promise.all(products.map(async (p) => {
      const product = await Product.findById(p.product);
      if (!product || product.quantity < p.quantity) {
        throw new Error(`Sản phẩm ${p.product} không đủ số lượng`);
      }
    }));

    // ✅ Tính tổng tiền gốc
    let rawTotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

    // ✅ Kiểm tra và áp dụng coupon
    let discountPercent = 0;
    if (coupon.length > 0) {
      const couponDoc = await mongoose.model('Coupons').findById(coupon[0]);

      if (!couponDoc) {
        return res.status(400).json({
          success: false,
          message: 'Mã giảm giá không hợp lệ'
        });
      }

      if (couponDoc.expiry_date < new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Mã giảm giá đã hết hạn'
        });
      }

      discountPercent = couponDoc.discount || 0;
    }

    // ✅ Tổng sau giảm + phí vận chuyển
    const finalTotal = Math.max(0, rawTotal * (1 - discountPercent / 100) + shipping.price);

    // ✅ Tạo đơn hàng
    const newOrder = await Order.create({
      user,
      order_number,
      products: products.map(p => ({
        product: p.product,
        quantity: p.quantity,
        price: p.price,
        total_price: p.price * p.quantity
      })),
      coupon,
      total_price: finalTotal,
      customer,
      shipping,
      payment
    });

    // ✅ Gửi thông báo cho người dùng
    await sendNotification({
      user: newOrder.user,
      sender: req.user._id,
      type: 'order',
      message: `Đơn hàng #${newOrder.order_number} đã được tạo thành công`,
      data: { orderId: newOrder._id },
      priority: 'high',
      io: req.io,
      socketRoom: newOrder.user.toString(),
      socketEvent: 'order_created',
      socketPayload: {
        userId: newOrder.user,
        orderNumber: newOrder.order_number,
        orderId: newOrder._id
      }
    });

    // ✅ Gửi thông báo cho admin
    const admins = await mongoose.model('User').find({ role: 'admin' });
    await Promise.all(admins.map(admin =>
      sendNotification({
        user: admin._id,
        sender: req.user._id,
        type: 'order',
        message: `Đơn hàng mới #${newOrder.order_number} từ người dùng ${req.user.name}`,
        data: { orderId: newOrder._id },
        priority: 'high'
      })
    ));

    return res.status(201).json({
      success: true,
      message: 'Tạo đơn hàng thành công',
      order: newOrder
    });

  } catch (error) {
    logger.error(`Error creating order: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo đơn hàng',
      error: error.message
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Chỉ admin mới có quyền xem tất cả đơn hàng'
      });
    }

    const orders = await Order.find()
      .select('order_number status total_price user createdAt')
      .populate('user', 'name email')
      .populate('coupon', 'code discount')
      // .populate('product_id.product', 'name price')
      .populate('shipping.shipping_company', 'name')
      .populate('shipping.shipper', 'name phone');

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách đơn hàng thành công',
      orders,
    });
  } catch (error) {
    logger.error(`Error retrieving orders: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách đơn hàng',
      error: error.message
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'ID đơn hàng không hợp lệ'
      });
    }

    const order = await Order.findById(req.params.id)
      .populate('user', 'name email') 
      .populate({
        path: 'products.product',
        select: 'name price images',
        populate: {
          path: 'images',
          select: 'image'
        }
      })
      .populate('shipping.shipping_company', 'name')
      .populate('shipping.shipper', 'name phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Đơn hàng không tồn tại'
      });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'Chưa xác thực người dùng'
      });
    }

    const isAdmin = req.user.role === 'admin';
    const isOwner = order.user && order.user._id.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xem đơn hàng này'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    logger.error(`Error retrieving order ${req.params.id}: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy đơn hàng',
      error: error.message
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'ID đơn hàng không hợp lệ'
      });
    }

    if (!status || !['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái đơn hàng không hợp lệ'
      });
    }

    // Tìm đơn hàng nhưng không cập nhật
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Đơn hàng không tồn tại'
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Chỉ admin mới có quyền cập nhật trạng thái đơn hàng'
      });
    }

    // SỬA: Sử dụng findByIdAndUpdate để tránh validate toàn bộ đối tượng
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { 
        new: true,
        runValidators: false, // Tắt validation khi chỉ cập nhật status
        setDefaultsOnInsert: false
      }
    );
    
    // Cập nhật sell_count khi trạng thái là delivered
    if (status === 'delivered') {
      await Promise.all(updatedOrder.products.map(async (item) => {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { sell_count: item.quantity }
        });
      }));
      logger.info(`Updated sell_count for products in order ${updatedOrder._id}`);
    }

    // Gửi thông báo
    await sendNotification({
      user: updatedOrder.user,
      sender: req.user._id,
      type: 'order',
      message: `Đơn hàng #${updatedOrder.order_number} đã được cập nhật trạng thái thành ${status}`,
      data: { orderId: updatedOrder._id, status },
      priority: 'high',
      io: req.io,
      socketRoom: updatedOrder.user.toString(),
      socketEvent: 'order_updated',
      socketPayload: {
        orderId: updatedOrder._id,
        orderNumber: updatedOrder.order_number,
        status
      }
    });

    // Populate lại dữ liệu để trả về
    const populatedOrder = await Order.findById(updatedOrder._id)
      .populate('user', 'name email')
      .populate('products.product', 'name price')
      .populate('shipping.shipping_company', 'name')
      .populate('shipping.shipper', 'name phone');

    res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái đơn hàng thành công',
      order: populatedOrder
    });
  } catch (error) {
    logger.error(`Error updating order ${req.params.id}: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật trạng thái',
      error: error.message
    });
  }
};


const deleteOrder = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'ID đơn hàng không hợp lệ'
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      logger.warn(`Order not found with ID: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Đơn hàng không tồn tại'
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Chỉ admin mới có quyền xóa đơn hàng'
      });
    }

    await order.deleteOne();

    // Gửi thông báo
    await sendNotification({
      user: order.user,
      sender: req.user._id,
      type: 'order',
      message: `Đơn hàng #${order.order_number} đã bị xóa`,
      data: { orderId: order._id },
      priority: 'high'
    });

    res.status(200).json({
      success: true,
      message: 'Xóa đơn hàng thành công',
      order
    });
  } catch (error) {
    logger.error(`Error deleting order ${req.params.id}: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa đơn hàng',
      error: error.message
    });
  }
};

const confirmOrder = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'ID not  found'
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'order not found'
      });
    }

    const products = await Product.findById(OrderDetail.product_id);
    if(!products) {
      return res.status(404).json({
        success: false,
        message: 'product not found'
      });
    }
    if( products.quantity < OrderDetail.quantity) {
      return res.status(400).json({
        success: false,
        message: 'not enough product quantity'
      });
    }

    products.quantity -= OrderDetail.quantity;
    await products.save();

    order.status = 'confirmed';
    await order.save();

    // Tạo thông báo
    await Notification.create({
      user: order.user,
      sender: req.user._id,
      type: 'order',
      message: `order #${order.order_number} is confirmed`,
      data: { orderId: order._id },
      priority: 'high'
    });

    res.status(200).json({
      success: true,
      message: 'confirm order successfully',
      order
    });
  } catch (error) {
    logger.error(`Error confirming order ${req.params.id}: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'error confirming order',
      error: error.message
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'ID not found'
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'order not found'
      });
    }

    if (order.status !== 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'only allready cancelled order'
      });
    }

    const products = await Product.findById(OrderDetail.product_id);
    if(!products) {
      return res.status(404).json({
        success: false,
        message: 'product not found'
      });
    }

    product.quantity += OrderDetail.quantity;
    await products.save();

    order.status = 'cancelled';
    await order.save();

    // Tạo thông báo
    await Notification.create({
      user: order.user,
      sender: req.user._id,
      type: 'order',
      message: `order #${order.order_number} is cancelled`,
      data: { orderId: order._id },
      priority: 'high'
    });

    res.status(200).json({
      success: true,
      message: 'cancel order successfully',
      order
    });
  } catch (error) {
    logger.error(`Error cancelling order ${req.params.id}: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'error cancelling order',
      error: error.message
    });
  }
};

const useCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    const coupon = await mongoose.model('Coupons').findOne({ code: code });
    const order = await Order.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'coupon not found'
      });
    }

    if (coupon.expiry_date < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'this coupon has expired'
      });
    }

    // Kiểm tra xem người dùng đã sử dụng mã này chưa
    if (coupon.applicable_users.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'you have already used this coupon'
      });
    }

    if (!Array.isArray(order.coupon)) {
      order.coupon = [];
    } else if (order.coupon.some(id => id.equals(coupon._id))) {
      return res.status(400).json({
        success: false,
        message: 'This coupon has already been applied to this order'
      });
    }

    // Cập nhật người dùng đã sử dụng mã
    coupon.applicable_users.push(req.user.id);
    // Cập nhật đơn hàng với mã giảm giá
    console.log("order", coupon._id ,order._id, order.coupon);
    if (!Array.isArray(order.coupon)) {
      order.coupon = [];
    }
    order.coupon.push(coupon._id);
    // await coupon.save();
    await order.save();
    res.status(200).json({
      success: true,
      message: 'Coupon applied successfully',
      data: coupon
    });
  } catch (error) {
    logger.error(`Error using coupon: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error using coupon',
      error: error.message
    });
  }
};

const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu userId'
      });
    }

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate({
    path: 'products.product',
    select: 'name price images',
    populate: {
      path: 'images',
      select: 'image'
    }
  })
      .populate('coupon')
      .populate('shipping.shipping_company')
      .populate('shipping.shipper');

    res.status(200).json({
      success: true,
      message: 'Lấy đơn hàng theo user thành công',
      data: orders
    });
  } catch (error) {
    console.error('Lỗi khi lấy đơn hàng theo user:', error.message);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  confirmOrder,
  cancelOrder,
  useCoupon,
  getOrdersByUserId
};