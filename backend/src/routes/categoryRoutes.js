const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryControllers');
const { validateToken } = require('../middlewares/authMiddleware');
const authRoles = require('../middlewares/authRoles');
const imageUpload = require('../middlewares/imageMiddleware');

// CRUD routes for Categories
// router.post('/',imageUpload.single('images'), categoryController.createCategory);
router.post('/',imageUpload.single('images'), validateToken, authRoles('admin'), categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', validateToken, authRoles('admin'), categoryController.updateCategory);
router.delete('/:id', validateToken, authRoles('admin'), categoryController.deleteCategory);

module.exports = router;