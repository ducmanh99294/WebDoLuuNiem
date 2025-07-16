const Return = require('../models/Return');
const Order = require('../models/Order');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

const saveImages = async (files) => {
  try {
    const uploadDir = path.join(__dirname, '../../public/uploads/returns');
    await fs.mkdir(uploadDir, { recursive: true });

    const imageUrls = await Promise.all(files.map(async (file) => {
      const fileExt = path.extname(file.originalname);
      const fileName = `${uuidv4()}${fileExt}`;
      const filePath = path.join(uploadDir, fileName);
      
      await fs.writeFile(filePath, file.buffer);
      return `/uploads/returns/${fileName}`;
    }));

    return imageUrls;
  } catch (error) {
    logger.error('Failed to save images:', error);
    throw new Error('Không thể lưu ảnh trả hàng');
  }
};

const createReturn = async (data, files) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, orderId, description, reason } = data;

    // Kiểm tra order
    const order = await Order.findById(orderId).session(session);
    if (!order) {
      throw new Error('Không tìm thấy đơn hàng');
    }

    // Kiểm tra quyền
    if (order.user.toString() !== userId.toString()) {
      throw new Error('Bạn không có quyền trả đơn hàng này');
    }

    // Kiểm tra trạng thái order
    if (!['pending', 'delivered'].includes(order.status)) {
      throw new Error('Đơn hàng phải ở trạng thái chờ xác nhận hoặc đã giao để được trả hàng');
    }

    // Kiểm tra thời gian trả hàng (5 ngày kể từ createdAt)
    const fiveDaysInMs = 5 * 24 * 60 * 60 * 1000; // 5 ngày
    const currentTime = new Date();
    const orderCreationTime = new Date(order.createdAt);
    if (currentTime - orderCreationTime > fiveDaysInMs) {
      throw new Error('Đã quá 5 ngày kể từ khi đặt hàng, không thể trả hàng');
    }

    // Lưu ảnh
    const imageUrls = await saveImages(files);

    // Tạo return
    const newReturn = await Return.create([{
      user: userId,
      order: orderId,
      images: imageUrls,
      description,
      reason,
      status: 'pending'
    }], { session });

    await session.commitTransaction();
    return newReturn[0];

  } catch (error) {
    await session.abortTransaction();
    logger.error('Create return transaction failed:', error);
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = { createReturn };