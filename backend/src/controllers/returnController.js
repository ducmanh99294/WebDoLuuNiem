const { createReturn } = require('../services/returnService');
const Return = require('../models/Return');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendNotification } = require('../services/notifyService');
const logger = require('../utils/logger');
const mongoose = require('mongoose');

const createReturnRequest = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User not authenticated'
      });
    }

    if (!req.is('multipart/form-data')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid content type. Expected multipart/form-data'
      });
    }

    const { orderId, description, reason } = req.body;
    const files = req.files;

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID'
      });
    }

    if (!description || description.length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập mô tả lỗi ít nhất 5 ký tự'
      });
    }

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn lý do trả hàng'
      });
    }

    if (!files || files.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Cần ít nhất 3 hình ảnh'
      });
    }

    const newReturn = await createReturn({
      userId: req.user._id,
      orderId,
      description,
      reason
    }, files);

    return res.status(201).json({
      success: true,
      message: 'Yêu cầu trả hàng đã được tạo thành công',
      data: newReturn
    });
  } catch (error) {
    logger.error('Return creation error:', error);
    const statusCode = error.message.includes('not found') ? 404 :
                      error.message.includes('permission') ? 403 :
                      error.message.includes('invalid') ? 400 : 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Không thể tạo yêu cầu trả hàng'
    });
  }
};

const approveReturn = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Chỉ admin mới có quyền phê duyệt yêu cầu trả hàng'
      });
    }

    const { returnId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(returnId)) {
      return res.status(400).json({
        success: false,
        message: 'ID yêu cầu trả hàng không hợp lệ'
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Tìm yêu cầu trả hàng
      const returnRequest = await Return.findById(returnId).session(session);
      if (!returnRequest) {
        throw new Error('Không tìm thấy yêu cầu trả hàng');
      }

      if (returnRequest.status !== 'pending') {
        throw new Error('Yêu cầu trả hàng không ở trạng thái chờ xử lý');
      }

      // Tìm đơn hàng liên quan
      const order = await Order.findById(returnRequest.order).session(session);
      if (!order) {
        throw new Error('Không tìm thấy đơn hàng liên quan');
      }

      // Cập nhật trạng thái yêu cầu trả hàng
      returnRequest.status = 'approved';
      returnRequest.processedBy = req.user._id;
      returnRequest.processedAt = new Date();
      await returnRequest.save({ session });

      // Cập nhật trạng thái đơn hàng thành cancelled
      order.status = 'cancelled';
      await order.save({ session });

      // Tăng lại số lượng sản phẩm trong kho
      await Promise.all(order.products.map(async (item) => {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { quantity: item.quantity } },
          { session }
        );
      }));

      // Gửi thông báo cho người dùng
      await sendNotification({
        user: order.user,
        sender: req.user._id,
        type: 'return',
        message: `Yêu cầu trả hàng cho đơn hàng #${order.order_number} đã được phê duyệt. Đơn hàng đã bị hủy.`,
        data: { orderId: order._id, returnId },
        priority: 'high',
        io: req.io,
        socketRoom: order.user.toString(),
        socketEvent: 'return_approved',
        socketPayload: {
          orderId: order._id,
          orderNumber: order.order_number,
          status: 'cancelled'
        }
      });

      await session.commitTransaction();

      return res.status(200).json({
        success: true,
        message: 'Yêu cầu trả hàng đã được phê duyệt và đơn hàng đã bị hủy',
        data: returnRequest
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    logger.error('Approve return error:', error);
    const statusCode = error.message.includes('not found') ? 404 :
                      error.message.includes('trạng thái') ? 400 : 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Không thể phê duyệt yêu cầu trả hàng'
    });
  }
};

module.exports = { createReturnRequest, approveReturn };