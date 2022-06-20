const express = require('express');
const router = express.Router();
const SystemController = require('../controllers/SystemController');

//  ACCIONES GET 
router.get('/', SystemController.main);
router.get("/execute/:commands", SystemController.execute)
router.get('/ping', SystemController.pingCheck);
router.get('/setup', SystemController.installer);

// ACCIONES SET

//  EXPORTACION DEL MODULO
module.exports = router;