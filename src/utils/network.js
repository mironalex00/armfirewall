const os = require('os');
const {execShell, execShellArray} = require('../utils/execShell');
//  FUNCIONES EXPORTABLES
function getInterfaces() {
    const interfaces = os.networkInterfaces();
    let cleanInterfaces = [];
    for(const interface in interfaces){
        const res = (interfaces[interface]).map((value, index) =>{
            if(value.family === 'IPv4' && value.address !== '127.0.0.1' && !value.internal){
                const scopeid = interfaces[interface][index > 0 ? (index - 1) : index]['scopeid'];
                const obj = {'interfaceName': interface, interfaceId: scopeid ,'settings': interfaces[interface][index]};
                if(cleanInterfaces.indexOf(obj) === -1){
                    obj.settings['isPrimary'] = false;
                    cleanInterfaces.push(obj);
                }
            } 
        });
    }
    cleanInterfaces = cleanInterfaces.sort((n1,n2) => n1.interfaceId - n2.interfaceId);
    const primary = cleanInterfaces.indexOf(cleanInterfaces.find((k,i) => {return !k.interfaceName.toLowerCase().includes('virtualbox')}));
    cleanInterfaces[primary].settings.isPrimary = true;
    return cleanInterfaces;
}
//  EXPORTACIONES
module.exports = {
    getInterfaces
}