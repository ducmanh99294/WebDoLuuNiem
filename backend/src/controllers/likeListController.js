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

        let likeList = await LikeList.findOne({ user: req.user.id});
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'product not found'
            });
        }
        console.log("likeList", likeList);
        logger.info(`Checking if user has already liked product: ${product._id}`);

        if (!likeList ) {
            logger.info(`Creating new like list for user: ${req.user.id}`);
            likeList = await LikeList.create({
                user: req.user.id,
                product: [req.params.id]
            });
        }
        else {
            if(likeList.product.includes(req.params.id)) {
                logger.warn('Product already liked by user');
                return res.status(400).json({
                    success: false,
                    message: 'you have already liked this product'
                });        
            } 
        }
            likeList.product.push(req.params.id);

        product.like_count += 1;
        await product.save();
        await likeList.save();

        logger.info(`Product liked successfully: ${product._id}`);
        res.json({
            success: true,
            message: 'like Product successfully',
            // like_count: product.like_count
        });
        
       
    } catch (e) {
        logger.error(`Error liking product: ${e.message}`);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
}

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

        const likes = await LikeList.find({ user }).populate('product', 'name');

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
        logger.info(`Removing product ${req.params.id} from like list for user ${req.user.id}`);

        if (!req.user || !req.user.id || !req.params.id) {
            logger.warn('User ID and Product ID are required');
            return res.status(400).json({
                success: false,
                message: 'please provide user ID and product ID'
            });
        }

        const product = await Product.findById(req.params.id);
        const likeList = await LikeList.findOneAndDelete({ user: req.user.id, product: req.params.id});

        if (!likeList) {
            logger.warn('Product not found in like list');
            return res.status(404).json({
                success: false,
                message: 'product not found in like list'
            });
        }

        await Product.findByIdAndUpdate(req.params.id, { $inc: { like_count: -1 } });
        
        product.like_count -= 1;
        await product.save();

        res.status(200).json({
            success: true,
            message: 'delete product from like list successfully',
            likeList
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

module.exports = {
    addToLikeList,
    getAllLikeLists,
    removeFromLikeList,
};
