const express = require('express');
const router = express.Router();

const shippingCompanyController = require('../controllers/shippingCompanyControllers');
const { validateToken } = require('../middlewares/authMiddleware');
const authRoles = require('../middlewares/authRoles');

// CRUD routes for Shipping Companies
router.post('/', validateToken, authRoles('admin'), shippingCompanyController.createShippingCompany);
router.get('/', shippingCompanyController.getAllShippingCompanies);
router.get('/:id', shippingCompanyController.getShippingCompanyById);
router.put('/:id', validateToken, authRoles('admin'), shippingCompanyController.updateShippingCompany);
router.delete('/:id', validateToken, authRoles('admin'), shippingCompanyController.deleteShippingCompany);

module.exports = router;