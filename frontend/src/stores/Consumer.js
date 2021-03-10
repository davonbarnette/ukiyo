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
}

export const EVENTS = {
    PAUSE_VIDEO:'pause_video',
    PLAY_VIDEO:'play_video',
    GUEST_JOINS:'guest_joins',
    ON_SEEK:'on_seek'
}

export const EventsMap = {
    [EVENTS.PAUSE_VIDEO]: WebsocketConsumerActions.onPauseVideo,
    [EVENTS.PLAY_VIDEO]: WebsocketConsumerActions.onPlayVideo,
    [EVENTS.GUEST_JOINS]: WebsocketConsumerActions.onGuestJoinsRoom,
    [EVENTS.ON_SEEK]: WebsocketConsumerActions.onSeek,
}