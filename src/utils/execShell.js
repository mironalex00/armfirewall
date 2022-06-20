const {exec} = require('child_process');
const logger = require('../utils/logger');
function execShell(command) {
    return new Promise(function(resolve, reject) {
        exec(command, { encoding: 'utf8' }, (error, stdout, stderr) => {
            if (error) {
                logger.error(`Unable to complete command (${command}), reason: ${error.message.replace(/(?:\r\n|\r|\n)/g, ' ')}`);
                reject(error);
                return;
            }
            logger.info(`Recieved and executed the command: ${command}`)
            resolve(stdout.trim());
        });
    });
}
async function checkPermissions(command){
  return await execShell(command);
}
async function execShellArray (commands){
    let final = true;
    for (const command of commands) {
        const finalAux = await checkPermissions(command).then(resp => {
            return true
        }).catch(err => {
            return false;
        });
        if(!finalAux) {
        final = false;      
        break;
        }
    }
    return final;
}
module.exports = {
    execShell,
    execShellArray
}