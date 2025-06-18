const express = require('express');
const routes = express.Router();
const eventController = require('../controllers/eventController');
const { validateToken } = require('../middlewares/authMiddleware');
const authRoles = require('../middlewares/authRoles');

routes.post('/', validateToken, authRoles('admin'), eventController.createEvent);
routes.get('/', eventController.getAllEvents);
routes.get('/:id', eventController.getEventById);
routes.post('/:id/products', validateToken, authRoles('admin'), eventController.addProductsToEvent);
routes.delete('/:id/products/:productId', validateToken, authRoles('admin'), eventController.removeProductFromEvent);
routes.put('/:id', validateToken, authRoles('admin'), eventController.updateEvent);
routes.delete('/:id', validateToken, authRoles('admin'), eventController.deleteEvent);

module.exports = routes;