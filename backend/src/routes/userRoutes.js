const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const authRolers = require('../middlewares/authRoles');
const { validateToken } = require('../middlewares/authMiddleware');

router.get('/',  userController.getAllUsers);
router.get('/:id', validateToken, authRolers("admin", "user"), userController.getUserById);
router.post('/',  userController.createUser);
// forgot password
router.post('/reset-password', userController.resetPassword);
router.put('/:id', validateToken, authRolers("admin", "user"), userController.updateUser);
// update user info
router.put('/info/:id', validateToken, authRolers("user"), userController.updateInfo);
router.delete('/:id', validateToken, authRolers("admin"), userController.deleteUser);

//router.get('/admins', validateToken, getAvailableAdmin);
module.exports = router;