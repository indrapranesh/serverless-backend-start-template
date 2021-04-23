import { User } from "../models/user.model";

export interface ICongnitoTriggerReq {
    version: number,
    triggerSource: string,
    region: string,
    userPoolId: string,
    userName: string,
    callerContext: {
        awsSdkVersion: string,
        clientId: string
    },
    request: {
        userAttributes: {
            'custom:lastName': string,
            'custom:id': string;
            'cognito:username': string;
            'custom:firstName': string;
        },
        codeParameter: string;
        session: any[];
    },
    response: {
        smsMessage?: string,
        emailMessage?: string,
        emailSubject?: string
    }
}

export interface ISignupReq {
    phoneNumber: string;
    email: string;
    firstName: string;
    lastName: string;
    userName: string
    cognitoUserName: string;
    password: string;
    code: string;
    isFirstLogin: boolean;
}

export interface ILoginReq {
    email: string;
    password: string;
}

export interface IVerifyReq {
    cognitoUserName: string,
    otp: string,
    params: any,
    deviceId: string
}

export interface IVerifyOTPResponse {
    ChallengeParameters?: any;
    AuthenticationResult?: {
        AccessToken?: string,
        IdToken?: string,
        RefreshToken?: string,
        ExpiresIn?: number,
        TokenType?: string
    }
}

export interface ILoginRes {
    session: { accessToken: string, idToken: string, refreshToken: string, user?: User }
}

export interface IRefreshSessionReq {
    cognitoUserName: string;
    refreshToken: string;
}

export interface IConfirmPassword {
    userName: string;
    password: string;
    confirmationCode: string;
}