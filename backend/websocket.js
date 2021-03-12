const uuid = require('uuid').v1;
const WsRouter = require('./wsRouter');

class WebSocketClass {

    constructor(websocketServer){
        this.websocketServer = websocketServer;
        this.websocketServer.on('connection', this.onConnect);
    }

    onConnect = (socket) => {
        let roomId = socket.handshake.query['roomId'];
        if (!roomId) roomId = uuid();
        socket.join(roomId)
        console.log('Socket connected and given room: ', roomId);

        Object.keys(WsRouter).forEach(event => {

            socket.on(event, (message) => {
                let json = JSON.parse(message);
                console.log('Received event ', event, 'with message: ', json);

                let func = WsRouter[event]
                if(func) func(json, roomId, socket, this.websocketServer)
            });
        })

        socket.emit('on_enter_room', {roomId})

    }
}

module.exports = WebSocketClass;