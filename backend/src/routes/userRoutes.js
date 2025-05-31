const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const authRolers = require('../middlewares/authRoles');

router.get('/', authRolers("admin"),userController.getAllUsers);
router.get('/:id', authRolers("admin", "user"), userController.getUserById);
router.post('/', authRolers("admin"), userController.createUser);
router.put('/:id', authRolers("admin", "user"), userController.updateUser);
router.delete('/:id', authRolers("admin") , userController.deleteUser);

module.exports = router;