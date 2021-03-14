import Crunchyroll from "../utils/crunchyroll";
import {io} from 'socket.io-client';
import {EventsMap} from "./Consumer";
import {makeObservable, observable, action} from "mobx";

class AppStoreSingleton {

    websocketMessageList = [];
    currentRoomId = null;

    constructor() {
        makeObservable(this, {
            websocketMessageList: observable,
            currentRoomId: observable,
        })
    }

    init() {
        this.crunchyroll = new Crunchyroll();

        let websocketURL = process.env.NODE_ENV === 'development' ? "http://localhost:8000" : "http://localhost:8000";
        const urlParams = new URLSearchParams(window.location.search);
        const roomId = urlParams.get('roomId');
        const lsRoomId = localStorage.getItem('roomId');
        let opts = {};
        if (roomId) opts.query = `roomId=${roomId}`
        else if (lsRoomId) opts.query = `roomId=${lsRoomId}`;
        this.websocket = io(websocketURL, opts);
        this.websocket.on('connect', () => console.log(`Connected to websocket at ${websocketURL}`));

        // Register all of the events and their corresponding consumers.
        Object.keys(EventsMap).forEach(event => {
            this.websocket.on(event, action((message) => {
                this.websocketMessageList.push(message);
                EventsMap[event](message);
            }))
        });

    }

}


const AppStore = new AppStoreSingleton();
export default AppStore;