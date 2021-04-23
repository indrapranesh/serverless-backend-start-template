import { IError } from "../interfaces/common.interface";

export class BaseError extends Error {

    constructor(error: IError) {
        super(`${error.message}`);
    }

}