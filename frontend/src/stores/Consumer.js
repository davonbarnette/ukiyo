import AppStore from "./AppStore";

export class WebsocketConsumerActions {
    static onPauseVideo(){

    }

    static onPlayVideo(data){
        console.log('video is played and emitted', data)
    }

    static onGuestJoinsRoom(){

    }

    static onSeek(){

    }

    static onNewVideo(){

    }

    static onPlayerReady(){

    }

    static onEnterRoom(data){
        console.log('Entered room with ID: ', data.roomId);
        AppStore.currentRoomId = data.roomId;
    }
}

export const EVENTS = {
    PAUSE_VIDEO:'pause_video',
    PLAY_VIDEO:'play_video',
    GUEST_JOINS:'guest_joins',
    ON_SEEK:'on_seek',
    ON_NEW_VIDEO:'on_new_video',
    ON_PLAYER_READY:'on_player_ready',
    ON_ENTER_ROOM: 'on_enter_room',
}

export const EventsMap = {
    [EVENTS.PAUSE_VIDEO]: WebsocketConsumerActions.onPauseVideo,
    [EVENTS.PLAY_VIDEO]: WebsocketConsumerActions.onPlayVideo,
    [EVENTS.GUEST_JOINS]: WebsocketConsumerActions.onGuestJoinsRoom,
    [EVENTS.ON_SEEK]: WebsocketConsumerActions.onSeek,
    [EVENTS.ON_NEW_VIDEO]: WebsocketConsumerActions.onNewVideo,
    [EVENTS.ON_PLAYER_READY]: WebsocketConsumerActions.onPlayerReady,
    [EVENTS.ON_ENTER_ROOM]: WebsocketConsumerActions.onEnterRoom,
}