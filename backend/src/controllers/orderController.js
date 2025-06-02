const Order = require('../models/Order');

// Tạo đơn hàng mới
const createOrder = async (req, res) => {
  try {
    const orderData = req.body;

    const newOrder = await Order.create(orderData);

    res.status(201).json({
      success: true,
      message: 'Tạo đơn hàng thành công',
      order: newOrder
    });
  } catch (error) {
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
    const orders = await Order.find()
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
    const order = await Order.findById(req.params.id)
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

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
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

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Đơn hàng không tồn tại'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái đơn hàng thành công',
      order
    });
  } catch (error) {
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
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Đơn hàng không tồn tại'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa đơn hàng thành công',
      order
    });
  } catch (error) {
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
