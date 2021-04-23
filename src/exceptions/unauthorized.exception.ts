import { IError } from "../interfaces/common.interface";
import { BaseError } from "./base.exception";

export class UnAutorisedException extends BaseError {
  constructor(err: string) {
    const error: IError = {
      message: err,
      statusCode: 403,
      errorType: 'UnAutorisedException'
    }
    super(error);
  }
}