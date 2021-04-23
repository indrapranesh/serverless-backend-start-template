import { Logger } from '../utils/logger.utils';

export default class ENVUtils {
    public static getEnv(key: string): string {
        const result = process.env[key];
        Logger.debug('Fetching environment vaeriable ' + key + '= ' + result);
        return result;
    }
}