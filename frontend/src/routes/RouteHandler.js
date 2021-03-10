import history from "./history";

export default class RouteHandler {

    static redirect(route){
        history.push(route);
    }

    static base(){
        return `${RouteIDs.BASE}/`
    }

    static login(){
        return `${RouteIDs.BASE}/${RouteIDs.LOGIN}`;
    }

    static seriesByParam(){
        return `${RouteIDs.BASE}/${RouteIDs.WATCH}/:seriesId`
    }
    static seriesById(seriesId){
        return `${RouteIDs.BASE}/${RouteIDs.WATCH}/${seriesId}`
    }
    static series(){
        return `${RouteIDs.BASE}/${RouteIDs.WATCH}/:seriesId`
    }

    static watchByParam(){
        return `${this.seriesByParam()}/:seriesMediaId`
    }
    static watchById(seriesId, seriesMediaId){
        return `${this.seriesById(seriesId)}/${seriesMediaId}`
    }
    static watch(seriesId){
        return `${this.seriesById(seriesId)}/:seriesMediaId`
    }


}

export const RouteIDs = {
    BASE:'',
    LOGIN:'login',
    WATCH:'watch'
}