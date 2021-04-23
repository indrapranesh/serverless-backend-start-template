import { QueryTypes } from "sequelize";
import { DbConfig } from "../config/db.config";
import { Cognito } from "../integrations/cognito.integrations";
import { ISignupReq } from "../interfaces/request.interface";
import { UserData } from "../interfaces/user.interface";
import { ResponseObject } from "../models/response.model";
import { User, UserAddress } from "../models/user.model";
import { getSequelize, getTransaction } from "../utils/db.utilts";
import { Extensions } from "../utils/extensions";
import { Logger } from "../utils/logger.utils";

export class UserService {
    public static create(user: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            await DbConfig.connect();
            const trans = await getTransaction();
            try {
                Logger.info(`Entering <UserService.create> with ${JSON.stringify({ user: user })}`);
                let userParams: UserData = user;
                const userExist = await User.count({
                    where: {
                        email: userParams.email
                    }
                });
                if (userExist > 0) {
                    Logger.info('User already exist');
                    resolve(new ResponseObject(400, "User already Exists", null, null));
                } else {
                    Logger.info(`User doesn't exist. Creating new user`);
                    const signupReq: ISignupReq = {
                        firstName: userParams.firstName,
                        lastName: userParams.lastName,
                        userName: userParams.userName,
                        email: userParams.email,
                        phoneNumber: userParams.phoneNumber,
                        password: Extensions.generatePassword(),
                        cognitoUserName: userParams.email,
                        code: '',
                        isFirstLogin: true
                    }
                    const cognitoUserName = await Cognito.addUser(signupReq, true);
                    userParams.cognitoUserName = cognitoUserName;
                    userParams.isFirstLogin = true;
                    let user = await User.create(userParams, {
                        transaction: trans
                    });
                    await trans.commit();
                    resolve(new ResponseObject(200, "User created successfully", user, null));
                }
            } catch (error) {
                Logger.error('Rejecting from <UserService.create>');
                Logger.error(error);
                await trans.rollback()
                reject(error);
            } finally {
                DbConfig.closeConnection();
            }
        })
    }

    public static getAllUsers(limit: number, offset: number, key: string) {
        return new Promise(async (resolve, reject) => {
            try {
                await DbConfig.connect();
                Logger.info('Entering <UserService.getAllUsers>');
                let result: any;
                if (key && key.length != 0) {
                    Logger.debug("Search user with key: ", key);
                    key = '%' + key + '%';
                    const sequelize = getSequelize();
                    const users = sequelize.query(
                        `SELECT id, firstName, lastName, email, phoneNumber, isDeleted, isFirstLogin FROM User WHERE CONCAT_WS('', firstName, lastName, userName) LIKE '${key}'`,
                        { type: QueryTypes.SELECT }
                    )
                    resolve(users);
                } else {
                    result = await User.findAndCountAll({
                        attributes: [
                            'id', 'firstName', 'lastName', 'email', 'phoneNumber', 'isDeleted', 'isFirstLogin'
                        ],
                        include: [
                            {
                                model: UserAddress,
                            }
                        ],
                        where: {
                            isDeleted: false
                        },
                        offset: offset,
                        limit: limit
                    });
                    resolve(result);
                }
            } catch (err) {
                Logger.error(err);
                Logger.info('Error Resolving Query');
                Logger.info('Rejecting promise of <UserService.getAllUsers>');
                reject(err);
            } finally {
                DbConfig.closeConnection();
            }
        })
    }

    public static getUserById(userId: number) {
        return new Promise(async (resolve, reject) => {
            try {
                await DbConfig.connect();
                Logger.info(`Entering <UserService.getUserById> with ${userId}`);

                const result = await User.findOne({
                    attributes: [
                        'id', 'firstName', 'lastName', 'userName', 'email', 'phoneNumber', 'isFirstLogin'
                    ],
                    include: [
                        {
                            model: UserAddress,
                        }
                    ],
                    where: {
                        id: userId
                    }
                });

                Logger.info(`Resolving <UserService.getUserById> with ${JSON.stringify(result)}`);
                resolve(result);
            } catch (err) {
                Logger.error(err);
                Logger.info('Error Resolving Query');
                Logger.info('Rejecting promise of <UserService.getUserById>');
                reject(err);
            } finally {
                DbConfig.closeConnection();
            }
        })
    }
}