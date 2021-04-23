export const MESSAGE = {
    MISSING_PARAM: (param: string) => { return `${param} is missing.` },
    USER: {
        USER_ALREADY_EXISTS: 'User already exists.',
        USER_NOT_FOUND: 'User does not exist. Please sign up',
        USER_NOT_EXIST: 'User does not exist',
        PASSWORD_ALREADY_SET: 'Your password has been already set. Please Login to continue.',
        NOT_ALLOWED: 'You are not allowed to access the platform. Kindly contact your administrator.',
        INCORRECT_PASSWORD: 'Incorrect phone number or password.',
        SESSION_EXPIRED: 'Session expired.',
        CREATE_FAILED: 'Signup failed. Please try again later.',
        PROFILE_CREATE_FAILED: 'User Profile create failed. Please try again later.',
        NO_SUCH_CONFIG: 'No such configuration for the user',
    },
    S3: {
        CONTENT_TYPE_NOT_FOUND: 'Content Type Not found'
    },
    SESSION: {
        LOGIN_SUCCESSFUL: 'Login Successful',
        NEW_PASSWORD_REQUIRED: 'New password is required'
    }
}