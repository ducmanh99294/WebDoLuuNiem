const { createReturn } = require('../services/returnService');
const { sendNotification } = require('../services/notifyService');
const logger = require('../utils/logger');
const mongoose = require('mongoose');

const createReturnRequest = async (req, res) => {
  try {
    // Kiểm tra user đã đăng nhập
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User not authenticated'
      });
    }

    // Kiểm tra FormData
    if (!req.is('multipart/form-data')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid content type. Expected multipart/form-data'
      });
    }

    const { orderId, description, reason } = req.body;
    const files = req.files;

    // Validate input
    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID'
      });
    }

    if (!description || description.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Description must be at least 10 characters'
      });
    }

    if (!reason || reason.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Reason must be at least 10 characters'
      });
    }

    if (!files || files.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'At least 3 images are required'
      });
    }

    // Tạo return
    const newReturn = await createReturn({
      userId: req.user._id,
      orderId,
      description,
      reason
    }, files);

    return res.status(201).json({
      success: true,
      message: 'Return request created successfully',
      data: newReturn
    });

  } catch (error) {
    logger.error('Return creation error:', error);
    
    // Phân loại lỗi để trả về status code phù hợp
    const statusCode = error.message.includes('not found') ? 404 :
                      error.message.includes('permission') ? 403 :
                      error.message.includes('invalid') ? 400 : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to create return request'
    });
  }
};

module.exports = { createReturnRequest };
