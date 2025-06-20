const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const { sendNotification } = require('../services/notifyService');
const logger = require('../utils/logger');

const createComment = async (req, res) => {
  try {
    const { senderId, productId, messages, parentMessageId } = req.body;

    // Validation
    if (!senderId || !productId || !messages || !Array.isArray(messages) || messages.length === 0) {
      logger.error('senderId, productId, and messages are required');
      return res.status(400).json({
        success: false,
        message: 'senderId, productId, and messages are required'
      });
    }
    if (!mongoose.isValidObjectId(senderId) || !mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid senderId or productId'
      });
    }
    if (parentMessageId && !mongoose.isValidObjectId(parentMessageId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid parentMessageId'
      });
    }
    if (messages.some(msg => !msg.content || typeof msg.content !== 'string')) {
      return res.status(400).json({
        success: false,
        message: 'Each message must have valid content'
      });
    }

    let comment = await Comment.findOne({ product: productId });
    const newMessages = messages.map(msg => ({
      sender: senderId,
      content: msg.content,
      timestamp: new Date(),
      parentMessageId: parentMessageId || null
    }));

    if (!comment) {
      comment = new Comment({
        user: [senderId],
        product: productId,
        messages: newMessages
      });
    } else {
      if (!comment.user.includes(senderId)) {
        comment.user.push(senderId);
      }
      comment.messages.push(...newMessages);
    }

    await comment.save();

    // Gửi thông báo cho các user liên quan
    await Promise.all(comment.user.map(async userId => {
      if (userId.toString() !== senderId) {
        await sendNotification({
          user: userId,
          sender: senderId,
          type: 'comment',
          message: `Bình luận mới cho sản phẩm #${productId}`,
          data: { productId, commentId: comment._id, message: newMessages[0].content },
          priority: 'normal',
          io: req.io,
          socketRoom: `product_${productId}`,
          socketEvent: 'receive-comment',
          socketPayload: {
            productId,
            senderId,
            content: newMessages[0].content,
            parentMessageId,
            timestamp: newMessages[0].timestamp,
            messageId: comment.messages[comment.messages.length - 1]._id
          }
        });
      }
    }));

    logger.info(`Messages added to comment with ID: ${comment._id}`);
    res.status(200).json({
      success: true,
      message: 'Messages added successfully',
      comment
    });
  } catch (error) {
    logger.error(`Error creating comment: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to create comment',
      error: error.message
    });
  }
};

const getAllComments = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can view all comments'
      });
    }

    const comments = await Comment.find()
      .populate('user', 'name email')
      .populate('messages.sender', 'name email')
      .populate('product', 'name price');

    logger.info(`Retrieved ${comments.length} comments`);
    res.status(200).json({
      success: true,
      message: 'Retrieved all comments successfully',
      comments
    });
  } catch (error) {
    logger.error(`Error retrieving comments: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve comments',
      error: error.message
    });
  }
};

const getCommentById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid comment ID'
      });
    }

    const comment = await Comment.findById(req.params.id)
      .populate('user', 'name email')
      .populate('messages.sender', 'name email')
      .populate('product', 'name price');

    if (!comment) {
      logger.warn(`Comment not found with ID: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    logger.info(`Retrieved comment with ID: ${req.params.id}`);
    res.status(200).json({
      success: true,
      message: 'Retrieved comment successfully',
      comment
    });
  } catch (error) {
    logger.error(`Error retrieving comment ${req.params.id}: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve comment',
      error: error.message
    });
  }
};

const updateComment = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid comment ID'
      });
    }

    const { messages } = req.body;
    if (messages && (!Array.isArray(messages) || messages.some(msg => !msg.content))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid messages array'
      });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      logger.warn(`Comment not found with ID: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    if (req.user.role !== 'admin' && !comment.user.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this comment'
      });
    }

    if (messages) {
      const newMessages = messages.map(msg => ({
        sender: req.user._id,
        content: msg.content,
        timestamp: new Date(),
        parentMessageId: msg.parentMessageId && mongoose.isValidObjectId(msg.parentMessageId) ? msg.parentMessageId : null
      }));
      comment.messages.push(...newMessages);
    }

    await comment.save();

    // Gửi thông báo
    if (messages) {
      await Promise.all(comment.user.map(async userId => {
        if (userId.toString() !== req.user._id.toString()) {
          await sendNotification({
            user: userId,
            sender: req.user._id,
            type: 'comment',
            message: `Bình luận #${comment._id} đã được cập nhật`,
            data: { productId: comment.product, commentId: comment._id },
            priority: 'normal',
            io: req.io,
            socketRoom: `product_${comment.product}`,
            socketEvent: 'receive-comment',
            socketPayload: {
              productId: comment.product,
              senderId: req.user._id,
              content: messages[messages.length - 1].content,
              parentMessageId: messages[messages.length - 1].parentMessageId,
              timestamp: new Date(),
              messageId: comment.messages[comment.messages.length - 1]._id
            }
          });
        }
      }));
    }

    const populatedComment = await Comment.findById(req.params.id)
      .populate('user', 'name email')
      .populate('messages.sender', 'name email')
      .populate('product', 'name price');

    logger.info(`Updated comment with ID: ${req.params.id}`);
    res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      comment: populatedComment
    });
  } catch (error) {
    logger.error(`Error updating comment ${req.params.id}: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to update comment',
      error: error.message
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid comment ID'
      });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      logger.warn(`Comment not found with ID: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete comments'
      });
    }

    await comment.deleteOne();

    // Gửi thông báo
    await Promise.all(comment.user.map(async userId => {
      if (userId.toString() !== req.user._id.toString()) {
        await sendNotification({
          user: userId,
          sender: req.user._id,
          type: 'comment',
          message: `Bình luận #${comment._id} đã bị xóa`,
          data: { productId: comment.product, commentId: comment._id },
          priority: 'normal'
        });
      }
    }));

    logger.info(`Deleted comment with ID: ${req.params.id}`);
    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
      comment
    });
  } catch (error) {
    logger.error(`Error deleting comment ${req.params.id}: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to delete comment',
      error: error.message
    });
  }
};

module.exports = {
  createComment,
  getAllComments,
  getCommentById,
  updateComment,
  deleteComment
};