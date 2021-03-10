import './styles.scss';

import {withRouter} from 'react-router-dom';
import {useEffect, useState} from "react";
import AppStore from "../../stores/AppStore";
import VideoPlayer from 'react-video-js-player';
import AnimeList from "../../components/AnimeList/AnimeList";
import RouteHandler from "../../routes/RouteHandler";
import {observer} from "mobx-react";
import AppActions from "../../actions/AppActions";
import {autorun} from "mobx";
import {EVENTS} from "../../stores/Consumer";

function WatchPage(props) {
    const {seriesId, seriesMediaId} = props.match.params;
    const [info, setInfo] = useState();
    const [collectionMedia, setCollectionMedia] = useState();
    const [playerIsReady, setPlayerIsReady] = useState();
    const [videoJSPlayer, setVideoJSPlayer] = useState();
    const [latestSeekTime, setLatestSeekTime] = useState();

    async function getAndSetStreamData() {
        let curInfo = await AppStore.crunchyroll.getAnimeInfo(seriesMediaId);
        setInfo(curInfo);

        if (curInfo && curInfo.collection_id) {
            let collectionMedia = await AppStore.crunchyroll.getMedia(curInfo.collection_id);
            setCollectionMedia(collectionMedia.reverse());
        }
        if (playerIsReady && videoJSPlayer) {
            videoJSPlayer.src(curInfo.stream_data.streams[0].url);
            videoJSPlayer.poster(curInfo.screenshot_image.full_url);
        }
    }

    useEffect(() => {
        getAndSetStreamData();
    }, [seriesMediaId])

    useEffect(() =>
        autorun(() => {
            let latestMessage = AppStore.websocketMessageList[AppStore.websocketMessageList.length - 1];
            if (videoJSPlayer && latestMessage) {
                switch (latestMessage.event) {
                    case EVENTS.PLAY_VIDEO:
                        console.log('in here')
                        videoJSPlayer.play();
                        break;
                    case EVENTS.PAUSE_VIDEO:
                        videoJSPlayer.pause();
                        break;
                    case EVENTS.GUEST_JOINS:
                        break;
                    case EVENTS.ON_SEEK:
                        console.log('setting latest Seek time', latestMessage.data.curTime)
                        setLatestSeekTime(latestMessage.data.curTime)
                        videoJSPlayer.currentTime(latestMessage.data.curTime);
                        break;
                }
            }
        }), [videoJSPlayer, latestSeekTime]
    )


    function onAnimeClick(media) {
        RouteHandler.redirect(RouteHandler.watchById(seriesId, media.media_id));
    }

    function onPlayerReady(curPlayer) {
        console.log('player', curPlayer)
        setVideoJSPlayer(curPlayer);
        setPlayerIsReady(true);
    }

    function onPlay(curTime) {
        AppActions.sendWebsocketMessage(EVENTS.PLAY_VIDEO, {event: EVENTS.PLAY_VIDEO, data: {curTime}})
    }

    function onPause(curTime) {
        AppActions.sendWebsocketMessage(EVENTS.PAUSE_VIDEO, {event: EVENTS.PAUSE_VIDEO, data: {curTime}})
    }

    function onTimeUpdate(curTime) {

    }

    function onSeeking(curTime) {
        console.log('latestSeekTime', latestSeekTime);
        console.log('endSeek', curTime);
        if (latestSeekTime !== curTime) {
            AppActions.sendWebsocketMessage(EVENTS.ON_SEEK, {event: EVENTS.ON_SEEK, data: {curTime }})
        }
    }

    function onSeeked(startSeek, endSeek) {

    }

    function onEnd() {

    }

    return (
        <div id='watch-page'>
            <div className='video-section'>
                {info &&
                <VideoPlayer width={900} src={info.stream_data.streams[0].url}
                             poster={info.screenshot_image.full_url} onReady={onPlayerReady}
                             onPlay={onPlay} onPause={onPause} onTimeUpdate={onTimeUpdate}
                             onSeeking={onSeeking} onSeeked={onSeeked} onEnd={onEnd}/>}
            </div>
            <div className='collection'>
                <AnimeList collectionList={collectionMedia} onAnimeClick={onAnimeClick}/>
            </div>
        </div>
    )
}

export default withRouter(observer(WatchPage));