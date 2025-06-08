const express = require('express');
const { validateToken } = require('../middlewares/authMiddleware');
const authRoles = require('../middlewares/authRoles');

const router = express.Router();

const {
    createPayment,
    getAllPayments,
    getPaymentById,
    updatePayment,
    deletePayment,
} = require('../controllers/paymentControllers');

// Create a new payment
router.post('/', validateToken, authRoles("user"), createPayment);

// Get all payments
router.get('/', validateToken, authRoles("user", "admin"), getAllPayments);

// Get payment by ID
router.get('/:id', validateToken, authRoles("user", "admin"), getPaymentById);

// Update payment by ID
router.put('/:id', validateToken, authRoles("admin"), updatePayment);

// Delete payment by ID
router.delete('/:id', validateToken, authRoles("admin"), deletePayment);

module.exports = router;