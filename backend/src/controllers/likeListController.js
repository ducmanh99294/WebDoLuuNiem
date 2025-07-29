const LikeList = require('../models/LikeList');
const Product = require('../models/Product');
const logger = require('../utils/logger');

const addToLikeList = async (req, res) => {
    try {
        logger.info(`Liking product with ID: ${req.params.id}`);
        if (!req.params.id) {
            logger.warn('Product ID is required for liking');
            return res.status(400).json({
                success: false,
                message: 'please provide product ID to like'
            });
        }

        logger.info(`User ID liking product: ${req.user.id}`);
        if (!req.user || !req.user.id) {
            logger.warn('User not authenticated');
            return res.status(401).json({
                success: false,
                message: 'please login to like this product'
            });
        }

        let likeList = await LikeList.findOne({ user: req.user.id });
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'product not found'
            });
        }
        logger.info(`Checking if user has already liked product: ${product._id}`);

        if (!likeList) {
            logger.info(`Creating new like list for user: ${req.user.id}`);
            likeList = await LikeList.create({
                user: req.user.id,
                product: [req.params.id]
            });
        } else {
            if (likeList.product.includes(req.params.id)) {
                logger.warn('Product already liked by user');
                return res.status(400).json({
                    success: false,
                    message: 'you have already liked this product'
                });        
            }
            likeList.product.push(req.params.id);
        }

        product.like_count += 1;
        await product.save();
        await likeList.save();

        logger.info(`Product liked successfully: ${product._id}`);
        res.json({
            success: true,
            message: 'like Product successfully',
            like_count: product.like_count
        });
    } catch (e) {
        logger.error(`Error liking product: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

const getAllLikeLists = async (req, res) => {
    try {
        const user = req.user.id;
        logger.info(`Fetching like list for user: ${user}`);

        if (!user) {
            logger.warn('User ID is required to fetch like list');
            return res.status(400).json({
                success: false,
                message: 'Please provide user ID'
            });
        }

        const likes = await LikeList.find({ user }).populate('product', 'name price discount rating like_count images');

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
};

const removeFromLikeList = async (req, res) => {
    try {
        logger.info(`Removing product ${req.params.id} from like list for user ${req.user.id}`);

        if (!req.user || !req.user.id || !req.params.id) {
            logger.warn('User ID and Product ID are required');
            return res.status(400).json({
                success: false,
                message: 'please provide user ID and product ID'
            });
        }

        const likeList = await LikeList.findOne({ user: req.user.id });
        if (!likeList || !likeList.product.includes(req.params.id)) {
            logger.warn('Product not found in like list');
            return res.status(404).json({
                success: false,
                message: 'product not found in like list'
            });
        }

        likeList.product = likeList.product.filter(id => id.toString() !== req.params.id);
        await likeList.save();

        const product = await Product.findById(req.params.id);
        if (product) {
            product.like_count = Math.max(0, product.like_count - 1);
            await product.save();
        }

        res.status(200).json({
            success: true,
            message: 'delete product from like list successfully',
            like_count: product ? product.like_count : 0
        });
    } catch (error) {
        logger.error(`Error removing from like list: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'delete product from like list failed',
            error: error.message
        });
    }
};

const getMostLikedProducts = async (req, res) => {
    try {
        logger.info('Fetching most liked products');
        const products = await Product.find()
            .sort({ like_count: -1 })
            .limit(5)
            .populate('images')
            .select('name price discount rating like_count images');
        
        res.status(200).json({
            success: true,
            message: 'get most liked products successfully',
            products
        });
    } catch (error) {
        logger.error(`Error fetching most liked products: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'get most liked products failed',
            error: error.message
        });
    }
};

module.exports = {
    addToLikeList,
    getAllLikeLists,
    removeFromLikeList,
    getMostLikedProducts
};