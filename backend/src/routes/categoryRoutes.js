const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/CategoryControllers');
const { validateToken } = require('../middlewares/authMiddleware');
const authRoles = require('../middlewares/authRoles');

// CRUD routes for Categories
router.post('/', validateToken, authRoles('admin'), categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', validateToken, authRoles('admin'), categoryController.updateCategory);
router.delete('/:id', validateToken, authRoles('admin'), categoryController.deleteCategory);

module.exports = router;