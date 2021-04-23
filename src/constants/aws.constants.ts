export const SESSION_VARIABLES = {
    SEQUELIZE: 'SEQUELIZE',
    USER: 'USER'
}

import ENVUtils from "../utils/env.utils"

import { ENV_CONSTANTS } from "./env.constants";

export const AWS_CONFIG = {
  region: ENVUtils.getEnv('REGION')
}

export const COGNITO_CONFIG = {
  userPoolId: ENVUtils.getEnv(ENV_CONSTANTS.COGNITO_CONFIG.USER_POOLID),
  clientId: ENVUtils.getEnv(ENV_CONSTANTS.COGNITO_CONFIG.CLIENT_ID),
  IdentityId: ENVUtils.getEnv(ENV_CONSTANTS.COGNITO_CONFIG.IDENTITY_ID),
  region: 'us-east-1'
}

export const COGNITO_USER_POOL_ENDPOINT = `cognito-idp.${COGNITO_CONFIG.region}.amazonaws.com/${COGNITO_CONFIG.userPoolId}`
export const COGNITO_ENDPOINT = `cognito-idp.${COGNITO_CONFIG.region}.amazonaws.com/${COGNITO_CONFIG.userPoolId}`