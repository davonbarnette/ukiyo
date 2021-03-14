import './styles.scss';

import {DefaultControls, DefaultUi, Hls, Player, usePlayerContext} from "@vime/react";
import {Input} from "antd";
import {CopyToClipboard} from "react-copy-to-clipboard";
import cx from "classnames";
import {CheckCircleOutlined, CopyOutlined} from "@ant-design/icons";
import AppStore from "../../stores/AppStore";
import {useEffect, useRef, useState} from "react";
import {autorun} from "mobx";
import {EVENTS} from "../../stores/Consumer";
import RouteHandler from "../../routes/RouteHandler";
import AppActions from "../../actions/AppActions";

function AnimeWatch(props) {
    const {animeInfo, seriesId, seriesMediaId} = props;
    const player = useRef(null);
    const [copied, setCopied] = useState(false);
    const [currentTime] = usePlayerContext(player, 'currentTime', 0);

    function onReady() {
        //TODO set the state in the backend for watching correctly
    }

    function onPlay() {
        AppActions.sendWebsocketMessage(EVENTS.PLAY_VIDEO, {event: EVENTS.PLAY_VIDEO})
    }

    function onPause(event) {
        if (event.detail) {
            AppActions.sendWebsocketMessage(EVENTS.PAUSE_VIDEO, {event: EVENTS.PAUSE_VIDEO})
        }
    }

    function onSeeked() {
        AppActions.sendWebsocketMessage(EVENTS.ON_SEEK, {event: EVENTS.ON_SEEK, data: {curTime: currentTime}})
    }

    function onEnd() {

    }

    function getUrl() {
        return `${window.location.protocol}//${window.location.host}/watch/${seriesId}/${seriesMediaId}?roomId=${AppStore.currentRoomId}`
    }

    function onCopy() {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000)
    }

    useEffect(() => {
            autorun(() => {
                let latestMessage = AppStore.websocketMessageList[AppStore.websocketMessageList.length - 1];
                if (player && latestMessage) {
                    switch (latestMessage.event) {
                        case EVENTS.PLAY_VIDEO:
                            player.current.play();
                            break;
                        case EVENTS.PAUSE_VIDEO:
                            player.current.pause();
                            break;
                        case EVENTS.GUEST_JOINS:
                            break;
                        case EVENTS.ON_SEEK:
                            player.current.currentTime = latestMessage.data.curTime;
                            break;
                        case EVENTS.ON_NEW_VIDEO:
                            const {mediaId, seriesId} = latestMessage.data;
                            RouteHandler.redirect(RouteHandler.watchById(seriesId, mediaId));
                            break;
                        default:
                            break;
                    }
                }
            })
        }, []
    )

    const {
        stream_data, screenshot_image, collection_name, description,
        name: episode_name, episode_number
    } = animeInfo;
    let poster = screenshot_image.full_url;
    let stream = stream_data?.streams?.[0]?.url

    return (
        <div className='anime-watch'>
            <div className='video-section'>
                {stream && poster &&
                <Player class='video-player-override' theme="dark" ref={player}
                        onVmPlay={onPlay} currentTime={currentTime} onVmPausedChange={onPause}
                        onVmSeeked={onSeeked} onVmReady={onReady} vmPlaybackEnded={onEnd}>
                    <Hls key={poster} poster={poster}>
                        <source src={stream} type="application/x-mpegURL"/>
                    </Hls>
                    <DefaultUi noControls>
                        <DefaultControls
                            hideOnMouseLeave
                            activeDuration={2000}
                        />
                    </DefaultUi>
                </Player>}
            </div>
            <div className='anime-watch-content'>
                <div className='media'>
                <div className='anime-title'>
                    {collection_name}
                </div>
                <div className='collection-info'>
                    <div className='episode-number'>
                        Episode {episode_number}
                    </div>
                    <div className='episode-name'>
                        {episode_name}
                    </div>
                </div>
                <div className='description'>
                    {description}
                </div>
            </div>
            <div className='actions-bar'>
                <div className='actions-bar-header'>
                    <div>Watch With Friends</div>
                    <div className='actions-bar-header-sub'>Copy the link below and share it with your friends to watch anime together!</div>
                </div>
                <div className='content'>
                    <Input id='share-link' size='large' value={getUrl()} disabled/>
                    <CopyToClipboard text={getUrl()} onCopy={onCopy}>
                        <div className={cx('copy-link', {copied})}>
                            {copied ?
                                <>
                                    <CheckCircleOutlined style={{marginRight: 3}}/> Copied!
                                </>
                                :
                                <>
                                    <CopyOutlined style={{marginRight: 3}}/> Copy Link
                                </>}
                        </div>
                    </CopyToClipboard>
                </div>
                <div className='room-id'>Room ID: {AppStore.currentRoomId}</div>
            </div>
            </div>
        </div>
    )
}

export default AnimeWatch;