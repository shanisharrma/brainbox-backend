import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/error';
import { HttpError, HttpResponse } from '../utils/common';
import { StatusCodes } from 'http-status-codes';
import { Enums, ResponseMessage } from '../utils/constants';
import { IForgotRequestBody, ILoginRequestBody, IRegisterRequestBody } from '../types';
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
    query: {
        code: string;
    };
}

interface ILoginRequest extends Request {
    body: ILoginRequestBody;
}

interface IProfileRequest extends Request {
    id: number;
}

interface IForgotRequest extends Request {
    body: IForgotRequestBody;
}

interface IResetPasswordRequest extends Request {
    body: IRegisterRequestBody;
    params: {
        token: string;
    };
}

class AuthController {
    private static userService: UserService = new UserService();

    public static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { body } = req as IRegisterRequest;

            // call the user register service
            const response = await AuthController.userService.registerUser(body);

            HttpResponse(req, res, StatusCodes.CREATED, ResponseMessage.REGISTRATION_SUCCESS, response);
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
            const { params, query } = req as IConfirmRequest;
            const { token } = params;
            const { code } = query;

            const response = await AuthController.userService.confirmation({
                token,
                code,
            });

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.ACCOUNT_VERIFIED, response);
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
            const DOMAIN = Quicker.getDomainFromUrl(ServerConfig.SERVER_URL as string);

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

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.LOGIN_SUCCESS);
        } catch (error) {
            HttpError(
                next,
                error,
                req,
                error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public static async profile(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req as IProfileRequest;
            const response = await AuthController.userService.profile(id);

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.PROFILE_SUCCESS, response);
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
            const { id } = req as IProfileRequest;
            await AuthController.userService.requestConfirmation(id);
            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.VERIFICATION_LINK_SENT, StatusCodes.OK);
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
            const { cookies } = req;

            // * get refresh token
            const { refreshToken } = cookies;

            // * delete refresh token from DB
            await AuthController.userService.logout(refreshToken);

            // get domain
            const DOMAIN = Quicker.getDomainFromUrl(ServerConfig.SERVER_URL as string);

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
            // * get cookies
            const { cookies } = req;
            // * get refresh token
            const { refreshToken } = cookies;

            // * generate access token from refresh token
            const accessToken = await AuthController.userService.refreshToken(refreshToken);

            // * generate domain url path
            const DOMAIN = Quicker.getDomainFromUrl(ServerConfig.SERVER_URL as string);

            res.cookie('accessToken', accessToken, {
                path: '/api/v1',
                domain: DOMAIN,
                sameSite: 'strict',
                maxAge: 1000 * ServerConfig.ACCESS_TOKEN.EXPIRY,
                httpOnly: true,
                secure: !(ServerConfig.ENV === Enums.EApplicationEnvironment.DEVELOPMENT),
            });

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.TOKEN_REFRESH_SUCCESS, accessToken);
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

            const response = await AuthController.userService.forgotPassword(body);
            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.FORGOT_PASSWORD_SENT_SUCCESS, response);
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
}

export default AuthController;
