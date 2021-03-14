import './styles.scss';
import ChikaImg from '../../assets/chika.png';
import RouteHandler from "../../routes/RouteHandler";

function Header() {

    function onTitleClick() {
        RouteHandler.redirect(RouteHandler.base());
    }

    return (
        <header className="app-header">
            <div className='app-header-content'>
                <div className='app-header-content-left'>
                    <img className='logo' src={ChikaImg} alt="chika"/>
                    <div className='title' onClick={onTitleClick}>
                        <div className='hiragana'>
                            うきよ
                        </div>
                        <div className='english'>
                            UKIYO
                        </div>

                    </div>
                </div>
                <div className='app-header-content-right'>

                </div>
            </div>
        </header>
    )
}

export default Header;