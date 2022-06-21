const bcrypt = require('bcrypt');
const { response } = require('express');
const logger = require('../utils/logger');

function comparePasswords(base, toCompare){
    return bcrypt.compare(base, toCompare);
}

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
        res.status(400).send('E-Mail y/o Contraseña vacíos')
    }else{
        req.getConnection((err, conn) => {
            if(err) {
                logger.error(err.message);
                res.status(503).send('Error al consultar los datos...');
            }else{
                conn.query('SELECT * FROM userdata WHERE authEmail = ? or authUser = ?', [data.authEmail, data.authEmail], (err, rows) => {
                    if(err || rows.length === 0){
                        if(err) logger.error(err.message);
                        res.status(400).send('E-Mail y/o Contraseña incorrectos');
                    }else{
                        const result = Object.values(JSON.parse(JSON.stringify(rows))).find(() => true);
                        comparePasswords(data.authPassword, result.authPassword).then(isMatch => {
                            if(!isMatch){
                                res.status(400).send('E-Mail y/o Contraseña incorrectos');
                            }else{
                                req.session.loggedin = true;
                                req.session.uname = result.authUser;
                                req.session.name = result.name;
                                if ( data.hasToRemember ) {
                                    req.session.cookie.originalMaxAge = 24 * 60 * 60 * 1000 // Expires in 1 day
                                } else {
                                    req.session.cookie.expires = false
                                }
                                logger.info(`Usuario (${req.session.name}) ha iniciado una nueva sesión...`);
                                // res.redirect('/');
                                res.sendStatus(200);
                            }
                        })
                    }
                });
            }
        });
    }
}
function pwdManager(req, res){
  req.getConnection((err, conn) => {
    if(err) {
        logger.error(error.message);
        res.redirect('/auth/logout');
    }else if(req.session.loggedin !== true) {
        res.redirect('/auth/login');
    }else {
        const data = req.body; 
        if(!data) {
            res.status(501).send("No se han recibido datos, refresque la página e inténtelo de nuevo");
        }
        else if(!data.lastPass || data.lastPass.trim().length === 0){
            res.status(500).send("Contraseña del usuario vacía");
        }else if(!data.newPass || data.newPass.trim().length === 0){
            res.status(500).send("Contraseña nueva de usuario vacía");
        }else if(!data.confirmPass || data.confirmPass.trim().length === 0){
            res.status(500).send("Contraseña de confirmación vacía");
        }else if(data.newPass.trim() !== data.confirmPass.trim()){
            res.status(500).send("La contraseña nueva no coincide");
        }else if((data.newPass.trim() === data.lastPass.trim()) || (data.lastPass.trim() === data.confirmPass.trim())){
            res.status(500).send("No puede ser igual a la antigua");
        }else if(!data.uname || data.uname.trim().length === 0){
            res.status(500).send("Algo ha fallado, recarga de nuevo...");
        }else{
            conn.query('SELECT * FROM userdata WHERE authUser = ?', [data.uname], (err, rows) => {
                if(err || rows.length === 0){
                    if(err) logger.error(err.message);
                    res.status(403).send('Usuario introducido no válido, cerrando sesión por seguridad...');
                }else{
                    const result = Object.values(JSON.parse(JSON.stringify(rows))).find(() => true);
                    comparePasswords(data.lastPass, result.authPassword).then(isMatch => {
                        if(!isMatch){
                            res.status(500).send('Comprube su contraseña.');
                        }else{
                            bcrypt.hash(data.newPass, 12).then(hash => {
                                data.newPass = hash;
                                conn.query('UPDATE user SET authPassword = ? WHERE authUser = ? AND authPassword = ?', [data.newPass, data.uname, result.authPassword], (err, rows) => {
                                    if(err || rows.affectedRows !== 1){
                                        if(err) logger.error(err.message);
                                        res.status(500).send('Ocurrió un error inesperado, inténtelo más tarde...');
                                    }else{
                                        logger.warn(`El usuario ${req.session.name} ha cambiado su contraseña. Fecha ${new Date().toJSON()}`)
                                        res.status(201).send("Se ha cambiado la contraseña. Se le redirigirá automáticamente para iniciar sesión nuevamente.");
                                    }
                                });
                            })
                        }
                    })
                }
            });
        }
    }
  });
}
function logout(req, res){
    req.session.loggedin = !req.session.loggedin;
    req.session.destroy();
    res.redirect('/auth/login');
}

module.exports = {
    auth,
    login,
    logout,
    pwdManager
}