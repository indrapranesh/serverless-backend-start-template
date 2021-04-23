import { BaseError } from "./base.exception";
import { IError } from "../interfaces/common.interface";

export class IntegrationException extends BaseError {
  constructor(err: string) {
    const error: IError = {
      message: err,
      statusCode: 500,
      errorType: 'IntegrationException'
    }
    super(error);
  }
}