const express = require('express');
const routes = express.Router();
const eventController = require('../controllers/eventController');
const { validateToken } = require('../middlewares/authMiddleware');
const authRoles = require('../middlewares/authRoles');
const {dynamicImageUpload} = require('../middlewares/imageMiddleware');

routes.post('/', validateToken, dynamicImageUpload('events').array('image', 5), authRoles('admin'), eventController.createEvent);
routes.post('/:id/add-products',  eventController.addProductToEvent);
routes.delete('/:id/remove-products', validateToken, authRoles('admin'), eventController.removeProductFromEvent);
routes.get('/', eventController.getAllEvents);
routes.get('/:id', eventController.getEventById);
routes.put('/:id', dynamicImageUpload('events').array('image', 5), validateToken, authRoles('admin'), eventController.updateEvent);
routes.delete('/:id', validateToken, authRoles('admin'), eventController.deleteEvent);

module.exports = routes;