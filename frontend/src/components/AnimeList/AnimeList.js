import './styles.scss';

import {observer} from "mobx-react";
import {List} from "antd";
import AnimeCard from "../AnimeCard/AnimeCard";

function AnimeList(props){
    const {collectionList, onAnimeClick} = props;

    function renderAnimeListItem(media, i){
        return (
            <List.Item key={i}>
                <AnimeCard media={media} onClick={onAnimeClick}/>
            </List.Item>
        )
    }

    return (
        <div className='anime-list'>
            <List grid={{gutter:16, xs: 1, sm: 2, md:4, lg:4}} dataSource={collectionList} renderItem={renderAnimeListItem}/>
        </div>
    )
}

export default observer(AnimeList);