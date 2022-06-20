const os = require('os');

function getInterfaces() {
    const interfaces = os.networkInterfaces(), cleanInterfaces = {};
    for(const interface in interfaces){
        const res = (interfaces[interface]).map((value, index) =>{
            if(value.family === 'IPv4' && value.address !== '127.0.0.1' && !value.internal){
                cleanInterfaces[interface] = interfaces[interface][index];
                cleanInterfaces[interface]['id'] = interfaces[interface][index > 0 ? (index - 1) : index]['scopeid']
            } 
        });
    }
    return cleanInterfaces;
}

module.exports = {
    getInterfaces
}