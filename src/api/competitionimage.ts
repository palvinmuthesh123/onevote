import { API_ROUTES } from "../constants/apiConstants";
import { IEvents, ICompetitionResponse } from "../models/institutions";
import { IUpdateProfile } from "../models/profile";
import { HttpClient } from "../services/http-service";

const httpService = new HttpClient(API_ROUTES.COMPETITIONS);

export async function competitionImage(params: {}): Promise<ICompetitionResponse>{
    try {
        console.log(params.data.id)
        const response = await httpService.postAuthFormdatas('submitCompetition/'+params.data.id, params);
        console.log("response ", response)
        return Promise.resolve(response)
    } catch(e){
        console.log("validateMobileNumber error ", e)
        return Promise.reject(e);
    }
}