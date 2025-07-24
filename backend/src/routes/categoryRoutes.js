const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryControllers');
const { validateToken } = require('../middlewares/authMiddleware');
const authRoles = require('../middlewares/authRoles');
const {dynamicImageUpload} = require('../middlewares/imageMiddleware');

// CRUD routes for Categories
// router.post('/',imageUpload.single('images'), categoryController.createCategory);
router.post('/',dynamicImageUpload('categories').single('image'), validateToken, authRoles('admin'), categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', dynamicImageUpload('categories').single('image'), validateToken, authRoles('admin'), categoryController.updateCategory);
router.delete('/:id', validateToken, authRoles('admin'), categoryController.deleteCategory);

module.exports = router;