const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  
  destination: (req, file, cb) => {
    cb(null, 'src/assets/images');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const imageUpload = multer({storage});
module.exports = imageUpload;