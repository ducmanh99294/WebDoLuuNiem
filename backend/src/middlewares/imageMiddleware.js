import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/assets/images');
    },
    filename: (req, file, cb) => {
 cb(null, Date.now() + '-' + file.originalname);
    },
});


export const imageUpload = multer({storage});