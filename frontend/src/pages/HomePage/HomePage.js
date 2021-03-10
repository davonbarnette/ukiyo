import './styles.scss';

import AnimeList from "../../components/AnimeList/AnimeList";
import AppStore from "../../stores/AppStore";
import {useState, useEffect} from "react";
import RouteHandler from "../../routes/RouteHandler";

function HomePage(){
    const [animes, setAnimes] = useState();

    async function setAnimeFromAPI(){
        let anime = await AppStore.crunchyroll.getSeries();
        if (anime) setAnimes(anime.map(single => single.most_recent_media));
    }

    function onAnimeClick(media){
        const {media_id, series_id} = media;
        RouteHandler.redirect(RouteHandler.watchById(series_id,media_id));
    }

    useEffect(()=>{
        setAnimeFromAPI();
    }, [])

    return (
        <div id='home-page'>
            <div className='home-page-content'>
                <AnimeList collectionList={animes} onAnimeClick={onAnimeClick}/>
            </div>
        </div>
    )
}

export default HomePage;