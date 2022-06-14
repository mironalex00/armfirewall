const express = require('express');
const router = express.Router();
const SystemController = require('../controllers/SystemController');

//  ACCIONES GET 
router.get('/', SystemController.main);
router.get("/reboot", SystemController.reboot)
router.get("/shutdown", SystemController.shutdown)
router.get('/ping', SystemController.pingCheck);
router.get('/setup', SystemController.installer);

// ACCIONES SET

//  EXPORTACION DEL MODULO
module.exports = router;