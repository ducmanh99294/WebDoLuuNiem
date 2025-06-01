const express = require('express');
const { registerUser, loginUser, refreshToken, logoutUser } = require('../controllers/identity_controllers');

const router = express.Router();

// Example routes
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/refresh-token', refreshToken)
router.post('/logout', logoutUser)

module.exports = router;