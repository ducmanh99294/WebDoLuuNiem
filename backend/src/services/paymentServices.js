const Payment = require('../models/Payment');
const logger = require('../utils/logger');

// Create a new payment
async function createPayment(data) {
    try {
        const payment = await Payment.create(data);
        logger.info('Payment created', { payment });
        return payment;
    } catch (error) {
        logger.error('Error creating payment', { error });
        throw error;
    }
}

// Get all payments
async function getAllPayments() {
    try {
        const payments = await Payment.find()
            .populate('order_id')
        logger.info('Fetched all payments');
        return payments;
    } catch (error) {
        logger.error('Error fetching all payments', { error });
        throw error;
    }
}

// Get payment by ID
async function getPaymentById(id) {
    try {
        const payment = await Payment.findById(id)
            .populate('order_id')
        logger.info(`Fetched payment by id: ${id}`);
        return payment;
    } catch (error) {
        logger.error(`Error fetching payment by id: ${id}`, { error });
        throw error;
    }
}

// Update payment by ID
async function updatePayment(id, data) {

    const allowedStatuses = [
        'pending',
        'processing',
        'paid',
        'failed',
        'cancelled',
        'refunded'
    ];
    if (data.status && !allowedStatuses.includes(data.status)) {
        logger.error(`Invalid status value: ${data.status}`);
        throw new Error(`Invalid status value: ${data.status}`);
    }

    try {
        const updatedPayment = await Payment.findByIdAndUpdate(id, data, { new: true });
        if (updatedPayment) {
            logger.info(`Updated payment by id: ${id}`, { updatedPayment });
            return updatedPayment;
        }
        logger.info(`No payment found to update with id: ${id}`);
        return null;
    } catch (error) {
        logger.error(`Error updating payment by id: ${id}`, { error });
        throw error;
    }
}

// Delete payment by ID
async function deletePayment(id) {
    try {
        const deleted = await Payment.findByIdAndDelete(id);
        if (deleted) {
            logger.info(`Deleted payment by id: ${id}`);
            return true;
        } else {
            logger.info(`No payment found to delete with id: ${id}`);
            return false;
        }
    } catch (error) {
        logger.error(`Error deleting payment by id: ${id}`, { error });
        throw error;
    }
}

module.exports = {
    createPayment,
    getAllPayments,
    getPaymentById,
    updatePayment,
    deletePayment,
};