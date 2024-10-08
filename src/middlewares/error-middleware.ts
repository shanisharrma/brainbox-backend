import { NextFunction, Request, Response } from 'express';
import { THttpError } from '../types';
import { HttpError } from '../utils/common';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/error';
import { ResponseMessage } from '../utils/constants';

class ErrorMiddleware {
    public static global(err: THttpError, _: Request, res: Response) {
        res.status(err.statusCode).json(err);
    }

    public static notFound(req: Request, _: Response, next: NextFunction) {
        try {
            throw new AppError(ResponseMessage.NOT_FOUND('Route'), StatusCodes.NOT_FOUND);
        } catch (error) {
            HttpError(next, error, req, error instanceof AppError ? error.statusCode : StatusCodes.NOT_FOUND);
        }
    }
}

export default ErrorMiddleware;
