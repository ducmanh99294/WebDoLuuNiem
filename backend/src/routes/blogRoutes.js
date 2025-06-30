const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogControllers');
const { validateToken } = require('../middlewares/authMiddleware');
const authRoles = require('../middlewares/authRoles');

router.post('/', validateToken, authRoles('admin'), blogController.createBlog);
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);
router.put('/:id', validateToken, authRoles('admin'), blogController.updateBlog);
router.delete('/:id', validateToken, authRoles('admin'), blogController.deleteBlog);

module.exports = router;