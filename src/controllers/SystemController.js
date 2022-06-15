const { response } = require('express');
const {execSync} = require('child_process');
const {exec} = require('child_process');
const logger = require('../utils/logger');
const ping = require('ping');

//  FUNCIONES NO EXPORTABLES
function checkUser(req, callback){
  req.getConnection((err, conn) => {
    if(err) {
      callback(err, {success: false})
    }else if(req.session.loggedin !== true) {
      callback(null, {success: false})
    }else {
      callback(null, {success: true})
    }
  });
}
function pingtest(host) {
  return new Promise((resolve, reject) => {
    ping.sys.probe(host, function (isAlive) {
        var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
        logger.info(msg);
        resolve(isAlive);
    });
  });
}
function execShell(command, callback) {
  exec(command, { encoding: 'utf8' }, (err) => {
    if(!err) {
      callback(null)
    }else{
      callback(err)
    }
  });
}
function checkPermissions(callback){
  execShell('groups arm-firewall | grep -c sudo', (err) => {
    if(err){
      callback(err)
    }else{
      callback(null)
    }
  })
}
//  FUNCIONES EXPORTABLES
function main(req, res){
  checkUser(req, function(error, response){
    if(error){
      logger.error(error.message);
      res.redirect('/auth/logout');
    }else if(!response.success){
      res.redirect('/auth/login');
    }else{
      res.redirect('/');
    }
  });
}
function reboot(req, res){
  checkUser(req, function(error, response){
    if(error){
      logger.error(error.message);
      res.redirect('/auth/logout');
    }else if(!response.success){
      res.redirect('/auth/login');
    }else{
      checkPermissions((errPerm) => {
        if(errPerm){
          logger.error('No permitido, tipo de servidor no Linux.');
          res.status(500).send('No permitido, tipo de servidor no Linux.');
        }else{
          execShell(`echo "manager" | sudo -S reboot now`, (errExec) => {
            if(errExec){
              logger.error(`Error al ejecutar el comando (sudo -S reboot now), motivo: ${errExec.message.replace('\r\n', ' ')}`);
              res.sendStatus(500);
            }else{
              res.sendStatus(201);
            }
          });
        }
      });
    }
  });
}
function shutdown(req, res){  
  checkUser(req, function(error, response){
    if(error){
      logger.error(error.message);
      res.redirect('/auth/logout');
    }else if(!response.success){
      res.redirect('/auth/login');
    }else{
      checkPermissions((errPerm) => {
        if(errPerm){
          logger.error('No permitido, tipo de servidor no Linux.');
          res.status(500).send('No permitido, tipo de servidor no Linux.');
        }else{
          execShell(`echo "manager" | sudo -S shutdown now`, (errExec) => {
            if(errExec){
              logger.error(`Error al ejecutar el comando (sudo -S shutdown now), motivo: ${errExec.message.replace('\r\n', ' ')}`);
              res.sendStatus(500);
            }else{
              res.sendStatus(201);
            }
          });
        }
      });
    }
  });
}
function installer(req, res){
  checkUser(req, function(error, response){
    if(error){
      logger.error(error.message);
      res.redirect('/auth/logout');
    }else if(!response.success){
      res.redirect('/auth/login');
    }else{
      let execCommands = [
        'apt update',
        'apt upgrade -y',
        'apt install curl mariadb-server -y',
        'curl -s https://deb.nodesource.com/setup_16.x | sudo bash',
        'apt install nodejs npm -y',
        'curl https://gist.githubusercontent.com/Mins/4602864/raw/mysql_secure.sh > ~/init_mysql.sh',
        'chmod -x ~/init_mysql.sh',
        'sed -i "s/aptitude/apt/gi" ~/init_mysql.sh',
        'bash ~/init_mysql.sh',
        'rm ~/init_mysql.sh',
        'ipconfig /all'
      ];
      checkPermissions((errPerm) => {
        if(errPerm){
          logger.error('No permitido, tipo de servidor no Linux.');
          res.status(500).send('No permitido, tipo de servidor no Linux.');
        }else{
          // ... implementar ejecutar comandos dentro de bucle
          const c = execCommands.join(" && ");
          execShell(`echo "manager" | sudo -S ${c}`, (errExec) => {
            if(errExec){
              logger.error(`Error al ejecutar el comando (${c}), motivo: ${errExec.message.replace('\r\n', ' ')}`);
              res.sendStatus(500);
            }else{
              res.sendStatus(201);
            }
          });
        }
      });
    }
  });
}
function pingCheck(req, res) {
  checkUser(req, function(error, response){
    if(error){
      logger.error(error.message);
      res.redirect('/auth/logout');
    }else if(!response.success){
      res.redirect('/auth/login');
    }else{
      pingtest('127.0.0.1').then((pingSuccessful) => {
        res.sendStatus(200)
      }).catch((e) => {
        logger.error(e.message);
        res.sendStatus(500)
      });
    }
  });
}
// EXPORTACIONES
module.exports = {
  main,
  reboot,
  shutdown,
  installer,
  pingCheck
}