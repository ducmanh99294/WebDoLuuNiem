const express = require('express');
const router = express.Router();
const productController = require('../controllers/productControllers');
const authRoles = require('../middlewares/authRoles');

//CRUD 
router.post('/', authRoles("admin"),productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id',productController.getProductById);
router.post('/products/:id/like', authRoles,productController.like_count);
router.post('/products/:id/view', productController.view_count);
router.post('/products/:id/sell', productController.sell_count);
router.put('/:id', authRoles("admin"), productController.updateProduct);
router.delete('/:id', authRoles("admin"), productController.deleteProduct);

module.exports = router;