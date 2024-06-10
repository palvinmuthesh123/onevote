import { API_ROUTES } from "../constants/apiConstants";
import { INearByInstitutions, INearByInstitutionsResponse } from "../models/institutions";
import { IUserId } from "../models/organizations";
import { HttpClient } from "../services/http-service";

const httpService = new HttpClient(API_ROUTES.USERS);

export async function getOrganization(params: INearByInstitutions, uid: IUserId): Promise<INearByInstitutionsResponse>{
    try {
        const response = await httpService.get(`/${uid.id}/nearby-institutions`,params);
        console.log("response ", response)
        return Promise.resolve(response)
    }catch(e){
        console.log("validateMobileNumber error ", e)
        return Promise.reject(e);
    }
    
}