const Shipper = require('../models/Shipper');
const logger = require('../utils/logger');

const createShipper = async (req, res) => {
    try {
        const { shipping_company, name, phone } = req.body;

        const shipper = await Shipper.create({ shipping_company, name, phone });
        logger.info(`Shipper created successfully: ${shipper._id}`);
        res.status(201).json({
            success: true,
            data: shipper
        });
    } catch (e) {
        logger.error(`Error creating shipper: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

const getAllShippers = async (req, res) => {
    try {
        const shippers = await Shipper.find().populate('shipping_company');
        logger.info(`Retrieved ${shippers.length} shippers`);
        res.status(200).json({
            success: true,
            message: 'Shippers retrieved successfully',
            data: shippers
        });
    } catch (e) {
        logger.error(`Error retrieving shippers: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

const getShipperById = async (req, res) => {
    try {
        const shipper = await Shipper.findById(req.params.id).populate('shipping_company');
        if (!shipper) {
            logger.warn(`Shipper not found with ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Shipper not found'
            });
        }
        logger.info(`Shipper retrieved successfully: ${shipper._id}`);
        res.status(200).json({
            success: true,
            data: shipper
        });
    } catch (e) {
        logger.error(`Error retrieving shipper: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

const updateShipper = async (req, res) => {
    try {
        const shipper = await Shipper.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('shipping_company');
        if (!shipper) {
            logger.warn(`Shipper not found with ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Shipper not found'
            });
        }
        logger.info(`Shipper updated successfully: ${shipper._id}`);
        res.status(200).json({
            success: true,
            data: shipper
        });
    } catch (e) {
        logger.error(`Error updating shipper: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

const deleteShipper = async (req, res) => {
    try {
        const shipper = await Shipper.findByIdAndDelete(req.params.id);
        if (!shipper) {
            logger.warn(`Shipper not found with ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Shipper not found'
            });
        }
        logger.info(`Shipper deleted successfully: ${shipper._id}`);
        res.status(200).json({
            success: true,
            message: 'Shipper deleted successfully'
        });
    } catch (e) {
        logger.error(`Error deleting shipper: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

module.exports = {
    createShipper,
    getAllShippers,
    getShipperById,
    updateShipper,
    deleteShipper
};