const express = require('express');
const router = express.Router();
const FirewallController = require('../controllers/FirewallController');

//  ACCIONES GET 
router.get('/', FirewallController.main);
router.get('/interfaces/:id', FirewallController.interfaces);

module.exports = router;