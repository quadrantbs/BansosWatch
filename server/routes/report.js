const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController.js');
const adminOnly = require('../middlewares/adminOnly.js');

router.post('/', reportController.addReport);

router.get('/', reportController.getAllReport);

router.get('/:id', reportController.getOneReport);

router.put('/:id', reportController.updateReport);

router.patch('/:id/approve', adminOnly, reportController.verifyReport);

router.patch('/:id/reject', adminOnly, reportController.rejectReport);

router.delete('/:id', reportController.deleteReport);

module.exports = router;
