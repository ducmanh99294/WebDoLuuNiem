const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponControllers');
const { validateToken } = require('../middlewares/authMiddleware');
const authRoles = require('../middlewares/authRoles');

router.post('/', validateToken, authRoles('admin'), couponController.createCoupon);
router.get('/', couponController.getAllCoupons);
router.get('/:id', couponController.getCouponById);
router.put('/:id', validateToken, authRoles('admin'), couponController.updateCoupon);
router.delete('/:id', validateToken, authRoles('admin'), couponController.deleteCoupon);

module.exports = router;