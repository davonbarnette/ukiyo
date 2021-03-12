const WsActions = require('./wsActions');

let wsRouter = {
    'pause_video': WsActions.onPauseVideo,
    'play_video': WsActions.onPlayVideo,
    'guest_joins': WsActions.onGuestJoinsRoom,
    'on_seek': WsActions.onSeek,
    'on_new_video':WsActions.onNewVideo,
}

module.exports = wsRouter;