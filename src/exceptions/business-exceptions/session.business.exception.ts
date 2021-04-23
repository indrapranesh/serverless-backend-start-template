import { BusinessException } from '../business.exception';

class BusinessExceptionMissingPhoneNumber extends BusinessException {
    constructor(err: string = "") {
        super(err);
    }
}

class BusinessExceptionMissingPassword extends BusinessException {
    constructor(err: string = "") {
        super(err);
    }
}

class BusinessExceptionMissingUserName extends BusinessException {
    constructor(err: string = "") {
        super(err);
    }
}

class BusinessExceptionMissingRefreshToken extends BusinessException {
    constructor(err: string = "") {
        super(err);
    }
}

class BusinessExceptionMissingCognitoUserName extends BusinessException {
    constructor(err: string = "") {
        super(err);
    }
}

class BusinessExceptionMissingVerficationCode extends BusinessException {
    constructor(err: string = "") {
        super(err);
    }
}

class BusinessExceptionMissingOTP extends BusinessException {
    constructor(err: string = "") {
        super(err);
    }
}

class BusinessExceptionMissingDeviceId extends BusinessException {
    constructor(err: string = "") {
        super(err);
    }
}

class BusinessExceptionUserExist extends BusinessException {
    constructor(err: string = "") {
        super(err);
    }
}

class BusinessExceptionInvalidOTP extends BusinessException {
    constructor(err: string = "") {
        super(err);
    }
}

class BusinessExceptionMissingEmail extends BusinessException {
    constructor(err: string = "") {
        super(err);
    }
}
export const SessionBusinessException = {
    BusinessExceptionMissingPhoneNumber,
    BusinessExceptionMissingPassword,
    BusinessExceptionMissingEmail,
    BusinessExceptionMissingUserName,
    BusinessExceptionMissingRefreshToken,
    BusinessExceptionMissingCognitoUserName,
    BusinessExceptionMissingVerficationCode,
    BusinessExceptionMissingOTP,
    BusinessExceptionMissingDeviceId,
    BusinessExceptionUserExist,
    BusinessExceptionInvalidOTP
};
