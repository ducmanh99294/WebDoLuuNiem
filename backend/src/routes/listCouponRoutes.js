const router = require('express').Router();
const listCouponController = require('../controllers/listCouponController');
const { validateToken } = require('../middlewares/authMiddleware');
const authRoles = require('../middlewares/authRoles');

router.post('/',  listCouponController.addCouponToUser);
router.get('/',  listCouponController.getListCouponByUserId);
router.delete('/:id', validateToken, listCouponController.removeCouponFromUser);
