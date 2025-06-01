const ShippingCompany = require('../models/ShippingCompany');
const logger = require('../utils/logger');

const createShippingCompany = async (req, res) => {
    try {
        const { name, phone, address } = req.body;

        const existingCompany = await ShippingCompany.findOne({ name });
        if (existingCompany) {
            logger.warn(`Shipping company already exists with name: ${name}`);
            return res.status(400).json({
                success: false,
                message: 'Shipping company already exists'
            });
        }

        const company = await ShippingCompany.create({ name, phone, address });
        logger.info(`Shipping company created successfully: ${company._id}`);
        res.status(201).json({
            success: true,
            data: company
        });
    } catch (e) {
        logger.error(`Error creating shipping company: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

const getAllShippingCompanies = async (req, res) => {
    try {
        const companies = await ShippingCompany.find();
        logger.info(`Retrieved ${companies.length} shipping companies`);
        res.status(200).json({
            success: true,
            message: 'Shipping companies retrieved successfully',
            data: companies
        });
    } catch (e) {
        logger.error(`Error retrieving shipping companies: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

const getShippingCompanyById = async (req, res) => {
    try {
        const company = await ShippingCompany.findById(req.params.id);
        if (!company) {
            logger.warn(`Shipping company not found with ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Shipping company not found'
            });
        }
        logger.info(`Shipping company retrieved successfully: ${company._id}`);
        res.status(200).json({
            success: true,
            data: company
        });
    } catch (e) {
        logger.error(`Error retrieving shipping company: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

const updateShippingCompany = async (req, res) => {
    try {
        const company = await ShippingCompany.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!company) {
            logger.warn(`Shipping company not found with ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Shipping company not found'
            });
        }
        logger.info(`Shipping company updated successfully: ${company._id}`);
        res.status(200).json({
            success: true,
            data: company
        });
    } catch (e) {
        logger.error(`Error updating shipping company: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

const deleteShippingCompany = async (req, res) => {
    try {
        const company = await ShippingCompany.findByIdAndDelete(req.params.id);
        if (!company) {
            logger.warn(`Shipping company not found with ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Shipping company not found'
            });
        }
        logger.info(`Shipping company deleted successfully: ${company._id}`);
        res.status(200).json({
            success: true,
            message: 'Shipping company deleted successfully'
        });
    } catch (e) {
        logger.error(`Error deleting shipping company: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

module.exports = {
    createShippingCompany,
    getAllShippingCompanies,
    getShippingCompanyById,
    updateShippingCompany,
    deleteShippingCompany
};