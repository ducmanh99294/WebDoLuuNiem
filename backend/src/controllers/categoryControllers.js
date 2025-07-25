const Category = require('../models/Category');
// const Images = require('../models/Image.js');
const logger = require('../utils/logger');

const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Name and description are required'
      });
    }

    // Check tồn tại
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      logger.warn(`Category already exists with name: ${name}`);
      return res.status(400).json({
        success: false,
        message: 'Category already exists'
      });
    }

    // Xử lý ảnh upload (1 ảnh)
    let uploadedImages = '';
        if (req.file) {
        uploadedImages = `/uploads/categories/${req.file.filename}`;
        }


    // Xử lý ảnh từ link
    let linkImages = [];
    if (image) {
        linkImages = [image]; // nếu là JSON string
    }

    // Gộp tất cả ảnh
    const allImages = linkImages.length > 0 ? linkImages[0] : uploadedImages;


    // Tạo category mới
    const category = await Category.create({
      name,
      description,
      image: allImages
    });

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
        const categoryId = req.params.id;
        const { name, description, image } = req.body;

        if (!name || !description) {
            logger.warn('Missing required fields to update a category');
            return res.status(400).json({
                success: false,
                message: 'Please provide name and description',
            });
        }

        // Check tồn tại
        const existingCategory = await Category.findById(req.params.id);
            if (!existingCategory) {
              logger.warn(`Category not found with ID: ${req.params.id}`);
              return res.status(404).json({ success: false, message: 'Category not found' });
        }

    // Xử lý ảnh upload (1 ảnh)
    let uploadedImages = '';
        if (req.file) {
        uploadedImages = `/uploads/categories/${req.file.filename}`;
        }


    // Xử lý ảnh từ link
    let linkImages = [];
    if (image) {
        linkImages = [image];
    }

    // Gộp tất cả ảnh
    const newImages = linkImages.length > 0 ? linkImages[0] : uploadedImages;

        // Cập nhật category
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            {
                name,
                description,
                image: newImages,
            },
            { new: true }
        );

        logger.info(`Category updated successfully: ${updatedCategory._id}`);
        res.status(200).json({
            success: true,
            data: updatedCategory,
        });

    } catch (e) {
        logger.error(`Error updating category: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message,
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
