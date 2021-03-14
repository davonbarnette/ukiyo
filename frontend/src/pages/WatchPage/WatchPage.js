import './styles.scss';
import {withRouter} from 'react-router-dom';
import {useEffect, useState} from "react";
import AppStore from "../../stores/AppStore";
import AnimeList from "../../components/AnimeList/AnimeList";
import RouteHandler from "../../routes/RouteHandler";
import {observer} from "mobx-react";
import AppActions from "../../actions/AppActions";
import {EVENTS} from "../../stores/Consumer";
import '@vime/core/themes/default.css'
import AnimeWatch from "../../components/AnimeWatch/AnimeWatch";

function WatchPage(props) {
    const {seriesId, seriesMediaId} = props.match.params;

    const [info, setInfo] = useState();
    const [collectionMedia, setCollectionMedia] = useState();

    async function getAndSetStreamData() {
        let curInfo = await AppStore.crunchyroll.getAnimeInfo(seriesMediaId);
        if (curInfo) {
            const {collection_id} = curInfo
            setInfo(curInfo);

            if (collection_id) {
                let collectionMedia = await AppStore.crunchyroll.getMedia(collection_id);
                setCollectionMedia(collectionMedia.reverse());
            }
        }
    }

    useEffect(() => {
        getAndSetStreamData();
    }, [seriesMediaId])

    async function onAnimeClick(media) {
        AppActions.sendWebsocketMessage(EVENTS.ON_NEW_VIDEO, {
            event: EVENTS.ON_NEW_VIDEO,
            data: {seriesId, mediaId: media.media_id}
        })
        RouteHandler.redirect(RouteHandler.watchById(seriesId, media.media_id))
    }

    if (!info) return null;

    return (
        <div id='watch-page'>
            <AnimeWatch key={seriesMediaId} animeInfo={info}
                        seriesId={seriesId} seriesMediaId={seriesMediaId}/>
            <div className='content-collection'>
                <div className='collection'>
                    <div className='collection-header'>
                        This Season's Episodes
                    </div>
                    <AnimeList collectionList={collectionMedia} onAnimeClick={onAnimeClick}/>
                </div>
            </div>
        </div>
    )
}

export default withRouter(observer(WatchPage));