import { Request, Response } from 'express';
import { THttpResponse } from '../../types';
import { ServerConfig } from '../../config';
import { Enums } from '../constants';
import { Logger } from '.';

export default (
    req: Request,
    res: Response,
    responseStatusCode: number,
    responseMessage: string,
    data: unknown = null,
) => {
    const response: THttpResponse = {
        success: true,
        statusCode: responseStatusCode,
        request: {
            ip: req.ip,
            method: req.method,
            url: req.originalUrl,
        },
        message: responseMessage,
        data: data,
    };

    Logger.info(Enums.EApplicationEvent.CONTROLLER_RESPONSE, {
        meta: response,
    });

    if (ServerConfig.ENV === Enums.EApplicationEnvironment.PRODUCTION) {
        delete response.request.ip;
    }

    res.status(responseStatusCode).json(response);
};
