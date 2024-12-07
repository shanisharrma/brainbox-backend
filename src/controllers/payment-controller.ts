import { NextFunction, Request, Response } from 'express';
import { PaymentService } from '../services';
import { HttpError, HttpResponse } from '../utils/common';
import { AppError } from '../utils/error';
import { StatusCodes } from 'http-status-codes';
import { ResponseMessage } from '../utils/constants';
import { ICapturePaymentRequestBody, IVerifyPaymentRequestBody } from '../types';

interface IPaymentRequest extends Request {
    id: number;
}

interface ICapturePaymentRequest extends IPaymentRequest {
    body: ICapturePaymentRequestBody;
}

interface IVerifyPaymentRequest extends IPaymentRequest {
    body: IVerifyPaymentRequestBody;
}

class PaymentController {
    private static paymentService: PaymentService = new PaymentService();

    public static async capture(req: Request, res: Response, next: NextFunction) {
        try {
            // * get course id from params and user id from auth
            const { body, id } = req as ICapturePaymentRequest;

            // * get provider from body
            const { provider, courseIds } = body;

            // * call payment capture service
            const paymentResponse = await PaymentController.paymentService.capture(provider, {
                courseIds,
                userId: id,
            });

            // * return http response
            HttpResponse(req, res, StatusCodes.CREATED, ResponseMessage.CREATED('Payment'), paymentResponse);
        } catch (error) {
            HttpError(
                next,
                error,
                req,
                error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public static async verify(req: Request, res: Response, next: NextFunction) {
        try {
            // * destructure request
            const { body, id } = req as IVerifyPaymentRequest;

            // * destructure request body
            const { orderId, paymentId, provider, signature, courseIds } = body;

            // * call the verify payment service
            await PaymentController.paymentService.verify(
                provider,
                { orderId, paymentId, signature },
                { courseIds, userId: id },
            );

            // * return http response
            HttpResponse(req, res, StatusCodes.CREATED, ResponseMessage.USER_ENROLLED);
        } catch (error) {
            HttpError(
                next,
                error,
                req,
                error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }
}

export default PaymentController;
