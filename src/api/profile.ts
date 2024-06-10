import { API_ROUTES } from "../constants/apiConstants";
import { IEvents, IProfileResponse } from "../models/institutions";
import { HttpClient } from "../services/http-service";

const httpService = new HttpClient(API_ROUTES.USERS);

export async function getMe(): Promise<IProfileResponse>{
    try {
        const response = await httpService.get(`getMe`,{});
        console.log("response ", response)
        return Promise.resolve(response)
    }catch(e){
        console.log("validateMobileNumber error ", e)
        return Promise.reject(e);
    }
}