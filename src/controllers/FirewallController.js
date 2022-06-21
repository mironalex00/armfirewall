const { response } = require('express');
const {getInterfaces} = require('../utils/network');
const logger = require('../utils/logger');

function main(req, res){
    res.redirect('/dashboard');
}
function interfaces(req, res){
    req.getConnection((err, conn) => {
        if(err) {
          logger.error(err.message);
          res.redirect('/auth/logout');
        }else if(req.session.loggedin !== true) {
          res.redirect('/auth/login');
        }else{    
            const interface = getInterfaces().find(x => x.interfaceId === parseInt(req.params.id));
            if(interface === undefined){
                res.status(404).render('errors/404', { layout: 'root' , name: req.session.name,});
            }else{
                const settings = interface.settings;
                conn.query('SELECT * FROM interfaces', (err, rows) => {
                    if(err){
                        logger.error(err.message);
                        res.status(500).send('Erlror desconocido');
                    }else{
                        const result = JSON.parse(Object.values(JSON.parse(JSON.stringify(rows))).find(() => true).settingsComponent).find(x => x.interfaceId === interface.interfaceId);
                        
                    }
                });
            }
        }
    });
}
function rules(req, res){

}

module.exports = {
    main,
    interfaces,
    rules
}