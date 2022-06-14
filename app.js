//  IMPORTACIONES SISTEMA
const path = require('path');
const fs = require('fs');
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

//  DECLARACION APP
const app = express();

// DECLARACION USO CORS
app.use(cors())

// HBS HANDLEBARS
function yearHandlebar(){
    return new Date().getFullYear();
}

//  SE LE INDICARA A LA APLICACION QUE USARA EL MOTOR DE PLANTILLAS HBS
app.set('views', __dirname + '/src/views');
app.engine('.hbs', engine({
    extname: '.hbs',
    partialsDir: __dirname + '/src/views/partials',
    helpers : {
        now: yearHandlebar
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
    host: 'localhost',
    user: 'root',
    password: 'web',
    port: 3306,
    database: 'armfirewall'
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
},app).listen(app.get('port'), () => logger.info(`Application listening on port ${app.get('port')}`));
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

//  ENRUTAMIENTO 404
app.use((req, res, next) => {
    if(req.session.loggedin !== true){
        res.status(404).render('errors/404', { layout: 'main' });
    }else{
        res.status(404).render('errors/404', { layout: 'root' });
    }
})
