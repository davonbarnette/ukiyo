import './App.scss';
import {Route, Switch} from 'react-router-dom';
import RouteHandler from './routes/RouteHandler';
import {Layout} from "antd";
import AppStore from "./stores/AppStore";
import HomePage from './pages/HomePage/HomePage';
import {observer} from "mobx-react";
import WatchPage from "./pages/WatchPage/WatchPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import Header from "./components/Header/Header";

AppStore.init();

function App(props) {

    return (
        <Layout className="app">
            <Header/>
            <div>
                <Switch>
                    <Route path={RouteHandler.watchByParam()}>
                        <WatchPage/>
                    </Route>
                    <Route  path={RouteHandler.login()} component={LoginPage}/>
                    {/*<Route path={RouteHandler.seriesByParam()} component={WatchPage}/>*/}
                    <Route exact path={RouteHandler.base()} component={HomePage}/>
                    {/*<Redirect to={RouteHandler.base()}/>*/}
                </Switch>
            </div>
        </Layout>
    );
}

export default observer(App);
