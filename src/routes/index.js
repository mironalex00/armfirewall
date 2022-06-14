const express = require('express');
const router = express.Router();
const IndexController = require('../controllers/IndexController');

//  ACCIONES GET 
router.get('/', IndexController.main);

module.exports = router;