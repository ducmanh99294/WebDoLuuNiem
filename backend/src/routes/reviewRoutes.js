const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { validateToken } = require('../middlewares/authMiddleware');

router.post('/', validateToken, reviewController.createReview);
router.get('/', reviewController.getAllReviews);
router.get('/:id', validateToken, reviewController.getReviewById);
router.put('/:id', validateToken, reviewController.updateReview);
router.delete('/:id', validateToken, reviewController.deleteReview);
router.get('/product/:productId', reviewController.getReviewsByProductId);
module.exports = router;