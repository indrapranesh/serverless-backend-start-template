import { Logger } from "./logger.utils";
import * as uuid from 'uuid';

export class Extensions {
  public static isEmpty(obj: any): boolean {
    return obj !== null && Object.keys(obj).length === 0
  }

  public static isUndefined(obj: any): boolean {
    Logger.debug("type", typeof (obj));
    return typeof (obj) == "undefined"
  }

  static getRandomUUID(): string {
    Logger.debug('Generating random uuid');
    const result = uuid.v4();
    Logger.debug(`Generated random uuid is ${result}`);
    return result;
  }

  public static generatePassword(): string {
    Logger.info('Entering into <generatePassword>')
    Logger.debug(`Genrating random password of length`);
    let text = "";
    const possibleText = "abcdefghijklmnopqrstuvwxyz";
    const possibleNumber = "0123456789";

    for (var i = 0; i < 4; i++) {
      if (i == 0) {
        text += possibleText.charAt(Math.floor(Math.random() * possibleText.length)).toUpperCase();
      }
      text += possibleText.charAt(Math.floor(Math.random() * possibleText.length));
    }

    text += '@';

    for (var i = 0; i < 3; i++)
      text += possibleNumber.charAt(Math.floor(Math.random() * possibleNumber.length));

    Logger.debug(`Random string ${text}`);
    Logger.info('returning from <generatePassword>')
    return text;
  }

  public static validateUsername(name: string) {
    //Check if username is less than 50 characters and no special characters
    var regex = /^([a-zA-Z\d\-_\s]+)$/;
    Logger.debug("test", regex.test(name));
    return regex.test(name) && name.length < 50;
  }

  public static validatePhoneNumber(phone: string) {
    //Check if Phone Number is validate
    var regex = /^(\+91)[789]\d{9}$/;
    Logger.debug("test", regex.test(phone));
    return regex.test(phone);
  }

  public static generateCognitoUserName(name: string) {
    return `${name.replace(/\s/g, '').toLowerCase().slice(0, 3)}${Date.now()}${uuid.v4()}`;
  }
}