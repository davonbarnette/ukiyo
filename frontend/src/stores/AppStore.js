import Crunchyroll from "../utils/crunchyroll";
import {io} from 'socket.io-client';
import {EventsMap} from "./Consumer";
import {makeObservable, observable} from "mobx";

class AppStoreSingleton {

    websocketMessageList = [];

    constructor() {
        makeObservable(this, {
            websocketMessageList:observable,
        })
    }

    init(){
        this.crunchyroll = new Crunchyroll();

        let websocketURL = process.env.NODE_ENV === 'development' ? "http://localhost:8000" : "http://localhost:8000"
        this.websocket = io(websocketURL, {query: `roomId=test_room`});
        this.websocket.on('connect', ()=> console.log(`Connected to websocket at ${websocketURL}`));

        // Register all of the events and their corresponding consumers.
        Object.keys(EventsMap).forEach(event => {
            this.websocket.on(event, (message) => {
                this.websocketMessageList.push(message);
                EventsMap[event](message);
            })
        });

    }

}



const AppStore = new AppStoreSingleton();
export default AppStore;