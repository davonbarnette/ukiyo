import './styles.scss';

import AnimeList from "../../components/AnimeList/AnimeList";
import AppStore from "../../stores/AppStore";
import {useState, useEffect} from "react";
import RouteHandler from "../../routes/RouteHandler";

function HomePage(){
    const [loadingAnime, setLoadingAnime] = useState();
    const [recentlyUpdatedAnime, setRecentlyUpdatedAnime] = useState();
    const [recentlyWatchedAnime, setRecentlyWatchedAnime] = useState();

    async function getAndSetRecentlyUpdatedAnime(){
        let anime = await AppStore.crunchyroll.getSeries();
        if (anime) setRecentlyUpdatedAnime(anime.map(single => single.most_recent_media));
    }
    async function getAndSetRecentlyWatchedAnime(){
        let anime = await AppStore.crunchyroll.getRecentlyWatched();
        if (anime) setRecentlyWatchedAnime(anime.map(single => single.media));
    }

    function onAnimeClick(media){
        const {media_id, series_id} = media;
        RouteHandler.redirect(RouteHandler.watchById(series_id,media_id));
    }

    async function loadAllAnime(){
        setLoadingAnime(true);
        await getAndSetRecentlyUpdatedAnime();
        await getAndSetRecentlyWatchedAnime();
        setLoadingAnime(false);
    }

    useEffect(()=>{
        loadAllAnime();
    }, [])

    if (loadingAnime) return 'Loading anime...'

    return (
        <div id='home-page'>
            <div className='home-page-content'>
                <div className='home-page-content-subheader'>
                    Recently Watched
                </div>
                <AnimeList collectionList={recentlyWatchedAnime} onAnimeClick={onAnimeClick}/>
                <div className='home-page-content-subheader' style={{marginTop: 48}}>
                    Newly Updated Episodes
                </div>
                <AnimeList collectionList={recentlyUpdatedAnime} onAnimeClick={onAnimeClick}/>
            </div>
        </div>
    )
}

export default HomePage;