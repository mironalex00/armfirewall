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
            const interface = Object.entries(getInterfaces()).find(([k, v]) => { return v.id === parseInt(req.params.id)});
            if(interface === undefined){
                res.status(404).render('errors/404', { layout: 'root' , name: req.session.name,});
            }else{
                const settings = interface[interface.length - 1];
                conn.query('SELECT * FROM interfaces', (err, rows) => {
                    if(err){
                        logger.error(err.message);
                        res.status(500).send('Error desconocido');
                    }else{
                        const result = JSON.parse(Object.values(JSON.parse(JSON.stringify(rows))).find(() => true).settingsComponent);
                        const newRes = result.find(x => x.interfaceId === interface[1].id);
                        if(newRes === undefined || typeof newRes === 'undefined'){
                            result.push({'interfaceId': interface[1].id, 'settings': { isEnabled: true, ip_setting: 'dhcp', isLocked: true, desc: `Interfaz ${interface[0]}`}})
                            conn.query('UPDATE configuration SET valConfiguration = ? WHERE idConfiguration = (SELECT idConfiguration WHERE idComponent = (SELECT nameComponent FROM interfaces))', [JSON.stringify(result)], (err, rows) => {
                                if(err || rows.affectedRows !== 1){
                                    if(err) logger.error(err.message);
                                    res.redirect('/');
                                }else{
                                    logger.warn(`Añadida interfaz (${interface[0]}). Fecha ${new Date().toJSON()}`)
                                    interfaces(req, res);
                                }
                            });
                        }else{
                            const final = Object.assign(settings, newRes.settings);
                            res.status(200).render('interface', { 
                                title: 'ARMwall - Interfaces', 
                                layout: 'root', 
                                name: req.session.name, 
                                interface: interface[0],
                                settings: final,
                                section: {name: 'Cortafuegos', pointer: `interfaz ${interface[1].id}`} 
                            });
                        }
                    }
                });
            }
        }
    });
}

module.exports = {
    main,
    interfaces
}