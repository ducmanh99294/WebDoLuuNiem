const express = require('express');
const cartController = require('../controllers/cartControllers');
const { validateToken } = require('../middlewares/authMiddleware'); // Adjust path as needed
const authRoles = require('../middlewares/authRoles'); // Adjust path as needed

const router = express.Router();

// [POST] /carts - Create a new cart (authenticated users)
router.post(
    '/',
    validateToken,
    authRoles('user', 'admin'),
    cartController.createCart
);

// [GET] / - Get all carts (admin only)
router.get(
    '/',
    validateToken,
    authRoles('admin'),
    cartController.getAllCarts
);

// [GET] /:id - Get cart by ID (authenticated users)
router.get(
    '/:id',
    validateToken,
    authRoles('user', 'admin'),
    cartController.getCartById
);

// [PUT] /:id - Update cart by ID (authenticated users)
router.put(
    '/:id',
    validateToken,
    authRoles('user', 'admin'),
    cartController.updateCart
);

// [DELETE] /:id - Delete cart by ID (authenticated users)
router.delete(
    '/:id',
    validateToken,
    authRoles('user', 'admin'),
    cartController.deleteCart
);

// [GET] /user- Get carts by user ID (authenticated users)
router.get(
    '/user/:userId',
    validateToken,
    authRoles('user', 'admin'),
    cartController.getCartByUser
);

module.exports = router;