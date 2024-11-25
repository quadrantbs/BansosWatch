const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

router.get('/:id', userController.getOneUser);

module.exports = router;
