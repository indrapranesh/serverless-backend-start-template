import { BaseError } from "./base.exception";
import { IError } from "../interfaces/common.interface";

export class BusinessException extends BaseError {
    constructor(err: string) {
        const error: IError = {
            message: err,
            statusCode: 400,
            errorType: 'BusinessException'
        };
        super(error);
    }
}
