const express = require('express');
const supportSessionController = require('../controllers/supportSessionControllers');

const router = express.Router();

// Get all support sessions
router.get('/', supportSessionController.getAllSupportSessions);

// Get a single support session by ID
router.get('/:id', supportSessionController.getSupportSessionById);

// Create a new support session
router.post('/', supportSessionController.createSupportSession);

// Update a support session by ID
router.put('/:id', supportSessionController.updateSupportSession);

// Delete a support session by ID
router.delete('/:id', supportSessionController.deleteSupportSession);

module.exports = router;