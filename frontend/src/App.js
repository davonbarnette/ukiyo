import {useEffect} from 'react';
import './App.scss';
import {Route, Switch} from 'react-router-dom';
import RouteHandler from './routes/RouteHandler';
import {Layout} from "antd";
import AppStore from "./stores/AppStore";
import HomePage from './pages/HomePage/HomePage';
import {observer} from "mobx-react";
import WatchPage from "./pages/WatchPage/WatchPage";
import LoginPage from "./pages/LoginPage/LoginPage";

AppStore.init();

function App(props) {

    useEffect(() => {

    }, [])

    return (
        <Layout className="app">
            <header className="app-header">

            </header>
            <div>
                <Switch>
                    <Route path={RouteHandler.watchByParam()}>
                        <WatchPage/>
                    </Route>
                    <Route path={RouteHandler.login()} component={LoginPage}/>
                    {/*<Route path={RouteHandler.seriesByParam()} component={WatchPage}/>*/}
                    <Route exact path={RouteHandler.base()} component={HomePage}/>
                    {/*<Redirect to={RouteHandler.base()}/>*/}
                </Switch>
            </div>
        </Layout>
    );
}

export default observer(App);
