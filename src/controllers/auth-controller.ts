import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/error';
import { HttpError, HttpResponse } from '../utils/common';
import { StatusCodes } from 'http-status-codes';
import { Enums, ResponseMessage } from '../utils/constants';
import {
    IChangePasswordRequestBody,
    IForgotRequestBody,
    ILoginRequestBody,
    IRegisterRequestBody,
    IResetPasswordRequestBody,
    IVerificationRequestBody,
} from '../types';
import { UserService } from '../services';
import { ServerConfig } from '../config';
import { Quicker } from '../utils/helper';

interface IRegisterRequest extends Request {
    body: IRegisterRequestBody;
}

interface IConfirmRequest extends Request {
    params: {
        token: string;
    };
    body: IVerificationRequestBody;
}

interface ILoginRequest extends Request {
    body: ILoginRequestBody;
}
interface ILogoutRequest extends Request {
    id: number;
}

interface IRequestConfirmationRequest extends Request {
    id: number;
}

interface IForgotRequest extends Request {
    body: IForgotRequestBody;
}

interface IResetPasswordRequest extends Request {
    body: IResetPasswordRequestBody;
    params: {
        token: string;
    };
}

interface IChangePasswordRequest extends Request {
    body: IChangePasswordRequestBody;
    id: number;
}

interface IDecodedJWT {
    userId: number;
}

class AuthController {
    private static userService: UserService = new UserService();

    public static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { body } = req as IRegisterRequest;

            // call the user register service
            const response = await AuthController.userService.registerUser(body);

            const responseData = {
                id: response.id,
                accountConfirmation: {
                    token: response.accountConfirmation?.token,
                    status: response.accountConfirmation?.status,
                },
            };

            HttpResponse(req, res, StatusCodes.CREATED, ResponseMessage.REGISTRATION_SUCCESS, responseData);
        } catch (error) {
            HttpError(
                next,
                error,
                req,
                error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public static async confirmation(req: Request, res: Response, next: NextFunction) {
        try {
            const { params, body } = req as IConfirmRequest;
            const { token } = params;
            const { code } = body;

            await AuthController.userService.confirmation({
                token,
                code,
            });

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.ACCOUNT_VERIFIED);
        } catch (error) {
            HttpError(
                next,
                error,
                req,
                error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { body } = req as ILoginRequest;
            const { email, password } = body;

            const response = await AuthController.userService.login({
                email,
                password,
            });

            // get domain
            const DOMAIN = Quicker.getDomainFromUrl(ServerConfig.FRONTEND_URL as string);

            // * destructure access token and refresh token
            const { accessToken, refreshToken } = response;

            // * store tokens in the cookies
            res.cookie('accessToken', accessToken, {
                path: '/api/v1',
                domain: DOMAIN,
                sameSite: 'strict',
                maxAge: 1000 * ServerConfig.ACCESS_TOKEN.EXPIRY,
                httpOnly: true,
                secure: !(ServerConfig.ENV === Enums.EApplicationEnvironment.DEVELOPMENT),
            }).cookie('refreshToken', refreshToken, {
                path: '/api/v1',
                domain: DOMAIN,
                sameSite: 'strict',
                maxAge: 1000 * ServerConfig.REFRESH_TOKEN.EXPIRY,
                httpOnly: true,
                secure: !(ServerConfig.ENV === Enums.EApplicationEnvironment.DEVELOPMENT),
            });

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.LOGIN_SUCCESS, { accessToken });
        } catch (error) {
            HttpError(
                next,
                error,
                req,
                error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public static async requestConfirmation(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req as IRequestConfirmationRequest;
            const response = await AuthController.userService.requestConfirmation(id);
            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.VERIFICATION_LINK_SENT, response);
        } catch (error) {
            HttpError(
                next,
                error,
                req,
                error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public static async logout(req: Request, res: Response, next: NextFunction) {
        try {
            // * get cookies
            const { id } = req as ILogoutRequest;

            // * delete refresh token from DB
            await AuthController.userService.logout(id);

            // get domain
            const DOMAIN = Quicker.getDomainFromUrl(ServerConfig.FRONTEND_URL as string);

            // * clear cookies
            res.clearCookie('accessToken', {
                path: '/api/v1',
                domain: DOMAIN,
                sameSite: 'strict',
                httpOnly: true,
                secure: !(ServerConfig.ENV === Enums.EApplicationEnvironment.DEVELOPMENT),
            }).clearCookie('refreshToken', {
                path: '/api/v1',
                domain: DOMAIN,
                sameSite: 'strict',
                httpOnly: true,
                secure: !(ServerConfig.ENV === Enums.EApplicationEnvironment.DEVELOPMENT),
            });
            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.LOGOUT_SUCCESS, StatusCodes.OK);
        } catch (error) {
            HttpError(
                next,
                error,
                req,
                error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public static async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const { headers } = req;
            const oldAccessToken = headers.authorization!.replace('Bearer ', '');

            // * decode the oldAccessToken
            const { userId } = Quicker.decodeJWT(oldAccessToken) as IDecodedJWT;

            // * generate access token from refresh token
            const accessToken = await AuthController.userService.refreshToken(userId);

            // * generate domain url path
            const DOMAIN = Quicker.getDomainFromUrl(ServerConfig.FRONTEND_URL as string);

            res.cookie('accessToken', accessToken, {
                path: '/api/v1',
                domain: DOMAIN,
                sameSite: 'strict',
                maxAge: 1000 * ServerConfig.ACCESS_TOKEN.EXPIRY,
                httpOnly: true,
                secure: !(ServerConfig.ENV === Enums.EApplicationEnvironment.DEVELOPMENT),
            });

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.TOKEN_REFRESH_SUCCESS, { accessToken });
        } catch (error) {
            HttpError(
                next,
                error,
                req,
                error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public static async forgotPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { body } = req as IForgotRequest;

            await AuthController.userService.forgotPassword(body);
            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.FORGOT_PASSWORD_SENT_SUCCESS);
        } catch (error) {
            HttpError(
                next,
                error,
                req,
                error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public static async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            // * get params and body from req
            const { body, params } = req as IResetPasswordRequest;
            const { token } = params;
            const { password } = body;

            await AuthController.userService.resetPassword(token, password);

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.RESET_PASSWORD_SUCCESS);
        } catch (error) {
            HttpError(
                next,
                error,
                req,
                error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public static async changePassword(req: Request, res: Response, next: NextFunction) {
        try {
            // * get params and body from req
            const { body, id } = req as IChangePasswordRequest;

            await AuthController.userService.changePassword(id, body);

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.CHANGE_PASSWORD_SUCCESS);
        } catch (error) {
            HttpError(
                next,
                error,
                req,
                error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }
}

export default AuthController;
