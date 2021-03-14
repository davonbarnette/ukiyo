import './styles.scss';
import {CopyOutlined, CheckCircleOutlined} from '@ant-design/icons';
import {withRouter} from 'react-router-dom';
import {useEffect, useState, useRef} from "react";
import AppStore from "../../stores/AppStore";
import AnimeList from "../../components/AnimeList/AnimeList";
import RouteHandler from "../../routes/RouteHandler";
import {observer} from "mobx-react";
import AppActions from "../../actions/AppActions";
import {autorun} from "mobx";
import {EVENTS} from "../../stores/Consumer";
import {Player, DefaultUi, Hls, usePlayerContext, DefaultControls} from '@vime/react';
import '@vime/core/themes/default.css'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {Input} from "antd";
import cx from 'classnames';

function WatchPage(props) {
    const {seriesId, seriesMediaId} = props.match.params;
    const player = useRef(null);
    const [info, setInfo] = useState();
    const [collectionMedia, setCollectionMedia] = useState();
    const [currentTime] = usePlayerContext(player, 'currentTime', 0);
    const [copied, setCopied] = useState(false);

    async function getAndSetStreamData() {

        let curInfo = await AppStore.crunchyroll.getAnimeInfo(seriesMediaId);
        if (curInfo) {
            const {stream_data, screenshot_image, collection_id} = curInfo
            setInfo(curInfo);

            if (collection_id) {
                let collectionMedia = await AppStore.crunchyroll.getMedia(collection_id);
                setCollectionMedia(collectionMedia.reverse());
            }
        }
    }

    useEffect(() => {
        getAndSetStreamData();
    }, [])

    useEffect(() =>
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
                        player.currentTime = latestMessage.data.curTime;
                        break;
                    case EVENTS.ON_NEW_VIDEO:
                        const {mediaId, seriesId} = latestMessage.data;
                        window.location.href = RouteHandler.watchById(seriesId, mediaId);
                        break;
                }
            }
        }), []
    )

    async function onAnimeClick(media) {
        AppActions.sendWebsocketMessage(EVENTS.ON_NEW_VIDEO, {
            event: EVENTS.ON_NEW_VIDEO,
            data: {seriesId, mediaId: media.media_id}
        })
        window.location.href = RouteHandler.watchById(seriesId, media.media_id);
    }

    function onReady() {

    }

    function onPlay() {
        AppActions.sendWebsocketMessage(EVENTS.PLAY_VIDEO, {event: EVENTS.PLAY_VIDEO})
    }

    function onPause(event) {
        AppActions.sendWebsocketMessage(EVENTS.PAUSE_VIDEO, {event: EVENTS.PAUSE_VIDEO})
    }

    function onSeeked() {
        AppActions.sendWebsocketMessage(EVENTS.ON_SEEK, {event: EVENTS.ON_SEEK, data: {curTime: currentTime}})
    }

    function onEnd() {

    }

    function getUrl() {
        return `${window.location.host}/watch/${seriesId}/${seriesMediaId}?roomId=${AppStore.currentRoomId}`
    }

    function onCopy() {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000)
    }

    if (!info) return null;

    const {
        stream_data, screenshot_image, collection_name, series_name, description,
        name: episode_name, duration, episode_number
    } = info;
    let poster = screenshot_image.full_url;
    let stream = stream_data?.streams?.[0].url

    return (
        <div id='watch-page'>
            <div className='video-section'>
                {stream && poster &&
                <Player class='video-player-override' theme="dark" ref={player}
                        onVmPlay={onPlay} currentTime={currentTime} onVmPausedChange={onPause}
                        onVmSeeked={onSeeked} onVmReady={onReady}>
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
            <div className='media'>
                <div className='anime-title'>
                    {collection_name}
                </div>
                <div className='collection-info'>
                    {/*<div className='collection-name'>*/}
                    {/*    {collection_name}*/}
                    {/*</div>*/}
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
            <div className='collection'>
                <div className='collection-header'>
                    This Season's Episodes
                </div>
                <AnimeList collectionList={collectionMedia} onAnimeClick={onAnimeClick}/>
            </div>
        </div>
    )
}

export default withRouter(observer(WatchPage));