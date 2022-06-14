const { response } = require('express');
const logger = require('../utils/logger');

function main(req, res){
    req.getConnection((err, conn) => {
        if(err) {
          logger.error(err.message);
          res.redirect('/auth/logout');
        }else if(req.session.loggedin !== true) {
          res.redirect('/auth/login');
        }else{
          res.redirect('/dashboard');
        }
    });
}

module.exports = {
    main,
}