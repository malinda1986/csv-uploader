
function setConnectionOfSocket(io) {
    
    io.on('connection', function(socket) {
        console.log("Socket connected============");
        socket.on('join', function(socketId) {
            socket.join(socketId); // We are using room of socket io
            console.log('Join with the clint....')
        });
        socket.on('disconnect', function () {
            io.emit('user disconnected');
        });
    });
}

function sendSocketMessage(io, socketId, chanel, message) {
    io.sockets.in(socketId).emit(chanel, {msg: message});
}

module.exports={
    setConnectionOfSocket,
    sendSocketMessage
}
