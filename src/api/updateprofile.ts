import { API_ROUTES } from "../constants/apiConstants";
import { IEvents, IProfileResponse } from "../models/institutions";
import { IUpdateProfile } from "../models/profile";
import { HttpClient } from "../services/http-service";

const httpService = new HttpClient(API_ROUTES.USERS);

export async function updateProfile(params: {}): Promise<IProfileResponse>{
    try {
        const response = await httpService.postAuth('updateUserProfile', params);
        console.log("response ", response)
        return Promise.resolve(response)
    } catch(e){
        console.log("validateMobileNumber error ", e)
        return Promise.reject(e);
    }
}