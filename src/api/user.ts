import { userBusinessException } from "../exceptions/business-exceptions/user.business.exception";
import { NotFoundException } from "../exceptions/not-found.exception";
import { UserService } from "../service/user.service";
import { Extensions } from "../utils/extensions";
import { Logger } from "../utils/logger.utils";

class UserApi {
    static create(event, context) {
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
                const response = await UserService.create(event.body.userData);
                Logger.info('Resolving promise from <UsersApi.create>', response);
                resolve(response);
            } catch (error) {
                Logger.error(error);
                Logger.info('Rejecting promise from <UsersApi.create>');
                reject(error);
            }
        });
    }

    static getAllUsers(event) {
        return new Promise(async (resolve, reject) => {
            try {
                Logger.info(`Entering <UsersApi.getAllUsers> with ${event.query}`);
                const page = event.query.page ? +event.query.page : 0;
                const limit = event.query.size ? +event.query.size : 10;
                const offset = page * limit;
                const key = event.query.key;
                const result = await UserService.getAllUsers(limit, offset, key);
                Logger.info(`Resolving promise from <UsersApi.getAllUsers> with ${result}`);
                resolve(result);
            } catch (error) {
                Logger.error(error);
                Logger.info('Rejecting promise from <UsersApi.getAllUsers>');
                reject(error);
            }
        });
    }

    static getUserById(event) {
        return new Promise(async (resolve, reject) => {
            try {
                Logger.info(`Entering <UsersApi.getUserById> with ${event}`);

                if (!event.path && ! event.path.userId) {
                    throw new NotFoundException('Missing userId in event path params');
                }
                
                const userDetail = await UserService.getUserById(event.path.userId);

                Logger.info(`Resolving promise from <UsersApi.getUserById> with ${userDetail}`);
                resolve(userDetail);
            } catch (error) {
                Logger.error(error);
                Logger.info('Rejecting promise from <UsersApi.getUserById>');
                reject(error);
            }
        });
    }
}

export const create = UserApi.create;
export const getAllUsers = UserApi.getAllUsers;
export const getUserById = UserApi.getUserById;