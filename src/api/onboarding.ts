import { API_ROUTES } from "../constants/apiConstants";
import { IBannerResponse } from "../models/institutions";
import { HttpClient } from "../services/http-service";

const httpService = new HttpClient(API_ROUTES.LANDING_PAGE);

export async function getOnBoarding(): Promise<IBannerResponse>{
    try {
        const response = await httpService.get(`getLandingPages`,{});
        console.log("response ", response)
        return Promise.resolve(response)
    }catch(e){
        console.log("validateMobileNumber error ", e)
        return Promise.reject(e);
    }
    
}