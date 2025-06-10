const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { validateToken } = require('../middlewares/authMiddleware');
const authRoles = require('../middlewares/authRoles');

router.post('/', validateToken, commentController.createComment);
router.get('/', validateToken, authRoles('admin'), commentController.getAllComments);
router.get('/:id', validateToken, commentController.getCommentById);
router.patch('/:id', validateToken, authRoles('admin'), commentController.updateComment);
router.delete('/:id', validateToken, authRoles('admin'), commentController.deleteComment);

module.exports = router;