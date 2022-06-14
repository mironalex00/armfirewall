const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/DashboardController');

//  ACCIONES GET 
router.get('/', DashboardController.main);
router.get(['/status', '/control-panel'], DashboardController.buildInProgress);
router.get('/licenses', DashboardController.licenses)
router.get('/passwords', DashboardController.passwordManager);

module.exports = router;