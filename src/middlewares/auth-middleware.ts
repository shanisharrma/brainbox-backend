import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/error';
import { Enums, ResponseMessage } from '../utils/constants';
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
            const { headers } = req as IAuthenticatedRequest;
            if (!headers.authorization) {
                throw new AppError(ResponseMessage.INVALID_AUTHORIZATION_TOKEN, StatusCodes.UNAUTHORIZED);
            }
            const accessToken = headers.authorization.replace('Bearer ', '');

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

    public static async checkRole(req: Request, next: NextFunction, userRole: string) {
        try {
            const { cookies } = req as IAuthenticatedRequest;
            const { accessToken } = cookies;

            if (!accessToken) {
                throw new AppError(ResponseMessage.AUTHORIZATION_TOKEN_MISSING, StatusCodes.UNAUTHORIZED);
            }

            const userId = await AuthMiddleware.userService.isAuthorized(accessToken, userRole);

            if (!userId) {
                throw new AppError(ResponseMessage.INVALID_AUTHORIZATION_TOKEN, StatusCodes.UNAUTHORIZED);
            }

            (req as IAuthenticatedRequest).id = userId;
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

    public static async isStudent(req: Request, _: Response, next: NextFunction) {
        return await AuthMiddleware.checkRole(req, next, Enums.EUserRole.STUDENT);
    }

    public static async isInstructor(req: Request, _: Response, next: NextFunction) {
        return await AuthMiddleware.checkRole(req, next, Enums.EUserRole.INSTRUCTOR);
    }

    public static async isAdmin(req: Request, _: Response, next: NextFunction) {
        return await AuthMiddleware.checkRole(req, next, Enums.EUserRole.ADMIN);
    }
}

export default AuthMiddleware;
