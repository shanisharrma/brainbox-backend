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
    ACCOUNT_NOT_VERIFIED: `"Email not verified. Please verify your email to access all features."`, //403
    EXPIRED_CONFIRMATION_URL: `Account verification url expired. Please request another.`, //400
    LOGIN_SUCCESS: `Login successful.`, //200
    INVALID_CREDENTIALS: `Invalid credentials.`, //401
    PROFILE_SUCCESS: `Profile retrieved successfully.`, //200
    AUTHORIZATION_TOKEN_MISSING: `Authorization token doesn't exists`, //401
    AUTHORIZATION_TOKEN_EXPIRED: `Authorization token expired.`, //401
    INVALID_AUTHORIZATION_TOKEN: `Invalid authorization token.`, //401
    AUTHORIZATION_REQUIRED: `Authentication required.`, //401
    VERIFICATION_LINK_SENT: `Verification link sent to your email.`, //200
    LOGOUT_SUCCESS: `Logout successful.`, //200
    NOT_LOGGED_IN: `You are not logged in.`, //401
    TOKEN_REFRESH_SUCCESS: `Token refreshed successfully.`, //200
    SESSION_EXPIRED: `Session expired. Please log in again.`, //401
    FORGOT_PASSWORD_SENT_SUCCESS: `Password reset instructions sent to your email.`, //200
    RESET_PASSWORD_TOKEN_MISSING: `Reset password token missing`, //400
    RESET_PASSWORD_SUCCESS: `Password reset successful.`, //200
    EXPIRED_RESET_PASSWORD_URL: `Reset password link has expired. Please request a new one.`, //400
    RESET_PASSWORD_URL_USED: `Reset password url already used. Please request new one.`, //400

    NOT_FOUND: (entity: string) => `${entity} not found!`, //404
};
