import { NextFunction, Request, Response } from 'express';
import { PaymentService } from '../services';
import { HttpError, HttpResponse } from '../utils/common';
import { AppError } from '../utils/error';
import { StatusCodes } from 'http-status-codes';
import { ResponseMessage } from '../utils/constants';
import { ICapturePaymentRequestBody, IVerifyPaymentRequestBody } from '../types';
import { Quicker } from '../utils/helper';

interface IPaymentRequest extends Request {
    params: { courseId: string };
    id: number;
}

interface ICapturePaymentRequest extends IPaymentRequest {
    body: ICapturePaymentRequestBody;
}

interface IVerifyPaymentRequest extends IPaymentRequest {
    body: IVerifyPaymentRequestBody;
}

class PaymentController {
    private static paymentService: PaymentService;

    public static async capture(req: Request, res: Response, next: NextFunction) {
        try {
            // * get course id from params and user id from auth
            const { body, params, id } = req as ICapturePaymentRequest;

            // * get provider from body
            const { provider } = body;

            // * get courseId from params
            const { courseId } = params;

            // * validate course id
            if (!Quicker.validateValue(courseId, /^\d+$/)) {
                throw new AppError('Invalid Course Id format', StatusCodes.BAD_REQUEST);
            }

            // * call payment capture service
            const paymentResponse = await PaymentController.paymentService.capture(provider, {
                courseId: Number(courseId),
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
            const { body, params, id } = req as IVerifyPaymentRequest;

            // * destructure request body
            const { orderId, paymentId, provider, signature } = body;

            // * get courseId id from request params
            const { courseId } = params;

            // * validate the courseId
            if (!Quicker.validateValue(courseId, /^\d+$/)) {
                throw new AppError('Invalid course ID format.', StatusCodes.BAD_REQUEST);
            }

            // * call the verify payment service
            await PaymentController.paymentService.verify(
                provider,
                { orderId, paymentId, signature },
                { courseId: Number(courseId), userId: id },
            );

            // * return http response
            HttpResponse(
                req,
                res,
                StatusCodes.CREATED,
                'Payment verified successfully and user enrolled to the course',
            );
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
