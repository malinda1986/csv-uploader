import { socketPath } from 'utils'
const socket = require('socket.io-client')('http://localhost:8080');

export async function connectSocket (socketId) {
    console.log('socket id=====', socketId)
    socket.on('connect', function () {
        console.log('connected...');
        socket.emit('join', socketId);
    
    });
    socket.on('disconnect', function(){
        console.log('socket disconnected------------------------------>')
    });
}

module.exports = {
    connectSocket,
    socket
};