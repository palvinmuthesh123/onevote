export interface INearByInstitutions{
    lat:string,
    long: string
}

export interface INearByInstitutionsResponse{
    success:boolean,
    data: IInstitution[]
}

export interface IEventsResponse{
    success:boolean,
    data: IEvents[]
}

export interface ICompetitionResponse{
    success:boolean,
    data: {}
}

export interface IProfileResponse{
    success:boolean,
    data: {
        _id:string,
        blocked:boolean,
        countryCode:string,
        mobile: string,
        profilePic: string,
        __v: number
        address: string,
        blockReason: string,
        email: string,
        gender: string,
        institution: {
            location: {
                type: string,
                coordinates: [
                    number,
                    number
                ]
            },
            image: string,
            _id: string,
            name: string,
            images: [],
            contactNo: string,
            email: string,
            address: string,
            website: string,
            bio: string,
            createdBy: string,
            agents: []
        },
        name: string,
        password: string,
        agent: {
            _id: string,
            name: string,
            email: string,
            password: string,
            contactNo: string,
            institution: string,
            image: string,
            blocked: false,
            blockReason: string,
            bio: string,
            __v: number
        }
    }
}

export interface IBannerResponse{
    data: IBanner[]
}

export interface IInstitution{
    location: {
        type:string,
        coordinates: string[]
    },
    _id:string,
    name:string,
    images:string[],
    contactNo: string,
    email: string,
    address:string,
    website:string,
    bio:string,
    agents: IAgent
}

export interface IEvents{
    completedUsers: string[],
    _id:string,
    title:string,
    description:string,
    startDate: string,
    endDate: string,
    startTime:string,
    endTime:string,
    eventType:string,
    competition: {},
    subscribedUsers: [],
    __v: number
}

export interface IProfiles{
    completedUsers: string[],
    _id:string,
    blocked:boolean,
    countryCode:string,
    mobile: string,
    profilePic: string,
    __v: number
}

export interface IBanner{
    _id:string,
    title:string,
    images:string[],
    description: string,
    __v: number
}

export interface IAgent{
    _id:string,
    name:string,
    email:string,
    contactNo:string,
    blocked:boolean,
    blockReason: string,
    bio: string,
    image: string
}
