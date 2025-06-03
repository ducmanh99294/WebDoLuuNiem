const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { validateToken } = require('../middlewares/authMiddleware');

router.post('/', validateToken, orderController.createOrder);
router.get('/', validateToken, orderController.getAllOrders);
router.get('/:id', validateToken, orderController.getOrderById);
router.put('/:id/status', validateToken, orderController.updateOrderStatus);
router.delete('/:id', validateToken, orderController.deleteOrder);

module.exports = router;
