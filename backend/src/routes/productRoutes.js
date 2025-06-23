const express = require('express');
const imageUpload = require('../middlewares/imageMiddleware');
const router = express.Router();
const productController = require('../controllers/productControllers');
const authRoles = require('../middlewares/authRoles');
const { validateToken } = require('../middlewares/authMiddleware');

router.get('/', productController.getAllProducts);
<<<<<<< HEAD
router.get('/:id',productController.getProductById);
// router.get('/like', validateToken, authRoles("admin"), productController.getLikeList);
// router.get('/like/:id', validateToken, authRoles("admin"), productController.getLikeListById);
router.post('/:id/like', validateToken, productController.like_count);
router.post('/products/:id/view', validateToken, productController.view_count);
=======
router.get('/:id', productController.getProductById);
router.post('/products/:id/like', validateToken, authRoles, productController.like_count);
router.post('/products/:id/view', validateToken, authRoles, productController.view_count);
>>>>>>> dd623c013b3c66ec93100818942dbadff4efc325
router.post('/products/:id/sell', validateToken, productController.sell_count);
router.put('/:id', validateToken, authRoles("admin"), productController.updateProduct);
router.delete('/:id', validateToken, authRoles("admin"), productController.deleteProduct);

module.exports = router;