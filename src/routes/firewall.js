const express = require('express');
const router = express.Router();
const FirewallController = require('../controllers/FirewallController');

//  ACCIONES GET 
router.get('/', FirewallController.main);
router.get('/interfaces/:id', FirewallController.interfaces);
router.get('/reglas/:id', FirewallController.rules);
router.get('/reglas/:id/add', FirewallController.add);
router.get('/reglas/:id/restore', FirewallController.restore);

module.exports = router;