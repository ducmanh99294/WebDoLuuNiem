const express = require('express');
const cancelRequestController = require('../controllers/cancelRequestControllers'); // Adjust path if needed
const authRoles = require('../middlewares/authRoles'); // Adjust path if needed
const { validateToken } = require('../middlewares/authMiddleware'); // Adjust path if needed

const router = express.Router();

// [GET] /
router.get('/', validateToken, authRoles('admin'), cancelRequestController.getAllCancelRequests);

// [GET] /:id
router.get('/:id', validateToken, authRoles('admin', 'user'),cancelRequestController.getCancelRequestById);

// [POST] /
router.post('/', validateToken, authRoles('user'), cancelRequestController.createCancelRequest);

// [PUT] /:id/accept
router.put('/:id/accept', validateToken, authRoles('admin'), cancelRequestController.acceptCancelRequest);

// [PUT] /:id/reject
router.put('/:id/reject', validateToken, authRoles('admin'), cancelRequestController.rejectCancelRequest);

module.exports = router;