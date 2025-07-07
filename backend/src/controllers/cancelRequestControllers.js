const CancelRequest = require('../models/CancelRequest');
const logger = require('../utils/logger'); // Adjust path if needed
const {
    getAll,
    getById,
    acceptCancerRequest,
    rejectCancerRequest,
    createCancerRequest
} = require('../services/cancelRequestServices'); // Adjust path if needed
const validationCreateCancelRequest = require('../utils/validation/cancelRequestValidation');

// [GET] /cancel-requests
exports.getAllCancelRequests = async (req, res) => {
    try {
        logger.info('Fetching all cancel requests');
        const cancelRequests = await getAll();
        res.status(200).json({
            success: true,
            message: 'All cancel requests retrieved successfully',
            data: cancelRequests
        });
    } catch (err) {
        logger.error(`Error fetching cancel requests: ${err.message}`);
        res.status(500).json({ success: false, error: 'Failed to fetch cancel requests' });
    }
};

// [GET] /cancel-requests/:id
exports.getCancelRequestById = async (req, res) => {
    try {
        logger.info(`Fetching cancel request with ID: ${req.params.id}`);

        if (!req.params.id) {
            logger.warn('Cancel request ID is required');
            return res.status(400).json({
                success: false,
                error: 'Cancel request ID is required'
            });
        }

        const cancelRequest = await getById(req.params.id);

        if (!cancelRequest) {
            logger.warn(`Cancel request not found with ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                error: 'Cancel request not found'
            });
        }

        logger.info(`Cancel request retrieved successfully: ${cancelRequest._id}`);
        res.status(200).json({
            success: true,
            message: 'Cancel request retrieved successfully',
            data: cancelRequest
        });
    } catch (err) {
        logger.error(`Error fetching cancel request: ${err.message}`);
        res.status(400).json({ success: false, error: 'Invalid cancel request ID' });
    }
};

// [POST] /cancel-requests
exports.createCancelRequest = async (req, res) => {
    try {
        logger.info('Creating new cancel request');

        const validaError = validationCreateCancelRequest(req.body);
        if (validaError.error) {
            logger.warn(`Validation error: ${validaError.error.message}`);
            return res.status(400).json({
                success: false,
                error: validaError.error.message
            });
        }
        const cancelRequest = new CancelRequest(req.body);
        const savedRequest = await cancelRequest.save();
        res.status(201).json({
            success: true,
            message: 'Cancel request created successfully',
            data: savedRequest
        });
    } catch (err) {
        logger.error(`Error creating cancel request: ${err.message}`);
        res.status(400).json({ success: false, error: 'Failed to create cancel request' });
    }
};

// [PUT] /cancel-requests/:id/accept
exports.acceptCancelRequest = async (req, res) => {
    try {
        logger.info(`Accepting cancel request with ID: ${req.params.id}`);

        if (!req.params.id) {
            logger.warn('Cancel request ID is required');
            return res.status(400).json({
                success: false,
                error: 'Cancel request ID is required'
            });
        }
        const updatedRequest = await acceptCancerRequest(req.params.id);

        if (!updatedRequest) {
            logger.warn(`Cancel request not found with ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                error: 'Cancel request not found'
            });
        }

        logger.info(`Cancel request approved: ${updatedRequest._id}`);
        res.status(200).json({
            success: true,
            message: 'Cancel request approved successfully',
            data: updatedRequest
        });
    } catch (err) {
        logger.error(`Error approving cancel request: ${err.message}`);
        res.status(400).json({ success: false, error: 'Failed to approve cancel request' });
    }
};

// [PUT] /cancel-requests/:id/reject
exports.rejectCancelRequest = async (req, res) => {
    try {
        logger.info(`Rejecting cancel request with ID: ${req.params.id}`);

        if (!req.params.id) {
            logger.warn('Cancel request ID is required');
            return res.status(400).json({
                success: false,
                error: 'Cancel request ID is required'
            });
        }

        const updatedRequest = await rejectCancerRequest(req.params.id);

        if (!updatedRequest) {
            logger.warn(`Cancel request not found with ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                error: 'Cancel request not found'
            });
        }

        logger.info(`Cancel request rejected: ${updatedRequest._id}`);
        res.status(200).json({
            success: true,
            message: 'Cancel request rejected successfully',
            data: updatedRequest
        });
    } catch (err) {
        logger.error(`Error rejecting cancel request: ${err.message}`);
        res.status(400).json({ success: false, error: 'Failed to reject cancel request' });
    }
};