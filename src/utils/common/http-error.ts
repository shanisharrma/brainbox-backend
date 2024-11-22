import { NextFunction, Request } from 'express';
import { AppError, ErrorObject } from '../error';

export default (nextFunc: NextFunction, err: AppError | unknown, req: Request, errorStatusCode: number = 500) => {
    const errObj = ErrorObject(err, req, errorStatusCode);
    nextFunc(errObj);
};
