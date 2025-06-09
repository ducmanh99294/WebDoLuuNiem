const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const logger = require('../utils/logger');

const createOrder = async (req, res) => {
  try {
    const { user, order_number, products, total_price, shipping, payment } = req.body;

    // Validation
    if (!user || !order_number || !products || !total_price || !shipping) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin cần thiết: user, order_number, products, total_price, shipping'
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

    // Kiểm tra sản phẩm tồn tại và đủ số lượng
    await Promise.all(products.map(async (p) => {
      const product = await Product.findById(p.product);
      if (!product || product.quantity < p.quantity) {
        throw new Error(`Sản phẩm ${p.product} không đủ số lượng`);
      }
    }));

    const newOrder = await Order.create({
      user: req.user._id,
      order_number,
      products: products.map(p => ({
        product: p.product,
        quantity: p.quantity,
        price: p.price,
        total_price: p.quantity * p.price
      })),
      total_price,
      shipping,
      payment
    });

    // Tạo thông báo cho người dùng
    await Notification.create({
      user: newOrder.user,
      sender: req.user._id,
      type: 'order',
      message: `Đơn hàng #${newOrder.order_number} đã được tạo thành công`,
      data: { orderId: newOrder._id },
      priority: 'high'
    });

    // Tạo thông báo cho admin
    const admins = await mongoose.model('User').find({ role: 'admin' });
    await Promise.all(admins.map(admin =>
      Notification.create({
        user: admin._id,
        sender: req.user._id,
        type: 'order',
        message: `Đơn hàng mới #${newOrder.order_number} từ người dùng ${req.user.name}`,
        data: { orderId: newOrder._id },
        priority: 'high'
      })
    ));

    // Emit socket
    req.io.to(newOrder.user.toString()).emit('order_created', {
      userId: newOrder.user,
      orderNumber: newOrder.order_number,
      orderId: newOrder._id
    });

    res.status(201).json({
      success: true,
      message: 'Tạo đơn hàng thành công',
      order: newOrder
    });
  } catch (error) {
    logger.error(`Error creating order: ${error.message}`);
    res.status(500).json({
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
      .populate('products.product', 'name price')
      .populate('shipping.shipping_company', 'name')
      .populate('shipping.shipper', 'name phone');

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách đơn hàng thành công',
      orders
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
      .select('order_number status total_price products shipping payment createdAt')
      .populate('user', 'name email')
      .populate('products.product', 'name price')
      .populate('shipping.shipping_company', 'name')
      .populate('shipping.shipper', 'name phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Đơn hàng không tồn tại'
      });
    }

    if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
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

    order.status = status;
    await order.save();

    // Cập nhật sell_count khi trạng thái là delivered
    if (status === 'delivered') {
      await Promise.all(order.products.map(async (item) => {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { sell_count: item.quantity }
        });
      }));
      logger.info(`Updated sell_count for products in order ${order._id}`);
    }

    // Tạo thông báo
    await Notification.create({
      user: order.user,
      sender: req.user._id,
      type: 'order',
      message: `Đơn hàng #${order.order_number} đã được cập nhật trạng thái thành ${status}`,
      data: { orderId: order._id, status },
      priority: 'high'
    });

    // Emit socket
    req.io.to(order.user.toString()).emit('order_updated', {
      orderId: order._id,
      orderNumber: order.order_number,
      status
    });

    const populatedOrder = await Order.findById(req.params.id)
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

    // Tạo thông báo
    await Notification.create({
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

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
};