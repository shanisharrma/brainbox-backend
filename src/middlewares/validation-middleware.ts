import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { HttpError } from '../utils/common';
import { StatusCodes } from 'http-status-codes';

class ValidationMiddleware {
    // this function will get schema and return a validation of schema as middleware function
    public static validateRequest(schema: Joi.Schema) {
        // return middleware function
        return (req: Request, _: Response, next: NextFunction) => {
            // validate request body
            const { error, value } = schema.validate(req.body);

            // check if error found then return HttpError
            if (error) {
                HttpError(next, error, req, StatusCodes.UNPROCESSABLE_ENTITY);
                return;
            }

            // if not error
            req.body = value;
            next();
        };
    }
}

export default ValidationMiddleware;
