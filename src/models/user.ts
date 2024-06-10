export interface IValidateMobileNumber{
    countryCode:string;
    mobile: string
}

export interface IValidateMobileNumberResponse{
    success:string;
    token: string;
    userExists: string;
}