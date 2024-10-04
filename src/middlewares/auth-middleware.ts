import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/error';
import { ResponseMessage } from '../utils/constants';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../utils/common';
import { UserService } from '../services';

interface IAuthenticatedRequest extends Request {
    cookies: {
        accessToken: string;
        refreshToken: string;
    };
    id: number;
}

class AuthMiddleware {
    private static userService: UserService = new UserService();

    public static async checkAuth(req: Request, _: Response, next: NextFunction) {
        try {
            const { cookies } = req as IAuthenticatedRequest;
            const { accessToken } = cookies;

            if (!accessToken) {
                throw new AppError(ResponseMessage.AUTHORIZATION_TOKEN_MISSING, StatusCodes.UNAUTHORIZED);
            }

            const response = await AuthMiddleware.userService.isAuthenticated(accessToken);

            if (!response) {
                throw new AppError(ResponseMessage.INVALID_AUTHORIZATION_TOKEN, StatusCodes.UNAUTHORIZED);
            }

            (req as IAuthenticatedRequest).id = response;
            next();
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

export default AuthMiddleware;
