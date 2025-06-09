const mongoose = require('mongoose');
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const logger = require('../utils/logger');

// Tạo đơn hàng mới
const createOrder = async (req, res) => {
  try {
    const orderData = req.body;

    // Validation
    if (!orderData.user || !orderData.order_number || !orderData.products || !orderData.total_price || !orderData.shipping) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin cần thiết: user, order_number, products, total_price, shipping'
      });
    }
    if (!mongoose.isValidObjectId(orderData.user)) {
      return res.status(400).json({
        success: false,
        message: 'ID người dùng không hợp lệ'
      });
    }
    if (!Array.isArray(orderData.products) || orderData.products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Danh sách sản phẩm không hợp lệ'
      });
    }

    const newOrder = await Order.create({
      ...orderData,
      user: req.user._id // Đảm bảo user từ token
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

    // Tạo thông báo cho admin (giả định có role admin)
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

// Lấy tất cả đơn hàng
const getAllOrders = async (req, res) => {
  try {
    // Chỉ admin được xem tất cả đơn hàng
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

// Lấy đơn hàng theo ID
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

    // Kiểm tra quyền truy cập
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

// Cập nhật trạng thái đơn hàng
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

    // Chỉ admin được cập nhật trạng thái
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Chỉ admin mới có quyền cập nhật trạng thái đơn hàng'
      });
    }

    order.status = status;
    await order.save();

    // Tạo thông báo cho người dùng
    await Notification.create({
      user: order.user,
      sender: req.user._id,
      type: 'order',
      message: `Đơn hàng #${order.order_number} đã được cập nhật trạng thái thành ${status}`,
      data: { orderId: order._id, status },
      priority: 'high'
    });

    res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái đơn hàng thành công',
      order
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

// Xóa đơn hàng
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
      return res.status(404).json({
        success: false,
        message: 'Đơn hàng không tồn tại'
      });
    }

    // Chỉ admin được xóa đơn hàng
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Chỉ admin mới có quyền xóa đơn hàng'
      });
    }

    await order.deleteOne();

    // Tạo thông báo cho người dùng
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