const uuid = require('uuid').v1;
const WsRouter = require('./wsRouter');

class WebSocketClass {

    constructor(websocketServer){
        this.websocketServer = websocketServer;
        this.websocketServer.on('connection', this.onConnect);
    }

    onConnect = (socket) => {
        let curRoomId = socket.handshake.query['roomId'];
        if (curRoomId === 'null') curRoomId = null;
        let newRoomId = uuid();
        if (curRoomId){
            socket.join(curRoomId)
        } else {
            socket.join(newRoomId);
        }

        console.log('Socket connected and given room: ', curRoomId || newRoomId);

        Object.keys(WsRouter).forEach(event => {
            socket.on(event, (message) => {
                let json = JSON.parse(message);
                console.log('Received event ', event, 'with message: ', json);

                let func = WsRouter[event]
                if(func) func(json, curRoomId || newRoomId, socket, this.websocketServer)
            });
        })

        let enterRoomData = { roomId: curRoomId };
        if (!curRoomId){
            enterRoomData.roomId = newRoomId;
            enterRoomData.asNew = true;
        }

        socket.emit('on_enter_room', enterRoomData)

    }
}

module.exports = WebSocketClass;