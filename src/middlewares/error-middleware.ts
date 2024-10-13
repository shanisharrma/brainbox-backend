import { NextFunction, Request, Response } from 'express';
import { THttpError } from '../types';
import { HttpError } from '../utils/common';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/error';
import { ResponseMessage } from '../utils/constants';
import { MulterError } from 'multer';

class ErrorMiddleware {
    public static interceptError(err: THttpError, req: Request, _: Response, next: NextFunction) {
        try {
            const multerErrorMap: Record<string, { statusCode: number; message: string }> = {
                LIMIT_FILE_SIZE: { statusCode: StatusCodes.REQUEST_TOO_LONG, message: ResponseMessage.FILE_TOO_LARGE },
                LIMIT_FILE_COUNT: { statusCode: StatusCodes.BAD_REQUEST, message: ResponseMessage.TOO_MANY_FILES },
            };

            if (err instanceof MulterError) {
                const multerError = multerErrorMap[err.code] || { statusCode: 400, message: 'Bad request' };
                throw new AppError(multerError.message, multerError.statusCode);
            }
            next(err);
        } catch (error) {
            HttpError(next, error, req, error instanceof AppError ? error.statusCode : StatusCodes.NOT_FOUND);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static global(err: THttpError, _: Request, res: Response, __: NextFunction) {
        // ErrorMiddleware.interceptError(err, req, next);
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
