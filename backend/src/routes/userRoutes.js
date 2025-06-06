const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const authRolers = require('../middlewares/authRoles');
const { validateToken } = require('../middlewares/authMiddleware');

// router.get('/', validateToken, authRolers("admin"), userController.getAllUsers);
router.get('/',  userController.getAllUsers);
router.get('/:id', validateToken, authRolers("admin", "user"), userController.getUserById);
// router.post('/', validateToken, authRolers("admin"), userController.createUser);
router.post('/',  userController.createUser);
// forgot password
router.post('/reset-password', userController.resetPassword);
router.put('/:id', validateToken, authRolers("admin", "user"), userController.updateUser);
router.delete('/:id', validateToken, authRolers("admin"), userController.deleteUser);

module.exports = router;