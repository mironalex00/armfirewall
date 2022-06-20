const { response } = require('express');
const logger = require('../utils/logger');
const {execShell, execShellArray} = require('../utils/execShell');
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
//  FUNCIONES EXPORTABLES
function main(req, res){
  res.redirect('/dashboard');
}
function execute(req, res){  
  checkUser(req, function(error, response){
    if(error){
      logger.error(error.message);
      res.redirect('/auth/logout');
    }else if(!response.success){
      res.redirect('/auth/login');
    }else{
      execShellArray(req.params.commands.split(',')).then(resp=>{
        res.sendStatus(resp ? 200 : 500)
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
        'echo "manager" | sudo -S -k apt update',
        'echo "manager" | sudo -S -k apt upgrade -y',
        'echo "manager" | sudo -S -k apt install curl mariadb-server -y',
        'echo "manager" | sudo -S -k curl -s https://deb.nodesource.com/setup_16.x | sudo bash',
        'echo "manager" | sudo -S -k apt install nodejs npm -y',
        'echo "manager" | sudo -S -k curl https://gist.githubusercontent.com/Mins/4602864/raw/mysql_secure.sh > ~/init_mysql.sh',
        'echo "manager" | sudo -S -k chmod -x ~/init_mysql.sh',
        'echo "manager" | sudo -S -k sed -i "s/aptitude/apt/gi" ~/init_mysql.sh',
        'echo "manager" | sudo -S -k bash ~/init_mysql.sh',
        'echo "manager" | sudo -S -k rm ~/init_mysql.sh',
      ];
      execShellArray(execCommands).then(resp=>{
        res.sendStatus(resp ? 200 : 500)
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
  execute,
  installer,
  pingCheck
}