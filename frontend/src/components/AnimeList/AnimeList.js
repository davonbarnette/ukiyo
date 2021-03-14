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
            <List grid={{gutter:24, xs: 2, sm: 3, md:3, lg:4, xl:4, xxl:4}} dataSource={collectionList} renderItem={renderAnimeListItem}/>
        </div>
    )
}

export default observer(AnimeList);