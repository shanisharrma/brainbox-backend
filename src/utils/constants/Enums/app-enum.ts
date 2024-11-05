export enum EApplicationEnvironment {
    PRODUCTION = 'production',
    DEVELOPMENT = 'development',
}

export enum EApplicationEvent {
    APPLICATION_STARTED = 'APPLICATION_STARTED',
    APPLICATION_ERROR = 'APPLICATION_ERROR',
    CONTROLLER_ERROR_RESPONSE = `CONTROLLER_ERROR_RESPONSE`,
    CONTROLLER_SUCCESS_RESPONSE = `CONTROLLER_SUCCESS_RESPONSE`,
    CONTROLLER_RESPONSE = `CONTROLLER_RESPONSE`,
    SERVER_CLOSE_ERROR = `SERVER_CLOSE_ERROR`,
    UNHANDLED_PROMISE_REJECTION = `UNHANDLED_PROMISE_REJECTION`,
    UNCAUGHT_EXCEPTION = `UNCAUGHT_EXCEPTION`,
    DATABASE_CONNECTED = `DATABASE_CONNECTED`,
    RATE_LIMITER_INITIATED = `RATE_LIMITER_INITIATED`,
    EMAIL_SERVICE_ERROR = `EMAIL_SERVICE_ERROR`,
}
