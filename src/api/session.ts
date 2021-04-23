import { MESSAGE } from "../constants/error.constants";
import { SessionBusinessException } from "../exceptions/business-exceptions/session.business.exception";
import { userBusinessException } from "../exceptions/business-exceptions/user.business.exception";
import { BusinessException } from "../exceptions/business.exception";
import { ILoginReq, IRefreshSessionReq, ISignupReq } from "../interfaces/request.interface";
import { SessionService } from "../service/session.service";
import { Extensions } from "../utils/extensions";
import { Logger } from "../utils/logger.utils";

class SessionApi {
    public static login(event, context) {
        const body: ILoginReq = event.body;
        return new Promise(async (resolve, reject) => {
            Logger.info('Entering into <Session.login>');
            context.callbackWaitsForEmptyEventLoop = false;
            try {
                if (!body.email) {
                    throw new SessionBusinessException.BusinessExceptionMissingEmail(MESSAGE.MISSING_PARAM('Email'));
                }
                if (!body.password) {
                    throw new SessionBusinessException.BusinessExceptionMissingPassword(
                        MESSAGE.MISSING_PARAM('Password'));
                }
                const result = await SessionService.login(body);
                Logger.debug(`Resolving from SessionApi.login ---- ${JSON.stringify(result)}`)
                resolve(result);
            } catch (error) {
                Logger.error(error);
                reject(error);
            }
        });
    }

    static signUp(event, context) {
        return new Promise(async (resolve, reject) => {
            try {
                Logger.info('Entering <UsersApi.create>');
                context.callbackWaitsForEmptyEventLoop = false;
                Logger.info(event);
                if (Extensions.isEmpty(event.body)) {
                    throw new userBusinessException.BusinessExceptionEmptyUserId('User data cannot be empty');
                }
                if (Extensions.isUndefined(event.body.userData)) {
                    throw new userBusinessException.BusinessExceptionInvalidUserData('Invalid user data');
                }
                if (!Extensions.validateUsername(event.body.userData.firstName)) {
                    throw new userBusinessException.BusinessExceptionInvalidUserName('Invalid user name');
                }
                const response = await SessionService.signUp(event.body.userData);
                Logger.info('Resolving promise from <UsersApi.create>', response);
                resolve(response);
            } catch (error) {
                Logger.error(error);
                Logger.info('Rejecting promise from <UsersApi.create>');
                reject(error);
            }
        });
    }

    static changePassword(event, context) {
        return new Promise(async (resolve, reject) => {
            Logger.info('Entering into <Session.changePassword>');
            context.callbackWaitsForEmptyEventLoop = false;
            const body = event.body;
            try {
                if (!body.email) {
                    throw new BusinessException(MESSAGE.MISSING_PARAM('Email'))
                }
                if (!body.password) {
                    throw new BusinessException(MESSAGE.MISSING_PARAM('Password'))
                }
                const result = await SessionService.changePassword(body);
                resolve(result);
            } catch (error) {
                Logger.error(error);
                reject(error);
            }
        });
    }

    public static verifyUser(event, context) {
        return new Promise(async (resolve, reject) => {
            Logger.info('Entering into <Session.verifyUser>');
            context.callbackWaitsForEmptyEventLoop = false;
            try {
                const body: ISignupReq = event.body;
                if (!body.cognitoUserName) {
                    throw new SessionBusinessException.BusinessExceptionMissingCognitoUserName(
                        MESSAGE.MISSING_PARAM('Cognito User name'));
                }
                if (!body.code) {
                    throw new SessionBusinessException.BusinessExceptionMissingVerficationCode(
                        MESSAGE.MISSING_PARAM('Verification Code'));
                }
                const result = await SessionService.verifyUser(body);
                resolve(result);
            } catch (error) {
                Logger.error('Rejecting from <Session.verifyUser>');
                Logger.error(error);
                reject(error);
            }
        });
    }

    public static refreshSession(event) {
        const body: IRefreshSessionReq = event.body;
        return new Promise(async (resolve, reject) => {
            Logger.info('Entering into <Session.refreshSession>');
            try {
                if (!body.cognitoUserName) {
                    throw new SessionBusinessException.BusinessExceptionMissingCognitoUserName(
                        MESSAGE.MISSING_PARAM('Cognito User name')
                    );
                }
                if (!body.refreshToken) {
                    throw new SessionBusinessException.BusinessExceptionMissingRefreshToken(MESSAGE.MISSING_PARAM('Refresh Token'));
                }
                const result = await SessionService.refreshSession(body);
                resolve(result);
            } catch (error) {
                Logger.error(error);
                reject(error);
            }
        });
    }


    public static forgetPassword(event, context) {
        return new Promise(async (resolve, reject) => {
            Logger.info('Entering into <Session.forgetPassword>');
            context.callbackWaitsForEmptyEventLoop = false;
            try {
                const body = event.body;
                if (!body.email) {
                    throw new SessionBusinessException.BusinessExceptionMissingCognitoUserName(
                        MESSAGE.MISSING_PARAM('Email'));
                }
                const result = await SessionService.forgetPassword(body);
                resolve(result);
            } catch (error) {
                Logger.error('Rejecting from <Session.forgetPassword>');
                Logger.error(error);
                reject(error);
            }
        });
    }

    public static confirmForgotPassword(event, context) {
        return new Promise(async (resolve, reject) => {
            Logger.info('Entering into <Session.confirmForgotPassword>');
            context.callbackWaitsForEmptyEventLoop = false;
            try {
                const body = event.body;
                if (!body.code) {
                    throw new SessionBusinessException.BusinessExceptionMissingCognitoUserName(
                        MESSAGE.MISSING_PARAM('Code'));
                }
                const result = await SessionService.confirmForgotPassword(body);
                resolve(result);
            } catch (error) {
                Logger.error('Rejecting from <Session.confirmForgotPassword>');
                Logger.error(error);
                reject(error);
            }
        });
    }
}

export const login = SessionApi.login;
export const signUp = SessionApi.signUp;
export const changePassword = SessionApi.changePassword;
export const verifyUser = SessionApi.verifyUser;
export const refreshSession = SessionApi.refreshSession;
export const forgetPassword = SessionApi.forgetPassword;
export const confirmForgotPassword = SessionApi.confirmForgotPassword;