const multer = require('multer');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

const uploadDir = path.join(__dirname, '../uploads');

// Đảm bảo thư mục tồn tại
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  logger.info(`Created upload directory at ${uploadDir}`);
}

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and PDFs are allowed'), false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Có thể phân loại thư mục theo loại file
    let subFolder = 'others';
    if (file.mimetype.startsWith('image/')) subFolder = 'images';
    if (file.mimetype === 'application/pdf') subFolder = 'documents';
    
    const dest = path.join(uploadDir, subFolder);
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

module.exports = {
  upload: multer({
    storage,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
      files: 5
    },
    fileFilter
  }),

  // Middleware xử lý lỗi cụ thể
  handleUploadErrors: (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: err.code === 'LIMIT_FILE_SIZE' 
          ? 'File too large (max 10MB)' 
          : 'File upload error'
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'Invalid file'
      });
    }
    next();
  }
};
