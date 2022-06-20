const { response } = require('express');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');
const logPath = path.join(__dirname, '../public/logs');
//  FUNCIONES NO EXPORTABLES
function getLatestFile({directory, extension}, callback){
  fs.readdir(directory, (_ , dirlist)=>{
    const latest = dirlist.map(_path => ({stat:fs.lstatSync(path.join(directory, _path)), dir:_path}))
      .filter(_path => _path.stat.isFile())
      .filter(_path => extension ? _path.dir.endsWith(`.${extension}`) : 1)
      .sort((a, b) => b.stat.mtime - a.stat.mtime)
      .map(_path => _path.dir);
    callback(latest[0]);
  });
}
//  FUNCIONES EXPORTABLES
function logs(req, res){
    req.getConnection((err, conn) => {
        if(err) {
            logger.error(err.message);
            res.redirect('/auth/logout');
        }else if(req.session.loggedin !== true){
            res.redirect('/auth/login');
        }else{
            getLatestFile({directory: logPath, extension:'log'}, (filename=null)=>{
                var filePath = logPath + '\\' + filename;
                var stat = fs.statSync(filePath);
               
                res.writeHead(200, {
                    'Content-Type': 'text/plain',
                    'Content-Length': stat.size
                });
            
                var readStream = fs.createReadStream(filePath);
                readStream.pipe(res);
            });
        }
    });
}
function status(req, res){
    req.getConnection((err, conn) => {
        if(err) {
            logger.error(err.message);
            res.redirect('/auth/logout');
        }else if(req.session.loggedin !== true){
            res.redirect('/auth/login');
        }else{
            res.status(200).render('status', { 
                title: 'ARMwall - Logs', 
                layout: 'root', 
                name: req.session.name, 
                section: {name: 'Dashboard', pointer: 'logs'},
            });
        }
    });
}
function buildInProgress(req, res){
    req.getConnection((err, conn) => {
        if(err) {
            logger.error(err.message);
            res.redirect('/auth/logout');
        }else if(req.session.loggedin !== true){
            res.redirect('/auth/login');
        }else{
            logger.warn('Bloqueado intento de solicitud de recurso en construcción.')
            res.status(500).render('errors/500', { 
                title: 'ARMwall - Build in Progress', 
                layout: 'root', 
                name: req.session.name, 
                message: 'Todavía estamos trabajando en ello...' 
            });
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
            res.status(200).render('licenses', { 
                title: 'ARMwall - Licenses', 
                layout: 'root', 
                name: req.session.name, 
                section: {name: 'Dashboard', pointer: 'licenses'} 
            });
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
            res.status(200).render('dashboard', { 
                title: 'ARMwall - Dashboard', 
                layout: 'root', 
                name: req.session.name, 
                section: {name: 'Dashboard'} 
            });
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
            res.status(200).render('passwords', { 
                title: 'ARMwall - Passwords', 
                layout: 'root', 
                name: req.session.name, 
                section: {name: 'Dashboard', pointer: 'passwords'} 
            });
        }
    });    
}
//  EXPORTACIONES
module.exports = {
    main,
    buildInProgress,
    licenses,
    passwordManager,
    status,
    logs
}