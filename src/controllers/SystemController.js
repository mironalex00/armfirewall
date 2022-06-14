const { response } = require('express');
const execSync = require('child_process').execSync;
const logger = require('../utils/logger');
const ping = require('ping');

function main(req, res){
  req.getConnection((err, conn) => {
    if(err) {
        logger.error(err.message);
        res.redirect('/auth/logout');
    }else if(req.session.loggedin !== true) {
      res.redirect('/auth/login');
    }else{
      res.redirect('/');
    }
  });
}

function checkPermissions(){
  let result = '';
  if(process.platform !== 'linux'){
    result = 'No permitido, tipo de servidor no Linux.';
    logger.error(result);
    return {'success' : false, 'result': result};
  }
  const resPerms = execSync('groups arm-firewall | grep -c sudo', {encoding: 'utf-8'}).replace(/\r?\n|\r/g, '');
  if(!resPerms.equals('1')){
    result = 'No permitido, no perteneces al grupo sudo.';
    logger.error(result);
    return {'success' : false, 'result': result};
  }
  return {'success': true, 'result': 'User has permissions'}
}

function reboot(req, res){
  const isLinux = checkPermissions();

  req.getConnection((err, conn) => {
    if(err) {
        logger.error(err.message);
        res.redirect('/auth/logout');
    }else if(req.session.loggedin !== true) {
      res.redirect('/auth/login');
    }else if(!isLinux.success){
      res.status(500).send(isLinux.result);
    }else {
      try{
        require('child_process').execSync('echo "manager" | sudo -S reboot now')
        res.status(201).send('Successfully executed')
      }catch (error) {
        res.status(504).json(error)
      }
    }
  });
}
function shutdown(req, res){
  const isLinux = checkPermissions();

  req.getConnection((err, conn) => {
    if(err) {
        logger.error(err.message);
        res.redirect('/auth/logout');
    }else if(req.session.loggedin !== true) {
      res.redirect('/auth/login');
    }else if(!isLinux.success){
      res.status(500).send(isLinux.result);
    }else{
      try{
        require('child_process').execSync('echo "manager" | sudo -S shutdown now')
        res.status(201).send('Successfully executed')
      }catch (error) {
        res.status(500).send('Unable to complete')
      }
    }
  });
}
function installer(req, res) {
  req.getConnection((err, conn) => {
    if(err) {
        logger.error(err.message);
        res.redirect('/auth/logout');
    }else if(req.session.loggedin !== true) {
      res.redirect('/auth/login');
    }else{
      const commands = `echo "manager" | sudo -S apt update && sudo apt upgrade -y && curl -s https://deb.nodesource.com/setup_16.x | sudo bash  && sudo apt install -y curl nodejs npm mariadb-server && curl https://gist.githubusercontent.com/Mins/4602864/raw/mysql_secure.sh > ~/init_mysql.sh && sudo chmod -x ~/init_mysql.sh && sudo sed -i "s/aptitude/apt/gi" ~/init_mysql.sh && sudo bash ~/init_mysql.sh && sudo rm ~/init_mysql.sh`;
      try{
          require('child_process').execSync(commands)
          res.status(201).send('Successfully executed')
      }catch (error) {
        res.status(500).send('Unable to complete')
      }
    }
  });
}
//  FUNCIONES
function pingtest(host) {
  return new Promise((resolve, reject) => {
    ping.sys.probe(host, function (isAlive) {
        var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
        console.log(msg);

        resolve(isAlive);
    });
  });
}

//  ENRUTAMIENTOS INTERNOS - (GET)
function pingCheck(req, res) {
  if(req.session.loggedin !== true) {
    res.redirect('/auth/login');
  }else{
    pingtest('127.0.0.1').then((pingSuccessful) => {
        res.status(200).send("Connection established");
    }).catch((e) => {
        console.log(e)
        res.status(500).send("Unable to complete");
    });
  }
}

module.exports = {
    main,
    reboot,
    shutdown,
    installer,
    pingCheck
}