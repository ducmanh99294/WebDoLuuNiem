const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { validateToken } = require('../middlewares/authMiddleware');
const authRolers = require('../middlewares/authRoles');

router.use(validateToken);

// Tạo đơn hàng mới
router.post('/', orderController.createOrder);

// Lấy tất cả đơn hàng (chỉ admin)
router.get('/', orderController.getAllOrders);

// Lấy đơn hàng theo ID (admin hoặc chủ đơn hàng)
router.get('/:id', orderController.getOrderById);

// Cập nhật trạng thái đơn hàng (chỉ admin)
router.patch('/:id/status', orderController.updateOrderStatus);

// Xóa đơn hàng (chỉ admin)
router.delete('/:id', orderController.deleteOrder);

router.post('/comfirm', orderController.confirmOrder);

router.post('/cancel', orderController.cancelOrder);

router.post('/:id/use-coupon', orderController.useCoupon);

router.get('/user/:userId', orderController.getOrdersByUserId);

module.exports = router;