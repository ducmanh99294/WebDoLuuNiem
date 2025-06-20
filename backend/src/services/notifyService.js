const Notification = require('../models/Notification');
const logger = require('../utils/logger');
// xử lí gửi nhận tbao
async function sendNotification({
  user,
  sender = null,
  type,
  message,
  data = {},
  priority = 'normal',
  io = null,
  socketRoom = null,
  socketEvent = null,
  socketPayload = {}
}) {
  try {
    // Ghi vào database
    const notification = await Notification.create({
      user,
      sender,
      type,
      message,
      data,
      priority
    });

    logger.info(`Notification sent to user ${user} - type: ${type}`);

    // Nếu có socket, emit luôn
    if (io && socketRoom && socketEvent) {
      io.to(socketRoom).emit(socketEvent, socketPayload);
      logger.debug(`Socket emitted to ${socketRoom}: ${socketEvent}`);
    }

    return notification;
  } catch (error) {
    logger.error(`Failed to send notification: ${error.message}`);
    throw error;
  }
}

module.exports = {
  sendNotification
};
