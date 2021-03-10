class WsActions {

    static onHostJoinsRoom = (data, roomId, socket, websocketServer) => {

    }

    static onGuestJoinsRoom = (data, roomId, socket, websocketServer) => {
        socket.to(roomId).emit(data.event, data);
    }

    static onPlayVideo = (data, roomId, socket, websocketServer) => {
        socket.to(roomId).emit(data.event, data);
    }

    static onPauseVideo = (data, roomId, socket, websocketServer) => {
        socket.to(roomId).emit(data.event, data);
    }

    static onSeek = (data, roomId, socket, websocketServer) => {
        socket.to(roomId).emit(data.event, data);
    }
}

module.exports = WsActions;