import { NextFunction, Request, Response } from 'express';
import { HttpError, HttpResponse } from '../utils/common';
import StatusCodes from 'http-status-codes';
import { ResponseMessage } from '../utils/constants';
import { Quicker } from '../utils/helper';

class ApiController {
    public static self(req: Request, res: Response, next: NextFunction) {
        try {
            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.SUCCESS);
        } catch (error) {
            HttpError(next, error, req, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public static health(req: Request, res: Response, next: NextFunction) {
        try {
            const healthData = {
                application: Quicker.getApplicationHealth(),
                system: Quicker.getSystemHealth(),
                timestamp: Date.now(),
            };

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.SUCCESS, healthData);
        } catch (error) {
            HttpError(next, error, req, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default ApiController;
