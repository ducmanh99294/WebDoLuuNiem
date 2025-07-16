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
    throw new Error('Failed to save return images');
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
      throw new Error('Order not found');
    }

    // Kiểm tra quyền
    if (order.user.toString() !== userId.toString()) {
      throw new Error('You do not have permission to return this order');
    }

    // Kiểm tra trạng thái order
    if (!['delivered', 'completed'].includes(order.status)) {
      throw new Error('Order must be delivered or completed to return');
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
