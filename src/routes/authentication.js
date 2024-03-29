const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

//  ACCIONES GET 
router.get('/', (req, res) => {res.redirect('/')})
router.get('/login', AuthController.login);
router.get('/logout', AuthController.logout);

/*
router.get('/register', LoginController.register);
*/

//  ACCIONES POST
router.post('/login', AuthController.auth);
router.post('/pwdManager', AuthController.pwdManager);

// EXPORTACIONES MODULO
module.exports = router;