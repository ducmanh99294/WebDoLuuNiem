const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogControllers');
const { validateToken } = require('../middlewares/authMiddleware');

router.post('/', validateToken, blogController.createBlog);
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);
router.put('/:id', validateToken, blogController.updateBlog);
router.delete('/:id', validateToken, blogController.deleteBlog);

module.exports = router;