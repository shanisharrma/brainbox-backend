import { StatusCodes } from 'http-status-codes';
import { RoleRepository, UserRepository } from '../repositories';
import {
    IAccountConfirmationAttributes,
    IChangePasswordRequestBody,
    IForgotRequestBody,
    ILoginRequestBody,
    IRefreshTokenAttributes,
    IRegisterRequestBody,
    IResetPasswordAttributes,
    IUserAttributes,
    TUserWithAssociations,
} from '../types';
import { Enums, ResponseMessage } from '../utils/constants';
import { AppError } from '../utils/error';
import { Quicker } from '../utils/helper';
import PhoneNumberService from './phone-number-service';
import AccountConfirmationService from './account-confirmation-service';
import MailService from './mail-service';
import { ServerConfig } from '../config';
import { Logger } from '../utils/common';
import RefreshTokenService from './refresh-token-service';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import ResetPasswordService from './reset-password-service';

interface IDecryptedJWT {
    userId: number;
}

interface IProfileResponse {
    user: TUserWithAssociations;
    warning?: string;
}

class UserService {
    private userRepository: UserRepository;
    private roleRepository: RoleRepository;
    private phoneNumberService: PhoneNumberService;
    private accountConfirmationService: AccountConfirmationService;
    private mailService: MailService;
    private refreshTokenService: RefreshTokenService;
    private resetPasswordService: ResetPasswordService;

    constructor() {
        this.userRepository = new UserRepository();
        this.roleRepository = new RoleRepository();
        this.phoneNumberService = new PhoneNumberService();
        this.accountConfirmationService = new AccountConfirmationService();
        this.mailService = new MailService();
        this.refreshTokenService = new RefreshTokenService();
        this.resetPasswordService = new ResetPasswordService();
    }

    public async registerUser(data: IRegisterRequestBody) {
        try {
            // * destructure data;
            const { consent, email, firstName, lastName, password, phoneNumber, role } = data;

            // * Parsing the phone number
            const { countryCode, internationalNumber, isoCode } = Quicker.parsePhoneNumber('+' + phoneNumber);

            // ----> check if any key is empty
            if (!countryCode || !isoCode || !internationalNumber) {
                throw new AppError(ResponseMessage.INVALID_PHONE_NUMBER, StatusCodes.UNPROCESSABLE_ENTITY);
            }

            // * get timezone from phone number iso code
            const timezone = Quicker.getCountryTimezone(isoCode);

            // * check timezone exists or not
            if (!timezone || timezone.length === 0) {
                throw new AppError(ResponseMessage.INVALID_PHONE_NUMBER, StatusCodes.UNPROCESSABLE_ENTITY);
            }

            // * check if user already exists
            const isUserExists = await this.userRepository.findByEmail(email);
            if (isUserExists) {
                throw new AppError(ResponseMessage.EMAIL_ALREADY_IN_USE, StatusCodes.BAD_REQUEST);
            }

            // * create new user
            const user = await this.userRepository.create({
                firstName,
                lastName,
                email,
                password,
                consent,
                timezone: timezone[0].name,
            });

            // * check if role exists ---> if yes then assign to new user, else ---> throw error
            const user_role = await this.roleRepository.findByRole(role);
            if (user_role) {
                user.addRole(user_role);
            } else {
                throw new AppError(ResponseMessage.NOT_FOUND('Role'), StatusCodes.NOT_FOUND);
            }

            // * create Phone number entry
            const newPhoneNumber = await this.phoneNumberService.create({
                isoCode,
                internationalNumber,
                countryCode,
                userId: user.id,
            });

            // * create OTP and random token for account verification
            const code = Quicker.generateRandomOTP(6);
            const token = Quicker.generateRandomTokenId();
            const expiresAt = Quicker.generateAccountConfirmationExpiry(10);

            const accountConfirmation = await this.accountConfirmationService.create({
                code,
                token,
                userId: user.id,
                status: false,
                expiresAt,
            });

            // create mail payload
            const confirmationUrl = `${ServerConfig.FRONTEND_URL}/account-confirmation/${token}?code=${code}`;
            const to = [user.email];
            const subject = `Account Verification`;
            const text = `Hey ${user.firstName + ' ' + user.lastName}, Please click the below link to verify you email for the account creation at Learnovous.\n\nThe confirmation email valid for 10 minutes only.\n\n\n${confirmationUrl}`;

            // * send email
            await this.mailService.sendEmail(to, subject, text).catch((error) => {
                Logger.error(Enums.EApplicationEvent.EMAIL_SERVICE_ERROR, {
                    meta: error,
                });
            });

            // * return the complete user
            const userDetails: IUserAttributes = {
                ...user,
                accountConfirmation,
                phoneNumber: newPhoneNumber,
            };

            return userDetails;
        } catch (error) {
            if (error instanceof AppError) throw error;

            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async confirmation(data: { token: string; code: string }) {
        try {
            // * destructure data
            const { token, code } = data;
            // * find the account confirmation details based on token and code
            const accountConfirmationDetails = await this.accountConfirmationService.findWithUser(token, code);
            // * check user exist with given userId in account confirmation details
            if (!accountConfirmationDetails || !accountConfirmationDetails.user) {
                throw new AppError(ResponseMessage.INVALID_VERIFICATION_CODE_TOKEN, StatusCodes.BAD_REQUEST);
            }
            // * check is User Already verified?
            if (accountConfirmationDetails.status === true) {
                throw new AppError(ResponseMessage.ACCOUNT_ALREADY_VERIFIED, StatusCodes.BAD_REQUEST);
            }
            // * check confirmation url expired
            const expiresAt = accountConfirmationDetails.expiresAt;
            const currentTimestamp = Quicker.getCurrentTimeStamp();
            if (expiresAt < currentTimestamp) {
                // * delete the current account confirmation details
                await this.accountConfirmationService.delete(accountConfirmationDetails.id!);
                throw new AppError(ResponseMessage.EXPIRED_CONFIRMATION_URL, StatusCodes.BAD_REQUEST);
            }
            // * verify the account
            const verifiedAt = Quicker.getCurrentDateAndTime();
            const accountVerified = await this.accountConfirmationService.update(accountConfirmationDetails.id!, {
                status: true,
                verifiedAt,
            });

            // * create email body
            const to = [accountConfirmationDetails.user.email];
            const subject = `Account Verified Successfully`;
            const text = `Hey ${accountConfirmationDetails.user.firstName}, Your account ahs been successfully verified.`;

            // * send verified account email
            await this.mailService.sendEmail(to, subject, text).catch((error) => {
                Logger.error(Enums.EApplicationEvent.EMAIL_SERVICE_ERROR, {
                    meta: error,
                });
            });

            return accountVerified;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async login(data: ILoginRequestBody) {
        try {
            // * destructure data
            const { email, password } = data;

            // * check if user exists with this email
            const user = await this.userRepository.findByEmailWithPassword(email);
            if (!user) {
                throw new AppError(ResponseMessage.INVALID_CREDENTIALS, StatusCodes.UNAUTHORIZED);
            }

            // * check isPasswordMatched
            const isPasswordMatched = await Quicker.comparePassword(password, user.password);
            if (!isPasswordMatched) {
                throw new AppError(ResponseMessage.INVALID_CREDENTIALS, StatusCodes.UNAUTHORIZED);
            }

            // * create accessToken and refreshToken
            const accessToken = Quicker.generateToken(
                { userId: user.id },
                ServerConfig.ACCESS_TOKEN.SECRET as string,
                ServerConfig.ACCESS_TOKEN.EXPIRY,
            );
            const refreshToken = Quicker.generateToken(
                { userId: user.id },
                ServerConfig.REFRESH_TOKEN.SECRET as string,
                ServerConfig.REFRESH_TOKEN.EXPIRY,
            );

            // * update last login information
            const lastLoginAt = Quicker.getCurrentDateAndTime();
            await this.userRepository.update(user.id, { lastLoginAt });

            // * create payload for refreshToken record
            const refreshTokenPayload: IRefreshTokenAttributes = {
                token: refreshToken,
                userId: user.id,
                expiresAt: Quicker.generateRefreshTokenExpiry(ServerConfig.REFRESH_TOKEN.EXPIRY),
                revoked: false,
            };

            // * store refreshToken in DB
            const rftDetails = await this.refreshTokenService.findByUserId(user.id);
            if (rftDetails && rftDetails.token) {
                await this.refreshTokenService.update(rftDetails.id, refreshTokenPayload);
            } else {
                await this.refreshTokenService.create(refreshTokenPayload);
            }
            // * return accessToken and refreshToken
            return { accessToken, refreshToken };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async profile(id: number) {
        try {
            const userWithAssociations = await this.userRepository.getWithAssociationsById(id);

            if (
                !userWithAssociations ||
                !userWithAssociations.accountConfirmation ||
                userWithAssociations.accountConfirmation.status === false
            ) {
                const profileResponse: IProfileResponse = {
                    user: userWithAssociations!,
                    warning: ResponseMessage.ACCOUNT_NOT_VERIFIED,
                };
                return profileResponse;
            }

            return userWithAssociations;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async isAuthenticated(token: string) {
        try {
            if (!token) {
                throw new AppError(ResponseMessage.AUTHORIZATION_TOKEN_MISSING, StatusCodes.UNAUTHORIZED);
            }

            const { userId } = Quicker.verifyToken(token, ServerConfig.ACCESS_TOKEN.SECRET as string) as IDecryptedJWT;

            // check if user exists with userId
            const user = await this.userRepository.getOneById(userId);
            if (!user) {
                throw new AppError(ResponseMessage.AUTHORIZATION_REQUIRED, StatusCodes.UNAUTHORIZED);
            }
            return user.id;
        } catch (error) {
            if (error instanceof AppError) throw error;
            if (error instanceof JsonWebTokenError) {
                if (error instanceof TokenExpiredError) {
                    throw new AppError(ResponseMessage.AUTHORIZATION_TOKEN_EXPIRED, StatusCodes.UNAUTHORIZED);
                }
                throw new AppError(ResponseMessage.INVALID_AUTHORIZATION_TOKEN, StatusCodes.UNAUTHORIZED);
            }
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async requestConfirmation(id: number) {
        try {
            // * get the user using the received id
            const userWithAssociations = await this.userRepository.getWithAssociationsById(id);

            // * check uer exists
            if (!userWithAssociations) {
                throw new AppError(ResponseMessage.AUTHORIZATION_REQUIRED, StatusCodes.UNAUTHORIZED);
            }

            // * check account verified
            if (
                userWithAssociations &&
                userWithAssociations.accountConfirmation &&
                userWithAssociations.accountConfirmation.status === true
            ) {
                throw new AppError(ResponseMessage.ACCOUNT_ALREADY_VERIFIED, StatusCodes.BAD_REQUEST);
            }

            // * prepare payload
            const accountConfirmationPayload: IAccountConfirmationAttributes = {
                code: Quicker.generateRandomOTP(6),
                token: Quicker.generateRandomTokenId(),
                expiresAt: Quicker.generateAccountConfirmationExpiry(10),
                status: false,
                userId: userWithAssociations.id!,
            };

            // * create new account confirmation in db
            const accountConfirmationDetails = await this.accountConfirmationService.create(accountConfirmationPayload);

            // * prepare email payload
            const confirmationUrl = `${ServerConfig.FRONTEND_URL}/${accountConfirmationDetails.token}?code=${accountConfirmationDetails.code}`;
            const to = [userWithAssociations.email];
            const subject = `Account Verification`;
            const text = `Hey ${userWithAssociations.firstName + ' ' + userWithAssociations.lastName}, Please click the below link to verify you email for the account creation at Learnovous.\n\nThe confirmation email valid for 10 minutes only.\n\n\n${confirmationUrl}`;

            // * send new verification link
            await this.mailService.sendEmail(to, subject, text).catch((error) => {
                Logger.error(Enums.EApplicationEvent.EMAIL_SERVICE_ERROR, { meta: error });
            });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async logout(token: string) {
        try {
            // * check token exists
            if (!token) {
                throw new AppError(ResponseMessage.AUTHORIZATION_TOKEN_MISSING, StatusCodes.UNAUTHORIZED);
            }

            // * delete token from database
            await this.refreshTokenService.deleteByToken(token);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async refreshToken(token: string) {
        try {
            // * check domain exists
            if (!token) {
                throw new AppError(ResponseMessage.NOT_FOUND('Refresh Token'), StatusCodes.NOT_FOUND);
            }

            // * find refresh token details with token
            const rftDetails = await this.refreshTokenService.findByToken(token);

            // * check details exists
            if (!rftDetails) {
                throw new AppError(ResponseMessage.SESSION_EXPIRED, StatusCodes.UNAUTHORIZED);
            }

            // * check expiry date of refresh token
            const currentTimestamp = Quicker.getCurrentTimeStamp();
            if (rftDetails.expiresAt < currentTimestamp) {
                await this.refreshTokenService.deleteByToken(token);
                throw new AppError(ResponseMessage.SESSION_EXPIRED, StatusCodes.UNAUTHORIZED);
            }

            // * get payload of refresh token
            const { userId } = rftDetails;

            // * generate new access token with payload
            const accessToken = Quicker.generateToken(
                { userId: userId },
                ServerConfig.ACCESS_TOKEN.SECRET as string,
                ServerConfig.ACCESS_TOKEN.EXPIRY,
            );

            // * return access token
            return accessToken;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async forgotPassword(data: IForgotRequestBody) {
        try {
            // * get email from data
            const { email } = data;

            // * check user exists with this email
            const user = await this.userRepository.getWithAccountConfirmationAndResetPasswordByEmail(email);
            if (!user) {
                throw new AppError(ResponseMessage.INVALID_CREDENTIALS, StatusCodes.BAD_REQUEST);
            }

            // * check if user is verified or not
            if (user.accountConfirmation && user.accountConfirmation.status === false) {
                throw new AppError(ResponseMessage.ACCOUNT_NOT_VERIFIED, StatusCodes.FORBIDDEN);
            }

            // * generate forgot password payload
            const token = Quicker.generateRandomTokenId();
            const expiresAt = Quicker.generateResetPasswordExpiry(15);

            // * check if user has already applied for forgot password
            if (user.resetPassword && (user.resetPassword.used || user.resetPassword.token)) {
                // * update the existing record
                await this.resetPasswordService.update(user.resetPassword.id!, { token, expiresAt });
            } else {
                // * create new record
                await this.resetPasswordService.create({ token, expiresAt, userId: user.id! });
            }

            // * create mail payload
            const resetPasswordURL = `${ServerConfig.FRONTEND_URL}/reset-password/${token}`;
            const to = [user.email];
            const subject = `Account Password Reset Requested`;
            const text = `Hey ${user.firstName + ' ' + user.lastName}, Please reset your account password by clicking on the line below.\n\n${resetPasswordURL}\n\nLink will expire within 15 minutes.`;

            await this.mailService.sendEmail(to, subject, text).catch((error) => {
                Logger.error(Enums.EApplicationEvent.EMAIL_SERVICE_ERROR, { meta: error });
            });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async resetPassword(token: string, password: string) {
        try {
            // * fetch reset password details by token with user
            const resetPasswordDetails = await this.resetPasswordService.findWithUserByToken(token);
            if (!resetPasswordDetails || (resetPasswordDetails && !resetPasswordDetails.user)) {
                throw new AppError(ResponseMessage.NOT_FOUND('User'), StatusCodes.NOT_FOUND);
            }

            // * check if user is already verified
            const accountConfirmation = await this.accountConfirmationService.getByUserId(resetPasswordDetails.userId);
            if (accountConfirmation && accountConfirmation.status === false) {
                throw new AppError(ResponseMessage.ACCOUNT_NOT_VERIFIED, StatusCodes.FORBIDDEN);
            }

            // * check if url is expired or not
            const currentTimestamp = Quicker.getCurrentTimeStamp();
            if (currentTimestamp > resetPasswordDetails.expiresAt) {
                await this.resetPasswordService.delete(resetPasswordDetails.id);
                throw new AppError(ResponseMessage.EXPIRED_RESET_PASSWORD_URL, StatusCodes.BAD_REQUEST);
            }

            // * hash new password
            const hashedPassword = await Quicker.hashPassword(password);

            // * Update user with new password
            await this.userRepository.update(resetPasswordDetails.userId, { password: hashedPassword });

            // * update the reset password record
            const updateResetPassword: Partial<IResetPasswordAttributes> = {
                expiresAt: 0,
                token: '',
                used: true,
                lastResetAt: Quicker.getCurrentDateAndTime(),
            };
            await this.resetPasswordService.update(resetPasswordDetails.id, updateResetPassword);

            // * prepare email body
            const to = [resetPasswordDetails.user!.email];
            const subject = `Password Reset Successfully.`;
            const text = `Hey ${resetPasswordDetails.user!.firstName + ' ' + resetPasswordDetails.user!.firstName}, your password has been reset successfully. Please try login with new password.`;

            // * send email
            await this.mailService.sendEmail(to, subject, text);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async changePassword(id: number, data: IChangePasswordRequestBody) {
        try {
            // * destructure data
            const { oldPassword, newPassword } = data;

            // * check user with given id
            const userWithPassword = await this.userRepository.getWithPasswordById(id);
            if (!userWithPassword) {
                throw new AppError(ResponseMessage.NOT_FOUND('User'), StatusCodes.NOT_FOUND);
            }

            // * check oldPassword matched with stored password
            const isPasswordMatched = await Quicker.comparePassword(oldPassword, userWithPassword.password);
            if (!isPasswordMatched) {
                throw new AppError(ResponseMessage.INCORRECT_CURRENT_PASSWORD, StatusCodes.BAD_REQUEST);
            }

            // * check newPassword and oldPassword are same
            if (oldPassword === newPassword) {
                throw new AppError(ResponseMessage.SIMILAR_CURRENT_PASSWORD_AND_NEW_PASSWORD, StatusCodes.BAD_REQUEST);
            }

            // * hash newPassword
            const hashedPassword = await Quicker.hashPassword(newPassword);

            // * update user with new password
            await this.userRepository.update(userWithPassword.id, { password: hashedPassword });

            // * prepare email body
            const to = [userWithPassword.email];
            const subject = `Password changed successfully.`;
            const text = `Hey ${userWithPassword.firstName + ' ' + userWithPassword.lastName}, your password has been changed successfully.`;

            // * send email
            await this.mailService.sendEmail(to, subject, text);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default UserService;
