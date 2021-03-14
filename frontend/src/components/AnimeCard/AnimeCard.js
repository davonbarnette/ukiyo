import './styles.scss';
import {Typography} from "antd";

function AnimeCard({media, onClick}){
    const { screenshot_image, collection_name, episode_number } = media;

    function onAnimeClick(){
        if (onClick) onClick(media)
    }

    return (
        <div className='anime-card' onClick={onAnimeClick}>
            <div className='anime-card-img'>
                <img alt="screenshot_image" src={screenshot_image.full_url}/>
            </div>
            <div className='anime-card-description'>
                <Typography.Paragraph className='anime-name' ellipsis={{rows:1}}>
                    {collection_name}
                </Typography.Paragraph>
                <Typography.Paragraph className='episode-name' ellipsis={{rows:1}}>
                    Episode {episode_number}
                </Typography.Paragraph>
            </div>
        </div>
    )
}

export default AnimeCard;