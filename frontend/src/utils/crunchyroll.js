import axios from 'axios';
import {v1 as uuid} from 'uuid';
import {makeObservable, observable} from "mobx";

export default class Crunchyroll {

    access_token = 'LNDJgOit5yaRIWN';
    connectivity_type = 'ethernet';
    locale = ()=> localStorage.getItem('locale') || 'enUS';
    version = '1.1.20.0';
    device_type = 'com.crunchyroll.windows.desktop';
    user = null;
    auth = null;
    expires = null;
    session_id = null;
    fields = "media.media_id,media.available,media.available_time,media.collection_id,media.collection_name,media.series_id,media.type,media.episode_number,media.name,media.description,media.screenshot_image,media.created,media.duration,media.playhead,media.bif_url,media.series_name,series.most_recent_media"

    constructor(){

        makeObservable(this, {
            access_token:observable,
            user:observable,
            auth:observable,
            expires:observable,
            session_id:observable,
        })

        this.checkAuth();
        this.startSession();
    }

    checkAuth(){
        let authToken = localStorage.getItem(CRUNCHYROLL_LOCAL_STORAGE.AUTH_TOKEN);
        if (authToken) this.auth = authToken;
        return authToken;
    }

    getDeviceId() {
        let deviceId = localStorage.getItem(CRUNCHYROLL_LOCAL_STORAGE.DEVICE_ID);
        if (deviceId) return deviceId;
        else {
            let newDeviceId = uuid();
            localStorage.setItem(CRUNCHYROLL_LOCAL_STORAGE.DEVICE_ID, newDeviceId);
            return newDeviceId;
        }
    }

    async login(account, password) {
        try {
            let data = {
                account, password,
                locale: this.locale(),
                version: '1.1.20.0',
                session_id:this.session_id,
            };
            let formData = new FormData();
            Object.keys(data).forEach(key => formData.append(key, data[key]))

            let res = await axios.post(getCrunchyRollApiUrl(CRUNCHYROLL_API_URLS.LOGIN), formData);
            // Gives us {auth, expires, user}
            const {auth, expires, user} = res.data.data;

            localStorage.setItem(CRUNCHYROLL_LOCAL_STORAGE.AUTH_TOKEN, auth);
            localStorage.setItem(CRUNCHYROLL_LOCAL_STORAGE.AUTH_EXPIRY, expires);

            this.auth = auth;
            this.expires = expires;
            this.user = user;
            return true;
        } catch (e) {
            console.error('Could not login to crunchyroll', e.message);
            return false;
        }
    }

    getSession(){
        return localStorage.getItem(CRUNCHYROLL_LOCAL_STORAGE.SESSION);
    }

    async startSession() {
        let session_id = this.getSession();
        let auth = this.checkAuth();
        if (session_id) this.session_id = session_id;
        if (auth) this.auth = auth;

        const {device_type, access_token, locale, version, connectivity_type, getDeviceId} = this;
        let params = {
            access_token, device_type, version, connectivity_type, auth,
            locale: locale(),
            device_id:getDeviceId(),
        };
        try {
            let res = await axios.get(getCrunchyRollApiUrl(CRUNCHYROLL_API_URLS.START_SESSION), {params});
            const {session_id, expires} = res.data.data;

            localStorage.setItem(CRUNCHYROLL_LOCAL_STORAGE.SESSION, session_id);
            localStorage.setItem(CRUNCHYROLL_LOCAL_STORAGE.SESSION_EXPIRY, expires);

            this.session_id = session_id;
            this.expires = expires;

        } catch (e) {
            console.error('Could not start session', e.message);
            return undefined;
        }
    }

    async getAnimeInfo(media_id){
        const {session_id, version, connectivity_type, locale, fields} = this;
        let params = {
            session_id, media_id, fields:fields + ',media.stream_data', locale:locale(), version, connectivity_type,
        }
        try{
            let res = await axios.get(getCrunchyRollApiUrl(CRUNCHYROLL_API_URLS.ANIME_INFO), {params})
            return res.data.data;
        } catch (e){
            console.error('Could not get anime info', e.message);
            return undefined;
        }
    }

    async getMedia(collection_id){
        const {session_id, version, connectivity_type} = this;
        let params = {
            session_id, version, connectivity_type, collection_id, include_clips:1,
            limit:5000, offset:0,
            fields:'media.media_id,media.available,media.available_time,media.collection_id,media.collection_name,media.series_id,media.type,media.episode_number,media.name,media.description,media.screenshot_image,media.created,media.duration,media.playhead,media.bif_url'
        }
        try{
            let res = await axios.get(getCrunchyRollApiUrl(CRUNCHYROLL_API_URLS.LIST_MEDIA), {params});
            return res.data.data;
        } catch (e) {
            console.error('Could not get series', e.message);
            return undefined;
        }
    }

    async getSeries(){
        const {session_id, version, connectivity_type, fields, locale} = this;
        let params = {
            session_id, version, connectivity_type, fields, locale:locale(),
            media_type:'anime', limit:50, offset:0, filter:'updated'
        }
        try{
            let res = await axios.get(getCrunchyRollApiUrl(CRUNCHYROLL_API_URLS.LIST_SERIES), {params});
            return res.data.data;
        } catch (e) {
            console.error('Could not get series', e.message);
            return undefined;
        }
    }

}

function getCrunchyRollApiUrl(route, version = 0) {
    return `https://api.crunchyroll.com/${route}.${version}.json`;
}

const CRUNCHYROLL_LOCAL_STORAGE = {
    SESSION:'crunchyroll_session',
    SESSION_EXPIRY:'crunchyroll_session_expiry',
    DEVICE_ID:'crunchy_roll_device_id',
    AUTH_TOKEN:'auth',
    AUTH_EXPIRY:'auth_expiry'
}

const CRUNCHYROLL_API_URLS = {
    LOGIN: 'login',
    START_SESSION: 'start_session',
    AUTOCOMPLETE: 'autocomplete',
    LIST_SERIES:'list_series',
    ANIME_INFO:'info',
    LIST_MEDIA:'list_media'
}