import { API_ROUTES } from "../constants/apiConstants";
import { IValidateMobileNumber, IValidateMobileNumberResponse } from "../models/user";
import { HttpClient } from "../services/http-service";

const httpService = new HttpClient(API_ROUTES.USERS);

export async function validateMobileNumber(params: IValidateMobileNumber): Promise<IValidateMobileNumberResponse>{
    try {
        const response = await httpService.post('validateMobileNumber',params);
        console.log("response ", response)
        return Promise.resolve(response)
    }catch(e){
        console.log("validateMobileNumber error ", e)
        return Promise.reject(e);
    }
    
}



