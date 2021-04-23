
export interface IError {
    message: string;
    statusCode: number;
    errorType: string;
}

export interface IJWTToken {
    "sub": string;
    "iss": string;
    "custom:id": string;
    "phone_number_verified": boolean;
    "cognito:username": string;
    "aud": string;
    "event_id": string;
    "token_use": string;
    "auth_time": number;
    "phone_number": string;
    "exp": number;
    "custom:role": string;
    "custom:device_id": string;
    "iat": number;
}