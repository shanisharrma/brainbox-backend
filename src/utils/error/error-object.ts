import { Request } from 'express';
import AppError from './app-error';
import { THttpError } from '../../types';
import { Enums, ResponseMessage } from '../constants';
import { ServerConfig } from '../../config';

export default (
    err: AppError | unknown,
    req: Request,
    errorStatusCode: number = 500,
) => {
    const errObj: THttpError = {
        success: false,
        statusCode: errorStatusCode,
        request: {
            ip: req.ip || null,
            method: req.method,
            url: req.originalUrl,
        },
        message:
            err instanceof AppError
                ? err.message
                : ResponseMessage.SOMETHING_WENT_WRONG,
        data: err,
        trace: err instanceof AppError ? { error: err.stack } : null,
    };

    // eslint-disable-next-line no-console
    console.error(Enums.EApplicationEvent.CONTROLLER_ERROR_RESPONSE, {
        meta: errObj,
    });

    if (ServerConfig.ENV === Enums.EApplicationEnvironment.PRODUCTION) {
        delete errObj.request.ip;
        delete errObj.trace;
    }

    return errObj;
};
