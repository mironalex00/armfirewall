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
                        res.status(500).send('Error desconocido');
                    }else{
                        const result = JSON.parse(Object.values(JSON.parse(JSON.stringify(rows))).find(() => true).settingsComponent);
                        const newRes = result.find(x => x.interfaceId === interface.interfaceId,);
                        if(newRes === undefined || typeof newRes === 'undefined'){
                            result.push({
                            'interfaceId': interface.interfaceId, 
                            'settings': { 
                                isEnabled: true, 
                                ip_setting: settings.isPrimary ? 'dhcp' : 'ipv4',
                                isPrimary: settings.isPrimary, 
                                isLocked: settings.isPrimary ? true : false, 
                                desc: `Interfaz ${interface.interfaceName}`
                            }});
                            conn.query('UPDATE configuration SET valConfiguration = ? WHERE idConfiguration = (SELECT idConfiguration WHERE idComponent = (SELECT nameComponent FROM interfaces))', [JSON.stringify(result)], (err, rows) => {
                                if(err || rows.affectedRows !== 1){
                                    if(err) logger.error(err.message);
                                    res.redirect('/');
                                }else{
                                    logger.warn(`Añadida interfaz (${interface.interfaceName}). Fecha ${new Date().toJSON()}`)
                                    interfaces(req, res);
                                }
                            });
                        }else{
                            const final = Object.assign({'id': interface.interfaceId}, Object.assign(settings, newRes.settings));
                            res.status(200).render('interface', { 
                                title: 'ARMwall - Interfaces', 
                                layout: 'root', 
                                name: req.session.name, 
                                interface: interface.interfaceName,
                                settings: { ...final, interfaceId: interface.interfaceId },
                                section: {name: 'Cortafuegos', pointer: `interfaz ${interface.interfaceId}`} 
                            });
                        }
                    }
                });
            }
        }
    });
}
function rules(req, res){
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
                conn.query('SELECT * FROM rules', (err, rows) => {
                    if(err){
                        logger.error(err.message);
                        res.status(500).send('Erlror desconocido');
                    }else{
                        const result = JSON.parse(Object.values(JSON.parse(JSON.stringify(rows))).find(() => true).settingsComponent);
                        const newRes = result.find(x => x.interfaceId === interface.interfaceId);
                        const final = Object.assign(settings, ( typeof newRes !== 'undefined' ? newRes.settings : ''));
                        res.status(200).render('rule', { 
                            title: 'ARMwall - Reglas', 
                            layout: 'root', 
                            name: req.session.name, 
                            interface: interface.interfaceName,
                            settings: final,
                            section: {name: 'Cortafuegos', pointer: `interfaz ${interface.interfaceId}`} 
                        });
                    }
                });
            }
        }
    });

}
function add(req, res){
    req.getConnection((err, conn) => {
        if(err) {
          logger.error(err.message);
          res.redirect('/auth/logout');
        }else if(req.session.loggedin !== true) {
          res.redirect('/auth/login');
        }else{

        }
    });
}
function restore(req, res){
    req.getConnection((err, conn) => {
        if(err) {
          logger.error(err.message);
          res.redirect('/auth/logout');
        }else if(req.session.loggedin !== true) {
          res.redirect('/auth/login');
        }else{
        }
    });
}
module.exports = {
    main,
    interfaces,
    rules,
    add,
    restore
}