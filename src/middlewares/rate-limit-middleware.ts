import { NextFunction, Request, Response } from 'express';
import { rateLimiterPostgreSQL, ServerConfig } from '../config';
import { Enums, ResponseMessage } from '../utils/constants';
import { HttpError } from '../utils/common';
import { AppError } from '../utils/error';
import { StatusCodes } from 'http-status-codes';

export default (req: Request, _: Response, next: NextFunction) => {
    if (ServerConfig.ENV === Enums.EApplicationEnvironment.DEVELOPMENT) {
        return next();
    }

    if (rateLimiterPostgreSQL) {
        rateLimiterPostgreSQL
            .consume(req.ip as string, 1)
            .then(() => {
                next();
            })
            .catch(() => {
                HttpError(next, new AppError(ResponseMessage.TOO_MANY_REQUESTS), req, StatusCodes.TOO_MANY_REQUESTS);
            });
    }
};
