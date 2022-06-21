//  IMPORTACIONES SISTEMA
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv')
const {getInterfaces} = require('./src/utils/network');
//  IMPORTACIONES SERVIDOR ESCUCHA
const http = require('http');
const https = require('https');
const mysql = require('mysql');
const logger = require('./src/utils/logger');
//  IMPORTACIONES EXTRAS
const express = require('express');
const cors = require('cors')
const {engine} = require('express-handlebars');
const myConnection = require('express-myconnection');
const session = require('express-session');
const bodyParser = require('body-parser');
//  IMPORTACION RUTAS
const indexRoutes = require('./src/routes/index');
const dashboardRoutes = require('./src/routes/dashboard');
const authRoutes = require('./src/routes/authentication');
const sysRoutes = require('./src/routes/system');
const firewallRoutes = require('./src/routes/firewall');
const { handlebars } = require('hbs');

//  SE CONFIGURA DOTENV 
dotenv.config({ path: './.env' })
dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

//  DECLARACION APP
const app = express();

// DECLARACION USO CORS
app.use(cors())

// HBS HANDLEBARS
function yearHandlebar(){
    return new Date().getFullYear();
}
function shutdownOSHandlebar(){
    return process.platform === "win32" ? "shutdown -r -t 0" : "systemctl reboot";
}
function rebootOHandlebar(){
    return process.platform === "win32" ? "shutdown -s -t 0" : "systemctl poweroff";
}
function equalsHandlebar(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
}
function interfacesHandlebar(path){
    const interfaces = getInterfaces();
    const txtPath = path.includes("/") ? path.substring(path.lastIndexOf("/") + 1) + " de" : path;
    let htmlRes = '';
    if(Object.keys(interfaces).length === 0){
        htmlRes = `
        <li>
            <a>No interfaces avaliable</a>
        </li>
        `
    }
    if(Object.keys(interfaces).length > 0){
        for (const interface in interfaces) {
            if (Object.hasOwnProperty.call(interfaces, interface)) {
                const element = interfaces[interface];
                htmlRes += `    
                <li>
                    <a href="/${path}/${element.id}" title="Configure ${txtPath} ${interface}" class="text-truncate" style="max-width: 250px">
                        Configurar ${interface}
                    </a>
                </li>
                 `
            }
        }
    }
    return new handlebars.SafeString(htmlRes);
}

//  SE LE INDICARA A LA APLICACION QUE USARA EL MOTOR DE PLANTILLAS HBS
app.set('views', __dirname + '/src/views');
app.engine('.hbs', engine({
    extname: '.hbs',
    partialsDir: __dirname + '/src/views/partials',
    helpers : {
        now: yearHandlebar,
        shutdownOSHandlebar,
        rebootOHandlebar,
        interfacesHandlebar,
        ifEq: equalsHandlebar
    }
}));
app.set('view engine', 'hbs');

//  SE LE INDICARA A LA APLICACION QUE USARA BODYPARSER
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//  SE LE INDICA A LA APLICACION QUE SE USARA MYSQL
app.use(myConnection(mysql, {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
}, 'pool'));

//  SE LE INDICA A LA APLICACION LA CONFIGURACION DE LAS SESIONES
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//  DECLARACION PUERTO APP
app.set('port', 443);
//  SE INDICA A LA APP QUE ESCUCHE POR EL PUERTO HTTPS DEFAULT
https.createServer({
    cert: fs.readFileSync(path.join(__dirname, '/src/public/certs/arm.crt')),
    key: fs.readFileSync(path.join(__dirname, '/src/public/certs/arm.key'))
},app).listen(app.get('port'), (err) => {
    if(err) 
    logger.error(`Application error: ${err.message}`);
    else
    logger.info(`Application listening on port ${app.get('port')}`);
});
//  SE LE DICE A LA APP QUE SI HAY UNA CONEXION HTTP ENTRANTE AUTOMATICAMENTE REDIRIJA A HTTPS
http.createServer(function (req, res) {
    res.writeHead(301, { "Location": 'https://' + req.headers.host + req.url });
    res.end();
}).listen(80);

//  SE LE INDICA AL SERVICIO QUE SE TENGA ACCESO A TODO LO PUBLICO
app.use("/assets", express.static(path.join(__dirname, '/src/public/assets')));
app.use("/media", express.static(path.join(__dirname, '/src/public/media')));

//  ENRUTAMIENTO MAIN
app.use('/', indexRoutes);
//  ENRUTAMIENTO DASHBOARD
app.use('/dashboard', dashboardRoutes);
//  ENRUTAMIENTO LOGIN
app.use('/auth', authRoutes);
//  ENRUTAMIENTO SYSTEM
app.use('/system', sysRoutes);
// ENRUTAMIENTO FIREWALL
app.use('/firewall', firewallRoutes);

//  ENRUTAMIENTO 404
app.use((req, res, next) => {
    if(req.session.loggedin !== true){
        res.status(404).render('errors/404', { layout: 'main' });
    }else{
        res.status(404).render('errors/404', { layout: 'root' , name: req.session.name,});
    }
})

process.on('uncaughtException', (error, origin) => {
    logger.error(`Error por parte de servidor: ${error.message.replace(/\n/g, ' ')} - ${origin}`);
})