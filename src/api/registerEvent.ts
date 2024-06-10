import { API_ROUTES } from "../constants/apiConstants";
import { HttpClient } from "../services/http-service";

const httpService = new HttpClient(API_ROUTES.EVENTS);

export async function registerEvents(params: {}): Promise<any>{
    try {
        const data = {
            userId: params.data.uid
        }
        console.log(data);
        const response = await httpService.postAuth(`subscribeToEvent/${params.data.id}`, data);
        console.log("response ", response)
        return Promise.resolve(response)
    } catch(e){
        console.log("validateMobileNumber error ", e)
        return Promise.reject(e);
    }
}