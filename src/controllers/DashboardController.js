const { response } = require('express');
const logger = require('../utils/logger');


function buildInProgress(req, res){
    req.getConnection((err, conn) => {
        if(err) {
            logger.error(err.message);
            res.redirect('/auth/logout');
        }else if(req.session.loggedin !== true){
            res.redirect('/auth/login');
        }else{
            logger.warn('Bloqueado intento de solicitud de recurso en construcción.')
            res.status(500).render('errors/500', { title: 'ARMwall - Build in Progress', layout: 'root', message: 'Todavía estamos trabajando en ello...' });
        }
    }); 
}
function licenses(req, res){
    req.getConnection((err, conn) => {
        if(err) {
            logger.error(err.message);
            res.redirect('/auth/logout');
        }else if(req.session.loggedin !== true){
            res.redirect('/auth/login');
        }else{
            res.status(200).render('licenses', { title: 'ARMwall - Licenses', layout: 'root', name: req.session.name, section: {name: 'Dashboard', pointer: 'licenses'} });
        }
    });    
}
function main(req, res){
    req.getConnection((err, conn) => {
        if(err) {
            logger.error(err.message);
            res.redirect('/auth/logout');
        }else if(req.session.loggedin !== true){
            res.redirect('/auth/login');
        }else{
            res.status(200).render('dashboard', { title: 'ARMwall - Dashboard', layout: 'root', name: req.session.name, section: {name: 'Dashboard'} });
        }
    });    
}
function passwordManager(req, res){
    req.getConnection((err, conn) => {
        if(err) {
            logger.error(err.message);
            res.redirect('/auth/logout');
        }else if(req.session.loggedin !== true){
            res.redirect('/auth/login');
        }else{
            res.status(200).render('passwords', { title: 'ARMwall - Passwords', layout: 'root', name: req.session.name, section: {name: 'Dashboard', pointer: 'passwords'} });
        }
    });    
}

module.exports = {
    main,
    buildInProgress,
    licenses,
    passwordManager,
}