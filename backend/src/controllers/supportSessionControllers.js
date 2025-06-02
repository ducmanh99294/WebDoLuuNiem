const supportSessionService = require('../services/supportSessionServices');
const logger = require('../utils/logger'); // Adjust the path as needed

// Create a new support session
async function createSupportSession(req, res) {
    try {
        logger.info('Creating a new support session...');
        if (!('status' in req.body)) {
            req.body.status = 'open';
        } else {
            req.body.status = 'open';
        }
        if (!('closed_at' in req.body)) {
            req.body.closed_at = null;
        } else {
            req.body.closed_at = null;
        }
        const session = await supportSessionService.createSupportSession(req.body);
        logger.info(`Support session created successfully: ${session._id || ''}`);
        res.status(201).json({
            success: true,
            message: 'Support session created successfully',
            session
        });
    } catch (err) {
        logger.error(`Error creating support session: ${err.message}`);
        res.status(400).json({
            success: false,
            error: 'Failed to create support session',
            details: err.message
        });
    }
}

// Get all support sessions
async function getAllSupportSessions(req, res) {
    try {
        logger.info('Fetching all support sessions...');
        const sessions = await supportSessionService.getAllSupportSessions(req.query);
        res.status(200).json({
            success: true,
            sessions
        });
    } catch (err) {
        logger.error(`Error fetching support sessions: ${err.message}`);
        res.status(400).json({
            success: false,
            error: 'Failed to fetch support sessions',
            details: err.message
        });
    }
}

// Get a support session by ID
async function getSupportSessionById(req, res) {
    try {
        logger.info(`Fetching support session by ID: ${req.params.id}`);
        const session = await supportSessionService.getSupportSessionById(req.params.id);
        if (!session) {
            logger.warn(`Support session not found: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                error: 'Support session not found'
            });
        }
        res.status(200).json({
            success: true,
            session
        });
    } catch (err) {
        logger.error(`Error fetching support session: ${err.message}`);
        res.status(400).json({
            success: false,
            error: 'Failed to fetch support session',
            details: err.message
        });
    }
}

// Update a support session by ID
async function updateSupportSession(req, res) {
    try {
        logger.info(`Updating support session: ${req.params.id}`);
        const session = await supportSessionService.updateSupportSession(req.params.id, req.body);
        if (!session) {
            logger.warn(`Support session not found: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                error: 'Support session not found'
            });
        }
        logger.info(`Support session updated successfully: ${req.params.id}`);
        res.status(200).json({
            success: true,
            message: 'Support session updated successfully',
            session
        });
    } catch (err) {
        logger.error(`Error updating support session: ${err.message}`);
        res.status(400).json({
            success: false,
            error: 'Failed to update support session',
            details: err.message
        });
    }
}

// Delete a support session by ID
async function deleteSupportSession(req, res) {
    try {
        logger.info(`Deleting support session: ${req.params.id}`);
        const session = await supportSessionService.deleteSupportSession(req.params.id);
        if (!session) {
            logger.warn(`Support session not found: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                error: 'Support session not found'
            });
        }
        logger.info(`Support session deleted successfully: ${req.params.id}`);
        res.status(200).json({
            success: true,
            message: 'Support session deleted successfully'
        });
    } catch (err) {
        logger.error(`Error deleting support session: ${err.message}`);
        res.status(400).json({
            success: false,
            error: 'Failed to delete support session',
            details: err.message
        });
    }
}

module.exports = {
    createSupportSession,
    getAllSupportSessions,
    getSupportSessionById,
    updateSupportSession,
    deleteSupportSession
};
