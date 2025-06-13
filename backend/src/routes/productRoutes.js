const express = require('express');
const imageUpload = require('../middlewares/imageMiddleware');
const router = express.Router();
const productController = require('../controllers/productControllers');
const authRoles = require('../middlewares/authRoles');
const { validateToken } = require('../middlewares/authMiddleware');

//CRUD 
router.post('/', imageUpload.array('images', 5), productController.createProduct);

router.get('/', productController.getAllProducts);
router.get('/:id',productController.getProductById);
router.post('/products/:id/like', validateToken, authRoles, productController.like_count);
router.post('/products/:id/view', validateToken, authRoles, productController.view_count);
router.post('/products/:id/sell', validateToken, productController.sell_count);
router.put('/:id', validateToken, authRoles("admin"), productController.updateProduct);
router.delete('/:id', validateToken, authRoles("admin"), productController.deleteProduct);

module.exports = router;