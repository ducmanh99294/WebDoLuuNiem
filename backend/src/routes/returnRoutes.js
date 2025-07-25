const express = require('express');
const router = express.Router();
const { createReturnRequest, approveReturn, rejectReturn, getReturnById,getReturnByOrderId,getAllReturns } = require('../controllers/returnController');
const { validateToken } = require('../middlewares/authMiddleware');
const multer = require('multer');
const logger = require('../utils/logger');

// Cấu hình Multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed'));
    }
  }
});

// Middleware xử lý lỗi upload
const handleUpload = (req, res, next) => {
  const uploadMiddleware = upload.array('images', 5);
  uploadMiddleware(req, res, (err) => {
    if (err) {
      logger.error('Upload error:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload failed'
      });
    }
    next();
  });
};

router.post(
  '/',
  validateToken,
  (req, res, next) => {
    if (!req.is('multipart/form-data')) {
      return res.status(400).json({
        success: false,
        message: 'Content-Type must be multipart/form-data'
      });
    }
    next();
  },
  handleUpload,
  createReturnRequest
);

router.patch('/:returnId/approve', validateToken, approveReturn);
router.patch('/:returnId/reject', validateToken, rejectReturn);
router.get('/:returnId', validateToken, getReturnById);
router.get('/by-order/:orderId', validateToken, getReturnByOrderId);
router.get('/', validateToken, getAllReturns);
module.exports = router;