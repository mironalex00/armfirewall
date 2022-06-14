const bcrypt = require('bcrypt');
const { response } = require('express');
const logger = require('../utils/logger');

function login(req, res){
    if(req.session.loggedin !== true) {
        res.render('authentication/login');
    }else{
        res.redirect('/');
    }
}
function auth(req, res){
    const data = req.body;
    if(!data || (!data.authEmail || !data.authPassword) || (!data.authEmail.trim().length === 0 || !data.authPassword.trim().length === 0)){
        res.render('authentication/login', {warn: 'E-Mail y/o Contraseña vacíos'})
    }else{
        req.getConnection((err, conn) => {
            if(err) {
                logger.error(err.message);
                res.render('authentication/login', {error: 'Error al consultar los datos...'});
            }else{
                conn.query('SELECT * FROM user WHERE authEmail = ? or authUser = ?', [data.authEmail, data.authEmail], (err, rows) => {
                    if(err || rows.length === 0){
                        if(err) logger.error(err.message);
                        res.render('authentication/login', {warn: 'El usuario no existe'});
                    }else{
                        const result = Object.values(JSON.parse(JSON.stringify(rows))).find(() => true);
                        bcrypt.compare(data.authPassword, result.authPassword, (err, isMatch) => {
                            if(!isMatch){
                                res.render('authentication/login', {warn: 'E-Mail y/o Contraseña incorrectos'})
                            }else{
                                req.session.loggedin = true;
                                req.session.name = result.name;
                                if ( data.hasToRemember ) {
                                    req.session.cookie.originalMaxAge = 24 * 60 * 60 * 1000 // Expires in 1 day
                                } else {
                                    req.session.cookie.expires = false
                                }
                                res.redirect('/');
                            }
                        })
                    }
                });
            }
        });
    }
}
function logout(req, res){
    req.session.loggedin = !req.session.loggedin;
    req.session.destroy();
    res.redirect('/auth/login');
}

module.exports = {
    auth,
    login,
    logout
}