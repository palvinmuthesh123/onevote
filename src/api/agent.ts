import { API_ROUTES } from "../constants/apiConstants";
import { INearByInstitutions, INearByInstitutionsResponse } from "../models/institutions";
import { HttpClient } from "../services/http-service";

const httpService = new HttpClient(API_ROUTES.AGENTS);

export async function getAgent(params: INearByInstitutions): Promise<INearByInstitutionsResponse>{
    try {
        const response = await httpService.get(`getAgents`,params);
        console.log("response ", response)
        return Promise.resolve(response)
    }catch(e){
        console.log("validateMobileNumber error ", e)
        return Promise.reject(e);
    }
    
}