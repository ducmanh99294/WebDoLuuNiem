const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutUsController');
const { validateToken } = require('../middlewares/authMiddleware');
const authRoles = require('../middlewares/authRoles');

router.post('/', validateToken, authRoles('admin'), aboutController.createAbout);
router.get('/', aboutController.getAllAbout);
router.get('/:id', aboutController.getAboutById);
router.put('/:id', validateToken, authRoles('admin'), aboutController.updateAbout);
router.delete('/:id', validateToken, authRoles('admin'), aboutController.deleteAbout);

module.exports = router;