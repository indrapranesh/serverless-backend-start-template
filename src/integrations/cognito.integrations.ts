import { Logger } from "../utils/logger.utils";
import * as AWS from 'aws-sdk';
import { COGNITO_ENDPOINT, COGNITO_CONFIG } from "../constants/aws.constants";
import { IConfirmPassword, ILoginRes, ISignupReq, IVerifyOTPResponse } from "../interfaces/request.interface";
import { IntegrationException } from "../exceptions/integrations.exception";
import {
  CognitoUserPool, CognitoUser, CognitoRefreshToken, AuthenticationDetails
} from 'amazon-cognito-identity-js-with-node-fetch';
import { UnAutorisedException } from "../exceptions/unauthorized.exception";
export class Cognito {
  static getCognitoIdentityServiceProvider(): AWS.CognitoIdentityServiceProvider {
    try {
      Logger.debug(`generating cognitoServiceProvider with endpoint ${COGNITO_ENDPOINT}`)
      const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18', region: COGNITO_CONFIG.region });
      return cognitoidentityserviceprovider;
    } catch (error) {
      throw new IntegrationException(error)
    }

  }

  static addUser(user: ISignupReq, isAdded: boolean = false): Promise<string> {
    Logger.debug(`Adding user to cognito.`)
    return new Promise((resolve, reject) => {
      Logger.info(`Entering into <addUser> with ${JSON.stringify(user)}`)
      const cognitoidentityserviceprovider = this.getCognitoIdentityServiceProvider()
      try {
        // const id = Extensions.getRandomUUID();
        var params = {
          ClientId: COGNITO_CONFIG.clientId, /* required */
          Password: user.password, /* required */
          Username: user.cognitoUserName, /* required */
          UserAttributes: [
            {
              Name: 'phone_number',
              Value: user.phoneNumber
            },
            {
              Name: 'email',
              Value: `${user.email}`
            },
            {
              Name: 'email_verified', 
              Value: 'true'
            },
            {
              Name: 'phone_number_verified',
              Value: 'true'
            }
          ],
          TemporaryPassword: user.password
        };
        var addedUser = {
          UserPoolId: COGNITO_CONFIG.userPoolId,
          Username: user.cognitoUserName,
          UserAttributes: [
            {
              Name: 'phone_number',
              Value: user.phoneNumber
            },
            {
              Name: 'email',
              Value: `${user.email}`
            },
            {
              Name: 'email_verified', 
              Value: 'true'
            },
            {
              Name: 'phone_number_verified',
              Value: 'true'
            }
          ],
          DesiredDeliveryMediums: ['EMAIL'],
          TemporaryPassword: user.password
        }
        if (!isAdded) {
          cognitoidentityserviceprovider.signUp(params, function (err, data) {
            if (err) {
              throw err;
            }
            else {
              Logger.debug(`Response from cognito for adding use ${data}`);
              Logger.info('Resolving promise from <addUser>')
              resolve(user.cognitoUserName);
            }
          });

          const signedUpUser = this.getCognitoUser(user.cognitoUserName)
          signedUpUser.setUserMfaPreference({ PreferredMfa: true, Enabled: true }, null, (err, result) => {
            Logger.debug(`${err}`);
            Logger.debug(`Enable MFA Preference ---- ${JSON.stringify(result)}`)
          })
        } else {
          Logger.debug('Admin Create User');
          cognitoidentityserviceprovider.adminCreateUser(addedUser, (err, data) => {
            if (err) {
              reject(new IntegrationException(err.message));
            } else {
              Logger.debug(`Response from cognito for adding use ${data}`);
              Logger.info('Resolving promise from <addUser>');
              // if (user.role == 'Volunteer' || user.role == 'User') {
              //   Cognito.setPassword(user.cognitoUserName, user.password)
              // }
              resolve(user.cognitoUserName);
            }
          });
          cognitoidentityserviceprovider.adminUpdateUserAttributes
        }
      } catch (error) {
        Logger.error(error);
        Logger.info('Rejecting promise from <addUser>')
        reject(new IntegrationException(error.message));
      }
    });
  }

  static deleteUser(userName) {
    return new Promise((resolve, reject) => {
      const cognitoidentityserviceprovider = this.getCognitoIdentityServiceProvider();
      try {
        var params = {
          Username: userName,
          UserPoolId: COGNITO_CONFIG.userPoolId,
        };
        cognitoidentityserviceprovider.adminDeleteUser(params, (err, data) => {
          if (err) {
            reject(new IntegrationException(err.message));
          } else {
            Logger.debug(`Response from cognito for deleting user ${data}`);
            Logger.info('Resolving promise from <deleteUser>');
            resolve(userName);
          }
        })
      } catch (error) {
        Logger.error(error);
        Logger.info('Rejecting promise from <deleteUser>')
        reject(new IntegrationException(error.message));
      }
    })
  }

  static updateUserRole(role: string, userName: string) {
    return new Promise((resolve, reject) => {
      Logger.info(`Entering into <updateUserRole> with ${role} ${userName}`)
      const cognitoidentityserviceprovider = this.getCognitoIdentityServiceProvider();
      try {
        let params = {
          UserAttributes: [ 
            {
              Name: 'custom:role',
              Value: `${role}`
            },
         ],
         Username: userName,
         UserPoolId: COGNITO_CONFIG.userPoolId
        };
        cognitoidentityserviceprovider.adminUpdateUserAttributes(params, (err, data) => {
          if (err) {
            reject(new IntegrationException(err.message));
          } else {
            Logger.debug(`Response from cognito for updating role ${data}`);
            Logger.info('Resolving promise from <updateUserRole>')
            resolve(role);
          }
        })
      } catch (error) {
        Logger.error(error);
        Logger.info('Rejecting promise from <updateUserRole>')
        reject(new IntegrationException(error.message));
      }
    })
  }

  static setPassword(username: string, newPassword: string) {
    return new Promise((resolve, reject) => {
      Logger.info('----Entering into <setPassword>----');
      const cognitoidentityserviceprovider = this.getCognitoIdentityServiceProvider();
      cognitoidentityserviceprovider.adminSetUserPassword({
        UserPoolId: COGNITO_CONFIG.userPoolId,
        Username: username,
        Password: newPassword,
        Permanent: true
      }, (err, data) => {
        if (err) {
          Logger.info('Rejecting promise from <setPassword>');
          reject(err);
        } else {
          Logger.info('Resolving promise from <setPassword>');
          resolve(data);
        }
      });
    });
  }

  private static getCognitoUser(userName: string) {
    const userPool = this.getUserPool();
    const cognitoUser = new CognitoUser({
      Username: userName,
      Pool: userPool,
    });
    return cognitoUser;
  }

  private static getUserPool() {
    const userPool = new CognitoUserPool({
      UserPoolId: COGNITO_CONFIG.userPoolId,
      ClientId: COGNITO_CONFIG.clientId,
    });
    return userPool;
  }

  static verifyUser(params: ISignupReq) {
    return new Promise(async (resolve, reject) => {
      try {
        Logger.info('Entering into <Cognito.verifyUser>')
        const cognitoidentityserviceprovider = this.getCognitoIdentityServiceProvider()
        var req = {
          ClientId: COGNITO_CONFIG.clientId, /* required */
          ConfirmationCode: params.code, /* required */
          Username: params.cognitoUserName, /* required */
        };
        cognitoidentityserviceprovider.confirmSignUp(req, function (err, data) {
          if (err) {
            Logger.error('Rejecting promise from <Cognito.verifyUser>')
            Logger.debug(err, err.stack);
            reject(new IntegrationException(err.message));
          } // an error occurred
          else {
            Logger.debug(data);
            Logger.info('Resolving promise from <Cognito.verifyUser>')
            resolve(data)
          } // successful response
        });
      } catch (err) {
        Logger.error(err, err.stack);
        Logger.error('Rejecting promise from <Cognito.verifyUser>')
        reject(new IntegrationException(err.message));
      }
    })
  }

  static verifyLoginOtp(params: any, otp: string) {
    return new Promise<IVerifyOTPResponse>((resolve, reject) => {
      try {
        Logger.debug(`Entering into <Cognito.verifyLoginOtp> with params ${JSON.stringify({ params: params, otp: otp })}`)
        const challengeResponses = params
        challengeResponses.UserPoolId = COGNITO_CONFIG.userPoolId
        challengeResponses.ClientId = COGNITO_CONFIG.clientId
        const cognitoServiceProvider = this.getCognitoIdentityServiceProvider()
        cognitoServiceProvider.adminRespondToAuthChallenge(challengeResponses, (err, data) => {
          Logger.debug(`adminRespondToAuthChallenge error ---- ${err}`)
          Logger.debug(`adminRespondToAuthChallenge data ---- ${data}`)
          if (err) {
            reject(new UnAutorisedException(err.message))
          } else if (data) {
            const result: IVerifyOTPResponse = data
            resolve(result)
          }
        })
      } catch (err) {
        Logger.debug(`Rejecting from <Cognito.verifyLoginOtp> with error ${JSON.stringify(err)}`)
        Logger.error(err);
        reject(err);
      }
    })
  }

  static login(userName: string, password: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const authenticationDetails = new AuthenticationDetails({
          Username: userName,
          Password: password,
        });
        Logger.info(authenticationDetails)
        const cognitoUser = this.getCognitoUser(userName);
        let auth = await this.authenticate(authenticationDetails, cognitoUser, password);
        Logger.debug(`auth ${auth}`);
        Logger.debug('login function');
        resolve(auth)
      } catch (error) {
        Logger.error(error);
        reject(new IntegrationException(error.message));
      }
    });
  }

  static authenticate(authenticationDetails, cognitoUser: CognitoUser, password) {
    return new Promise ( (resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (session, userConfirmationNecessary) => {
          Logger.debug(`User login is successful at Cognito ---- ${JSON.stringify({ session: session, userConfirmationNecessary: userConfirmationNecessary })}`)
          resolve(session)
        },
        onFailure: (err) => {
          Logger.debug(`User login failed at Cognito ---- ${JSON.stringify(err)}`)
          reject(err)
        },
        newPasswordRequired: function (userAttributes) {
          Logger.debug(userAttributes, password);
          resolve({
            newPasswordRequired: true
          });
        }
      });
    })
  }

  public static forgetPassword(userName: string) {
    return new Promise((resolve, reject) => {
      const cognitoUser = this.getCognitoUser(userName);
      cognitoUser.forgotPassword({
        onSuccess: (result) => resolve(result),
        onFailure: (err) => {
          Logger.error(err);
          reject(new IntegrationException(err.message));
        }
      });
    });
  }

  static refreshSession(userName: string, refreshToken: string) {
    return new Promise<ILoginRes>((resolve, reject) => {
      const cognitoUser = this.getCognitoUser(userName);
      try {
        cognitoUser.refreshSession(new CognitoRefreshToken({ RefreshToken: refreshToken }),
          (err, session) => {
            if (!err) {
              const result: ILoginRes = {
                session: {
                  idToken: session.getIdToken().getJwtToken(),
                  accessToken: session.getAccessToken().getJwtToken(),
                  refreshToken: session.getRefreshToken().getToken(),
                }
              }
              resolve(result);
            } else {
              reject(err)
            }
          }
        )
      } catch (err) {
        Logger.error(err);
        reject(err);
      }
    })
  }

  static confirmForgotPassword(requestBody: IConfirmPassword) {
    Logger.info('Entering into <CognitoIntegrations.confirmForgotPassword>');
    return new Promise((resolve, reject) => {
        const params = {
            ClientId: COGNITO_CONFIG.clientId,
            ConfirmationCode: requestBody.confirmationCode,
            Password: requestBody.password,
            Username: requestBody.userName
        };
        const cognitoidentityserviceprovider = this.getCognitoIdentityServiceProvider();
        cognitoidentityserviceprovider.confirmForgotPassword(params, (error, data) => {
            if (error) {
                Logger.info('Rejecting promise from <CognitoIntegrations.confirmForgotPassword>');
                reject(error);
            } else {
                Logger.info('Resolving promise from <CognitoIntegrations.confirmForgotPassword>');
                resolve(data);
            }
        });
    });
}
}