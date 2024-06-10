import { API_ROUTES } from "../constants/apiConstants";
import { IEvents, IEventsResponse } from "../models/institutions";
import { HttpClient } from "../services/http-service";

const httpService = new HttpClient(API_ROUTES.EVENTS);

export async function getEvents(): Promise<IEventsResponse>{
    try {
        const response = await httpService.get(`GetEvents`,{});
        // console.log("response ", response)
        return Promise.resolve(response)
    }catch(e){
        console.log("validateMobileNumber error ", e)
        return Promise.reject(e);
    }
    
}