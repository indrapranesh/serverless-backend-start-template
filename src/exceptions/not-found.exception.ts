import { BaseError } from "./base.exception";
import { IError } from "../interfaces/common.interface";

export class NotFoundException extends BaseError {
  constructor(err: string) {
    const error: IError = {
      message: err,
      statusCode: 404,
      errorType: 'NotFoundExceptioon'
    }
    super(error);
  }
}