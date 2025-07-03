const express = require('express');
const cartDetailController = require('../controllers/cartDetailControllers');
const { validateToken } = require('../middlewares/authMiddleware');
const authRoles = require('../middlewares/authRoles');
const authRolers = require('../middlewares/authRoles');

const router = express.Router();

// [POST] /
router.post(
    '/',
    validateToken,
    authRoles('user', 'admin'),
    cartDetailController.createCartDetail
);

// [GET] /
router.get(
    '/',
    validateToken,
    authRoles('admin'),
    cartDetailController.getAllCartDetails
);

// [GET] /cart/:cart_id
router.get(
    '/cart/:cart_id',
    validateToken,
    authRoles('user', 'admin'),
    cartDetailController.getCartDetailsByCartId
);

// [GET] /:id
router.get(
    '/:id',
    validateToken,
    authRoles('user', 'admin'),
    cartDetailController.getCartDetailById
);

// [PUT] /:id
router.put(
    '/:id',
    validateToken,
    authRoles('user', 'admin'),
    cartDetailController.updateCartDetail
);

// [DELETE] /:id
router.delete(
    '/:id',
    validateToken,
    authRoles('user', 'admin'),
    cartDetailController.deleteCartDetail
);

// [PATCH] /:id/quantity
router.patch(
    '/:id/quantity',
    validateToken,
    authRolers('user', 'admin'),
    cartDetailController.updateCartDetailQuantity
);

router.delete('/cart/:cartId', 
    validateToken,
    authRolers('user', 'admin'), 
    cartDetailController.clearCartDetailsByCartId
);

module.exports = router;
