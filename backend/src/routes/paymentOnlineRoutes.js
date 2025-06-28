const express = require('express');
const router = express.Router();

router.post('/create', require('../controllers/paymentOnlineControllers').createPayment);
router.get('/notify', require('../controllers/paymentOnlineControllers').paymentNotify);
router.get('/return', require('../controllers/paymentOnlineControllers').paymentReturn);    

module.exports = router;