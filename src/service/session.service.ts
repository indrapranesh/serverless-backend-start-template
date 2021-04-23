import { ResponseObject } from "../models/response.model";
import { Cognito } from "../integrations/cognito.integrations";
import { IConfirmPassword, ILoginReq, ILoginRes, IRefreshSessionReq, ISignupReq } from "../interfaces/request.interface";
import { Logger } from "../utils/logger.utils";
import * as uuid from "uuid";
import { MESSAGE } from "../constants/error.constants";
import { SessionBusinessException } from "../exceptions/business-exceptions/session.business.exception";
import { getTransaction } from "../utils/db.utilts";
import { User } from "../models/user.model";
import { NotFoundException } from "../exceptions/not-found.exception";
import { DbConfig } from "../config/db.config";
import { Extensions } from "../utils/extensions";

export class SessionService {
    static login(req: ILoginReq) {
        return new Promise<ResponseObject>(async (resolve, reject) => {
            try {
                await DbConfig.connect();
                Logger.info(`Entering into <SessionService.login> with ${JSON.stringify(req)}`);
                const user = await User.findOne({
                    where: { email: req.email }
                });
                if (!user) {
                    Logger.debug(`User with email ${req.email} is not found`);
                    throw new NotFoundException(MESSAGE.USER.USER_NOT_FOUND);
                }
                if (user.isFirstLogin) {

                }
                Logger.debug(`Got non null response from DB for email ${req.email} ---- ${JSON.stringify(user)}`);
                const session: any = await Cognito.login(user.cognitoUserName, req.password);
                let response;
                let message = '';
                if(session && session.idToken) {
                    response = {
                        session: {
                            idToken: session.idToken.jwtToken,
                            accessToken: session.accessToken.jwtToken,
                            refreshToken: session.refreshToken.token,
                            user: user
                        }
                    };
                    message = MESSAGE.SESSION.LOGIN_SUCCESSFUL;
                } else if(session && session.newPasswordRequired) {
                    response = {
                        session: {
                            newPasswordRequired: true,
                            user: user
                        }
                    }
                    message = MESSAGE.SESSION.NEW_PASSWORD_REQUIRED;
                }  
                resolve(new ResponseObject(200, message, response, null));
            } catch (error) {
                Logger.error('Rejecting from <SessionService.login>');
                Logger.error(error);
                reject(error);
            } finally {
                DbConfig.closeConnection();
            }
        });
    }

    public static async signUp(user: ISignupReq): Promise<ResponseObject> {
        return new Promise(async (resolve, reject) => {
            await DbConfig.connect();
            const trans = await getTransaction();
            try {
                Logger.info(`Entering <UserService.create> with ${JSON.stringify({ user: user })}`);
                const users = await User.count({
                    where: {
                        email: user.email
                    }
                });
                if(users > 0) {
                    Logger.debug(`User with email ${user.email} already exists`);
                    throw new SessionBusinessException.BusinessExceptionUserExist(MESSAGE.USER.USER_ALREADY_EXISTS);
                }
                const signupReq: ISignupReq = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    userName: user.userName,
                    phoneNumber: user.phoneNumber,
                    password: Extensions.generatePassword(),
                    cognitoUserName: `${user.firstName.replace(/\s/g, '').toLowerCase().slice(0, 3)}${Date.now()}${uuid.v4()}`,
                    code: '',
                    isFirstLogin: true
                } 
                await Cognito.addUser(signupReq);
                let result = await User.create(signupReq, {transaction: trans});
                resolve(new ResponseObject(200, "User created successfully", result, null));
            } catch (error) {
                Logger.error(error);
                Logger.info('Rejecting promise of <UserService.create>');
                reject(error);
            } finally {
                DbConfig.closeConnection();
            }
        })
    }

    public static changePassword(req) {
        return new Promise(async (resolve, reject) => {
            await DbConfig.connect();
            const trans = await getTransaction();
            try {
                Logger.info(`Entering into <SessionService.changePassword>`);
                const user: User = await User.findOne({
                    where: { email: req.email },
                });
                if (!user) {
                    throw new NotFoundException(MESSAGE.USER.USER_NOT_FOUND);
                }
                const result = await Cognito.setPassword(user.cognitoUserName, req.password);
                const updateUserStatus = await User.update(
                    {
                        isFirstLogin: false
                    },
                    {
                        where: { email: req.email },
                        transaction: trans
                    }
                );
                Logger.info('Resolving from <SessionService.changePassword>');
                await trans.commit();
                resolve({
                    result, updateUserStatus, status: true,
                    message: "Your password has been created sucessfully"
                });
            } catch (error) {
                await trans.rollback();
                Logger.error('Rejecting from <SessionService.changePassword>');
                Logger.error(error);
                reject(error);
            } finally {
                DbConfig.closeConnection();
            }
        });
    }

    static verifyUser(req: ISignupReq) {
        return new Promise(async (resolve, reject) => {
            try {
                Logger.info(`Entering into <SessionService.verifyUser> with ${JSON.stringify(req)}`);
                const result = await Cognito.verifyUser(req);
                resolve(result);
            } catch (error) {
                Logger.error('Rejecting from <SessionService.verifyUser>');
                Logger.error(error);
                reject(error);
            }
        });
    }

    static refreshSession(req: IRefreshSessionReq) {
        return new Promise<ILoginRes>(async (resolve, reject) => {
            try {
                await DbConfig.connect();
                Logger.info(`Entering into <SessionService.signup> with ${JSON.stringify(req)}`);
                const user = await User.findOne({
                    where: { cognitoUserName: req.cognitoUserName }
                });
                if (!user) {
                    Logger.debug(`User with user name ${req.cognitoUserName} is not found`);
                    throw new NotFoundException(MESSAGE.USER.USER_NOT_FOUND);
                }
                Logger.debug(`Got non null response from DB for phone number ${req.cognitoUserName} ---- ${JSON.stringify(user)}`);
                const session: ILoginRes = await Cognito.refreshSession(user.cognitoUserName, req.refreshToken);
                session.session.user = user;
                resolve(session);
            } catch (error) {
                Logger.error('Rejecting from <SessionService.login>');
                Logger.error(error);
                reject(error);
            } finally {
                DbConfig.closeConnection();
            }
        });
    }

    static forgetPassword(data) {
        return new Promise(async(resolve, reject) => {
            try {
                await DbConfig.connect();
                Logger.info(`Entering into <SessionService.forgetPassword> with ${JSON.stringify(data)}`);
                const user = await User.findOne({
                    where: { email: data.email }
                });
                if (!user) {
                    Logger.debug(`User with email ${data.email} is not found`);
                    throw new NotFoundException(MESSAGE.USER.USER_NOT_FOUND);
                }
                let resetPassword = await Cognito.forgetPassword(user.cognitoUserName);
                resolve(resetPassword)
            } catch (error) {
                Logger.error('Rejecting from <SessionService.forgetPassword>');
                Logger.error(error);
                reject(error);
            } finally {
                DbConfig.closeConnection();
            }
        })
    }

    static confirmForgotPassword(data) {
        return new Promise(async(resolve, reject) => {
            try {
                await DbConfig.connect();
                Logger.info(`Entering into <SessionService.forgetPassword> with ${JSON.stringify(data)}`);
                const user = await User.findOne({
                    where: { email: data.email }
                });
                if (!user) {
                    Logger.debug(`User with email ${data.email} is not found`);
                    throw new NotFoundException(MESSAGE.USER.USER_NOT_FOUND);
                }
                let confirmPassword: IConfirmPassword = {
                    userName: user.cognitoUserName,
                    confirmationCode: data.code.toString(),
                    password: data.password
                }
                let code = await Cognito.confirmForgotPassword(confirmPassword);
                resolve(code);
            } catch (error) {
                Logger.error('Rejecting from <SessionService.forgetPassword>');
                Logger.error(error);
                reject(error);
            } finally {
                DbConfig.closeConnection();
            }
        })
    }

}