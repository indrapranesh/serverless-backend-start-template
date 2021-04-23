import { Logger } from "../utils/logger.utils";

export namespace Session {
    let SESSION = {};
    export function setValue(key: string, value: any) {
        Logger.debug('Entering <setValue>');
        SESSION[key] = value;
        Logger.debug('returning <setValue>');
        return SESSION;
    }
    export function getSession() {
        return SESSION;
    }
    export function getValue<T>(key: string): T {
        return SESSION[key];
    }
    export function clear() {
        SESSION = {};
    }
}