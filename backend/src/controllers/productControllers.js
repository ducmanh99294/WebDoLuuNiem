const Product = require('../models/Product.js');
const Images = require('../models/Image.js');
const Categories = require('../models/Category.js');
const logger = require('../utils/logger.js');

const createProduct = async (req, res) => {
    try {
        logger.log('Creating product with data:', req.body);
        if (!req.body.name || !req.body.price || !req.body.categories || !req.body.images || !req.body.description || !req.body.discount || !req.body.quantity) {
            return res.status(400).json({
                success: false,
                message: 'please provide all required fields: name, price, categories, images, description, discount, quantity'
            });
        }
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'please provide product image'
            });
        }

        const image = await Images.create({
            image: req.file.path,
        });

        const product = await Product.create({
            ...req.body,
            images: [image._id],
        });


        logger.info(`Product created successfully: ${product._id}`);
        res.status(201).json({
            success: true,
            data: product
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
}

const getAllProducts = async (req, res) => {
    try {
        logger.info('Fetching all products')
        const products = await Product.find().populate('images', 'image').populate('categories');
      
        logger.info(`Retrieved ${products.length} products`);
        res.status(200).json({
            success: true,
            message: 'get all products successfully',
            products: products
        })
    } catch (e) {
        logger.error(`Error fetching products: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message 
        })
    }
}

const getProductById = async (req, res) => {
    try {
        logger.info(`Fetching product with ID: ${req.params.id}`);
        if (!req.params.id) {
            logger.warn('Product ID is required');
            return res.status(400).json({
                success: false,
                message: 'please provide product ID to get product details'
            });
        }

        const product = await Product.findById(req.params.id).populate('images').populate('categories');
        if (!product) {
            return res.status(500).json({
                success: false,
                message: 'product not found'
            });
        } 
        
        logger.info(`Product retrieved successfully: ${product._id}`);
        res.json(product);
    } catch (e) {
        logger.error(`Error fetching product: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
}

const updateProduct = async (req, res) => {
    try {
        logger.info(`Updating product with ID: ${req.params.id}`);
        if (!req.params.id) {
            logger.warn('Product ID is required for update');
            return res.status(400).json({
                success: false,
                message: 'please provide product ID to update product details'
            });
        }

        logger.info('Update data:', req.body);
        const product = await Product.findByIdAndUpdate(
            req.params.id, 
            req.body,
            {new: true}
        );  

        if (!product) return res.status(404).json({
            success: false,
            message: 'product not found'
        });

        logger.info(`Product updated successfully: ${product._id}`);
        res.json(product);
    } catch (e) {  
        logger.error(`Error updating product: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
}

const deleteProduct = async (req, res) => {
    try {
        logger.info(`Deleting product with ID: ${req.params.id}`);
        if (!req.params.id) {
            logger.warn('Product ID is required for deletion');
            return res.status(400).json({
                success: false,
                message: 'please provide product ID to delete'
            });
        }

        logger.info(`Attempting to delete product with ID: ${req.params.id}`);
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) return res.status(404).json({
            success: false,
            message: 'product not found'
        });

        logger.info(`Product deleted successfully: ${product._id}`);
        res.json({product});
    } catch (e) {
        logger.error(`Error deleting product: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
}

const like_count = async (req, res) => {
    try {
        logger.info(`Liking product with ID: ${req.params.id}`);
        if (!req.params.id) {
            logger.warn('Product ID is required for liking');
            return res.status(400).json({
                success: false,
                message: 'please provide product ID to like'
            });
        }

        logger.info(`User ID liking product: ${req.user._id}`);
        if (!req.user || !req.user._id) {
            logger.warn('User not authenticated');
            return res.status(401).json({
                success: false,
                message: 'please login to like this product'
            });
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'product not found'
            });
        }

        logger.info(`Checking if user has already liked product: ${product._id}`);
        if (product.liked_by.includes(req.user._id)) {
            return res.status(400).json({
                success: false,
                message: 'you have already liked this product'
            });
        }

        product.like_count += 1;
        await product.save();

        logger.info(`Product liked successfully: ${product._id}`);
        res.json({
            success: true,
            message: 'updated like count successfully',
            like_count: product.like_count
        });
    } catch (e) {
        logger.error(`Error liking product: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
}

const view_count = async (req, res) => {
    try {
        logger.info(`Viewing product with ID: ${req.params.id}`);
        if (!req.params.id) {
            logger.warn('Product ID is required for viewing');
            return res.status(400).json({
                success: false,
                message: 'please provide product ID to view'
            });
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'product not found'
            });
        }
        product.view_count += 1;
        await product.save();

        logger.info(`Product viewed successfully: ${product._id}`);
        res.json({
            success: true,
            message: 'updated view count successfully',
            view_count: product.view_count
        });
    } catch (e) {
        logger.error(`Error viewing product: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
}

const sell_count = async (req, res) => {
    try {
        logger.info(`Updating sell count for product with ID: ${req.params.id}`);
        if (!req.params.id) {
            logger.warn('Product ID is required for updating sell count');
            return res.status(400).json({
                success: false,
                message: 'please provide product ID to update sell count'
            });
        }
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'product not found'
            });
        }
        if (product.sell_count >= product.quantity) {
            return res.status(400).json({
                success: false,
                message: 'product is out of stock'
            });
        }
        product.sell_count += 1;
        await product.save();

        logger.info(`Sell count updated successfully for product: ${product._id}`);
        res.json({
            success: true,
            message: 'updated sell count successfully',
            sell_count: product.sell_count
        });
    } catch (e) {
        logger.error(`Error updating sell count: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
}
module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    like_count,
    view_count,
    sell_count
};
