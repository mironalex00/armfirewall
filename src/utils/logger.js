const { createLogger, format, transports } = require('winston');

module.exports = createLogger({
    format: format.simple(),
    transports: [
        new transports.File({
            maxsize: 5120000,
            maxfiles: 5,
            filename: `${__dirname}/../public/logs/log-api.log`
        }),
        new transports.Console({
            level: 'debug',
        })
    ]
})