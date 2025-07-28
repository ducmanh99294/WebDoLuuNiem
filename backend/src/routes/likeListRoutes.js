const express = require('express');
const router = express.Router();
const likeListController = require('../controllers/likeListController');
const { validateToken } = require('../middlewares/authMiddleware');

router.post('/:id', validateToken, likeListController.addToLikeList);
router.get('/', validateToken, likeListController.getAllLikeLists);
router.delete('/:id', validateToken, likeListController.removeFromLikeList);
router.get('/most-liked', likeListController.getMostLikedProducts);

module.exports = router;