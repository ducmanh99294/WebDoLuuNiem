const LikeList = require('../models/LikeList');
const Product = require('../models/Product');
const logger = require('../utils/logger');

const addToLikeList = async (req, res) => {
    try {
        const { user, product } = req.body;
        logger.info(`Adding product ${product} to like list for user ${user}`);

        if (!user || !product) {
            logger.warn('User ID and Product ID are required');
            return res.status(400).json({
                success: false,
                message: 'please provide user ID and product ID'
            });
        }

        const existingLike = await LikeList.findOne({ user, product });

        if (existingLike) {
            logger.warn('Product already in like list');
            return res.status(400).json({
                success: false,
                message: 'product already exists in like list'
            });
        }

        const newLike = await LikeList.create({ user, product });

        await Product.findByIdAndUpdate(product, { $inc: { like_count: 1 } });

        res.status(201).json({
            success: true,
            message: 'add product to like list successfully',
            like: newLike
        });
    } catch (error) {
        logger.error(`Error adding to like list: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'add product to like list failed',
            error: error.message
        });
    }
}

const getAllLikeLists = async (req, res) => {
    try {
        const { user } = req.params;
        logger.info(`Fetching like list for user: ${user}`);

        if (!user) {
            logger.warn('User ID is required to fetch like list');
            return res.status(400).json({
                success: false,
                message: 'Please provide user ID'
            });
        }

        const likes = await LikeList.find({ user }).populate('product');

        res.status(200).json({
            success: true,
            message: 'get like list successfully',
            likes
        });
    } catch (error) {
        logger.error(`Error fetching like list: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'get like list failed',
            error: error.message
        });
    }
}

const removeFromLikeList = async (req, res) => {
    try {
        const { user, product } = req.body;
        logger.info(`Removing product ${product} from like list for user ${user}`);

        if (!user || !product) {
            logger.warn('User ID and Product ID are required');
            return res.status(400).json({
                success: false,
                message: 'please provide user ID and product ID'
            });
        }

        const like = await LikeList.findOneAndDelete({ user, product });

        if (!like) {
            logger.warn('Product not found in like list');
            return res.status(404).json({
                success: false,
                message: 'product not found in like list'
            });
        }

        await Product.findByIdAndUpdate(product, { $inc: { like_count: -1 } });
        
        res.status(200).json({
            success: true,
            message: 'delete product from like list successfully',
            like
        });
    } catch (error) {
        logger.error(`Error removing from like list: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'delete product from like list failed',
            error: error.message
        });
    }
}

const isProductLiked = async (req, res) => {
    try {
        const { user, product } = req.params;
        logger.info(`Checking if product ${product} is liked by user ${user}`);

        if (!user || !product) {
            logger.warn('User ID and Product ID are required');
            return res.status(400).json({
                success: false,
                message: 'please provide user ID and product ID'
            });
        }

        const like = await LikeList.findOne({ user, product });

        res.status(200).json({
            success: true,
            isLiked: !!like
        });
    } catch (error) {
        logger.error(`Error checking like status: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'check like status failed',
            error: error.message
        });
    }
}

module.exports = {
    addToLikeList,
    getAllLikeLists,
    removeFromLikeList,
    isProductLiked
};
