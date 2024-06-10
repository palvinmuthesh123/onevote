import { API_ROUTES } from "../constants/apiConstants";
import { INearByInstitutions, INearByInstitutionsResponse } from "../models/institutions";
import { HttpClient } from "../services/http-service";

const httpService = new HttpClient(API_ROUTES.USERS);

export async function getNearByInstitutions(params: INearByInstitutions): Promise<INearByInstitutionsResponse>{
    try {
        const response = await httpService.get(`getInstitutionByLocation?lat=${params.lat}&long=${params.long}`,{});
        // console.log("response getInstitutionByLocation", response)
        return Promise.resolve(response)
    } catch(e){
        console.log("validateMobileNumber error ", e)
        return Promise.reject(e);
    }
}