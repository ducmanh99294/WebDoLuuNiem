const Category = require('../models/Category');
// const Images = require('../models/Image.js');
const logger = require('../utils/logger');

const createCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body;

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            logger.warn(`Category already exists with name: ${name}`);
            return res.status(400).json({
                success: false,
                message: 'Category already exists'
            });
        }

        let newImage = "";

        if(req.file) {
            newImage = `/src/assets/images/${req.file.filename}`;
        } 

        if (image) {
            newImage = image;
        }

        const category = await Category.create({ ...req.body, image: newImage });
        await category.save();

        logger.info(`Category created successfully: ${category._id}`);
        res.status(201).json({
            success: true,
            data: category
        });
    } catch (e) {
        logger.error(`Error creating category: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        logger.info(`Retrieved ${categories.length} categories`);
        res.status(200).json({
            success: true,
            message: 'Categories retrieved successfully',
            data: categories
        });
    } catch (e) {
        logger.error(`Error retrieving categories: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            logger.warn(`Category not found with ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        logger.info(`Category retrieved successfully: ${category._id}`);
        res.status(200).json({
            success: true,
            data: category
        });
    } catch (e) {
        logger.error(`Error retrieving category: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!category) {
            logger.warn(`Category not found with ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        logger.info(`Category updated successfully: ${category._id}`);
        res.status(200).json({
            success: true,
            data: category
        });
    } catch (e) {
        logger.error(`Error updating category: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            logger.warn(`Category not found with ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        logger.info(`Category deleted successfully: ${category._id}`);
        res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (e) {
        logger.error(`Error deleting category: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
