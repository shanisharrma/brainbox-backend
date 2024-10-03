export default {
    SUCCESS: `The operation has been successful.`, //200
    SOMETHING_WENT_WRONG: `Something went wrong. Please try again later.`, //500
    TOO_MANY_REQUESTS: `Too many request! Please try again later.`, //429
    REGISTRATION_SUCCESS: `Registration successful. Please verify your email to activate your account.`, //201
    INVALID_PHONE_NUMBER: `Invalid phone number.`, //422
    EMAIL_ALREADY_IN_USE: `Email already in use.`, //400
    ACCOUNT_VERIFIED: `Account successfully verified.`, //200
    INVALID_VERIFICATION_CODE_TOKEN: `Invalid verification code or token.`, //400
    ACCOUNT_ALREADY_VERIFIED: `Account already verified.`, //400
    EXPIRED_CONFIRMATION_URL: `Account verification url expired. Please request another.`, //400

    NOT_FOUND: (entity: string) => `${entity} not found!`, //404
};
