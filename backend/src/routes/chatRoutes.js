const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authRoles = require('../middlewares/authRoles');


router.post('/', chatController.createChat);
router.get('/', authRoles, chatController.getAllChats);
router.get('/:id', chatController.getChatById);
router.put('/:id', chatController.updateChat);
router.delete('/:id', chatController.deleteChat);

module.exports = router;