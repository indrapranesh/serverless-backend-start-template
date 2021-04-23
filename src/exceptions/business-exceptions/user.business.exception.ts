import { BusinessException } from '../business.exception';

class BusinessExceptionUserDataEmpty extends BusinessException {
    constructor(err: string = "") {
        super(err);
    }
}

class BusinessExceptionInvalidUserData extends BusinessException {
    constructor(err: string = "") {
        super(err);
    }
}

class BusinessExceptionInvalidUserName extends BusinessException {
    constructor(err: string = "") {
        super(err);
    }
}

class BusinessExceptionEmptyUserId extends BusinessException {
    constructor(err: string = "") {
        super(err);
    }
}

class BusinessExceptionInvalidUserId extends BusinessException {
    constructor(err: string = "") {
        super(err);
    }
}

class BusinessExceptionEmptyTransportMode extends BusinessException {
    constructor(err: string = "") {
        super(err);
    }
}

class BusinessExceptionEmptyBaselocation extends BusinessException {
    constructor(err: string = "") {
        super(err);
    }
}

class BusinessExceptionEmptyUserName extends BusinessException {
    constructor(err: string = "") {
        super(err);
    }
}

class BusinessExceptionEmptyMarkerId extends BusinessException {
    constructor(err: string = "") {
        super(err);
    }
}

class BusinessExceptionRealmDataEmpty extends BusinessException {
    constructor(err: string = "") {
        super(err);
    }
}
 
export const userBusinessException = {
    BusinessExceptionUserDataEmpty,
    BusinessExceptionInvalidUserData,
    BusinessExceptionInvalidUserName,
    BusinessExceptionEmptyUserId,
    BusinessExceptionInvalidUserId,
    BusinessExceptionEmptyTransportMode,
    BusinessExceptionEmptyBaselocation,
    BusinessExceptionEmptyUserName,
    BusinessExceptionEmptyMarkerId,
    BusinessExceptionRealmDataEmpty
};
