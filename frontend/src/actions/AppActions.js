import AppStore from "../stores/AppStore";
import RouteHandler from "../routes/RouteHandler";

export default class AppActions {

    static async loginToCrunchyroll(account, password) {
        let success = await AppStore.crunchyroll.login(account, password);
        if (success) {
            RouteHandler.redirect(RouteHandler.base());
        }
    }

    static sendWebsocketMessage(event, message){
        console.log('Sending websocket event: ', event, message);
        message.deviceId = AppStore.crunchyroll.getDeviceId();
        AppStore.websocket.emit(event, JSON.stringify(message));
    }

}