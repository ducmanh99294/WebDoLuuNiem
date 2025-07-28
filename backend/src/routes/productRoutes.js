const express = require('express');
const {dynamicImageUpload} = require('../middlewares/imageMiddleware');
const router = express.Router();
const productController = require('../controllers/productControllers');
const authRoles = require('../middlewares/authRoles');
const { validateToken } = require('../middlewares/authMiddleware');

router.get('/search', productController.searchProducts);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/category/:categoryId', productController.getProductByCategory);
router.post('/', dynamicImageUpload('products').array('images', 15), productController.createProduct);
router.post('/:id/like', validateToken, authRoles, productController.like_count);
router.post('/:id/view', validateToken, authRoles, productController.view_count);
router.post('/:id/sell', validateToken, productController.sell_count);
router.put('/:id', dynamicImageUpload('products').array('images', 15), validateToken, authRoles("admin"), productController.updateProduct);
router.delete('/:id', validateToken, authRoles("admin"), productController.deleteProduct);

module.exports = router;