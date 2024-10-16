import Joi from 'joi';
import { ICapturePaymentRequestBody, IVerifyPaymentRequestBody } from '../types';

export const capturePaymentSchema = Joi.object<ICapturePaymentRequestBody, true>({
    provider: Joi.string().valid('razorpay', 'stripe').trim().required(),
});

export const verifyPaymentSchema = Joi.object<IVerifyPaymentRequestBody, true>({
    provider: Joi.string().valid('razorpay', 'stripe').trim().required(),
    orderId: Joi.string().trim().required(),
    paymentId: Joi.string().trim().required(),
    signature: Joi.string().trim().required(),
});
