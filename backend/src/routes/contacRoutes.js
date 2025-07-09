const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { validateToken } = require('../middlewares/authMiddleware');
const authRoles = require('../middlewares/authRoles');

router.post('/', validateToken, contactController.createContact);
router.get('/', validateToken, authRoles('admin'), contactController.getAllContacts);
router.get('/user/:id', validateToken, authRoles('admin'), contactController.getContactByUserId);
router.get('/:id', validateToken, authRoles('admin'), contactController.getContactById);
router.put('/:id', validateToken, authRoles('admin'), contactController.updateContact);
router.delete('/:id', validateToken, authRoles('admin'), contactController.deleteContact);

module.exports = router;