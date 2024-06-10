import { API_ROUTES } from "../constants/apiConstants";
import { HttpClient } from "../services/http-service";

const httpService = new HttpClient(API_ROUTES.EVENTS);

export async function completeEvent(params: {}): Promise<any>{
    try {
        const response = await httpService.postAuth(`complteToEvent/${params.data.id}`, {});
        console.log("response ", response)
        return Promise.resolve(response)
    } catch(e){
        console.log("validateMobileNumber error ", e)
        return Promise.reject(e);
    }
}