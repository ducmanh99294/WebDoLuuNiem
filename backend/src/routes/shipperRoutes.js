
const express = require('express');
const router = express.Router();
const shipperController = require('../controllers/shipperController');
const { validateToken } = require('../middlewares/authMiddleware');
const authRoles = require('../middlewares/authRoles');

// CRUD routes for Shippers
router.post('/', validateToken, authRoles('admin'), shipperController.createShipper);
router.get('/', shipperController.getAllShippers);
router.get('/:id', shipperController.getShipperById);
router.put('/:id', validateToken, authRoles('admin'), shipperController.updateShipper);
router.delete('/:id', validateToken, authRoles('admin'), shipperController.deleteShipper);

module.exports = router;
