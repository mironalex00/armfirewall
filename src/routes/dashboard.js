const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/DashboardController');

//  ACCIONES GET 
router.get('/', DashboardController.main);
router.get(['/control-panel'], DashboardController.buildInProgress);
router.get('/licenses', DashboardController.licenses)
router.get('/passwords', DashboardController.passwordManager);
router.get('/status', DashboardController.status);
router.get('/status/logs', DashboardController.logs);

module.exports = router;