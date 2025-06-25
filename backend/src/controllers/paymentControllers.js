const logger = require('../utils/logger');
const paymentService = require('../services/paymentServices');
const { validationCreatePayment, validationUpdatePayment } = require('../utils/validation/validation');

// Create a new payment
async function createPayment(req, res) {
    const { error } = validationCreatePayment(req.body);
    if (error) {
        logger.error(`Validation error creating payment: ${error.message}`);
        return res.status(400).json({
            success: false,
            error: 'Validation error',
            details: error.message
        });
    }
    try {
        logger.info('Creating new payment...');
        const payment = await paymentService.createPayment(req.body);
        res.status(201).json({
            success: true,
            payment
        });
    } catch (error) {
        logger.error(`Error creating payment: ${error.message}`);
        res.status(500).json({
            success: false,
            error: 'Error creating payment',
            details: error.message
        });
    }
}

// Get all payments
async function getAllPayments(req, res) {
    try {
        logger.info('Fetching all payments...');
        const payments = await paymentService.getAllPayments();
        res.status(200).json({
            success: true,
            payments
        });
    } catch (error) {
        logger.error(`Error fetching all payments: ${error.message}`);
        res.status(500).json({
            success: false,
            error: 'Error fetching all payments',
            details: error.message
        });
    }
}

// Get payment by ID
async function getPaymentById(req, res) {
    try {
        logger.info(`Fetching payment by id: ${req.params.id}`);
        const payment = await paymentService.getPaymentById(req.params.id);
        if (payment) {
            res.status(200).json({
                success: true,
                payment
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Payment not found'
            });
        }
    } catch (error) {
        logger.error(`Error fetching payment: ${error.message}`);
        res.status(500).json({
            success: false,
            error: 'Error fetching payment',
            details: error.message
        });
    }
}

// Update payment by ID
async function updatePayment(req, res) {
    const { error } = validationUpdatePayment(req.body);
    if (error) {
        logger.error(`Validation error updating payment: ${error.message}`);
        return res.status(400).json({
            success: false,
            error: 'Validation error',
            details: error.message
        });
    }
    try {
        logger.info(`Updating payment by id: ${req.params.id}`);
        const updatedPayment = await paymentService.updatePayment(req.params.id, req.body);
        if (updatedPayment) {
            res.status(200).json({
                success: true,
                payment: updatedPayment
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Payment not found'
            });
        }
    } catch (error) {
        logger.error(`Error updating payment: ${error.message}`);
        res.status(500).json({
            success: false,
            error: 'Error updating payment',
            details: error.message
        });
    }
}

// Delete payment by ID
async function deletePayment(req, res) {
    try {
        logger.info(`Deleting payment by id: ${req.params.id}`);
        const deleted = await paymentService.deletePayment(req.params.id);
        if (deleted) {
            res.status(200).json({
                success: true,
                message: 'Payment deleted successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Payment not found'
            });
        }
    } catch (error) {
        logger.error(`Error deleting payment: ${error.message}`);
        res.status(500).json({
            success: false,
            error: 'Error deleting payment',
            details: error.message
        });
    }
}

module.exports = {
    createPayment,
    getAllPayments,
    getPaymentById,
    updatePayment,
    deletePayment,
};
