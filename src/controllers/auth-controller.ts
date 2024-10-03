import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/error';
import { HttpError, HttpResponse } from '../utils/common';
import { StatusCodes } from 'http-status-codes';
import { ResponseMessage } from '../utils/constants';
import { IRegisterRequestBody } from '../types';
import { UserService } from '../services';

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

class AuthController {
    private static userService: UserService = new UserService();

    public static async register(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { body } = req as IRegisterRequest;

            // call the user register service
            const response =
                await AuthController.userService.registerUser(body);

            HttpResponse(
                req,
                res,
                StatusCodes.CREATED,
                ResponseMessage.REGISTRATION_SUCCESS,
                response,
            );
        } catch (error) {
            HttpError(
                next,
                error,
                req,
                error instanceof AppError
                    ? error.statusCode
                    : StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public static async confirmation(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { params, query } = req as IConfirmRequest;
            const { token } = params;
            const { code } = query;

            const response = await AuthController.userService.confirmation({
                token,
                code,
            });

            HttpResponse(
                req,
                res,
                StatusCodes.OK,
                ResponseMessage.ACCOUNT_VERIFIED,
                response,
            );
        } catch (error) {
            HttpError(
                next,
                error,
                req,
                error instanceof AppError
                    ? error.statusCode
                    : StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }
}

export default AuthController;
