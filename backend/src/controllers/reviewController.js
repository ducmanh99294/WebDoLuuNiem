const Review = require('../models/Review');
const logger = require('../utils/logger');

const createReview = async (req, res) => {
    try {
        const reviewData = req.body;

        if (reviewData.rating < 1 || reviewData.rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Số sao phải nằm trong khoảng 1 đến 5'
            });
            }

        logger.info(`Creating review for product: ${reviewData.product} by user: ${reviewData.user}`);
        if (!reviewData.user || !reviewData.product || !reviewData.rating || !reviewData.comment) {
            logger.warn('Missing required fields for review creation');
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp đầy đủ thông tin đánh giá'
            });
        }
        // Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa
        const existingReview = await Review.findOne({
            user: reviewData.user,
            product: reviewData.product
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'Bạn đã đánh giá sản phẩm này rồi'
            });
        }

        const newReview = await Review.create(reviewData);

        res.status(201).json({
            success: true,
            message: 'Đánh giá sản phẩm thành công',
            review: newReview
        });
    } catch (error) {
        logger.error(`Error creating review: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Không thể tạo đánh giá',
            error: error.message
        });
    }
}

const getAllReviews = async (req, res) => {
    try{
        logger.info('Fetching all reviews');
        const reviews = await Review.find()
            .populate('user', 'name email')
            .populate('product', 'name price');

        res.status(200).json({
            success: true,
            message: 'Lấy danh sách đánh giá thành công',
            reviews
        });
    } catch (error) {
        logger.error(`Error fetching reviews: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Không thể lấy danh sách đánh giá',
            error: error.message
        });
    }
}

const getReviewsByProductId = async (req, res) => {
    try {
        const { productId } = req.params;
        logger.info(`Fetching reviews for product: ${productId}`);

        const reviews = await Review.find({ product: productId })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'Lấy danh sách đánh giá theo sản phẩm thành công',
            reviews
        });
    } catch (error) {
        logger.error(`Error fetching reviews for product: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Không thể lấy đánh giá sản phẩm',
            error: error.message
        });
    }
};

const getReviewById = async (req, res) => {
    try {
        logger.info(`Fetching review with ID: ${req.params.id}`);
        if (!req.params.id) {
            logger.warn('Review ID is required');
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp ID đánh giá'
            });
        }
        const review = await Review.findById(req.params.id)
            .populate('user', 'name email')
            .populate('product', 'name price');

        if (!review) {
            logger.warn(`Review not found with ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Đánh giá không tồn tại'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Lấy đánh giá thành công',
            review
        });
    } catch (error) {
        logger.error(`Error fetching review: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Không thể lấy đánh giá',
            error: error.message
        });
    }
}

const updateReview = async (req, res) => {
    try {
        logger.info(`Updating review with ID: ${req.params.id}`);
        if (!req.params.id) {
            logger.warn('Review ID is required for update');
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp ID đánh giá để cập nhật'
            });
        }
        const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedReview) {
            logger.warn(`Review not found for update with ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Đánh giá không tồn tại hoặc không thể cập nhật'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật đánh giá thành công',
            review: updatedReview
        });
    } catch (error) {
        logger.error(`Error updating review: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Không thể cập nhật đánh giá',
            error: error.message
        });
    }
}

const deleteReview = async (req, res) => {
    try {
        logger.info(`Deleting review with ID: ${req.params.id}`);
        const review = await Review.findByIdAndDelete(req.params.id);
        if(!review) {
            logger.warn(`Review not found with Id: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Đánh giá không tồn tại'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Xóa đánh giá thành công'
        });
    } catch (error) {
        logger.error(`Error deleting review: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Không thể xóa đánh giá',
            error: error.message
        });
    }
}


module.exports = {
    createReview,
    getAllReviews,  
    getReviewById,
    getReviewsByProductId,
    updateReview,
    deleteReview
};