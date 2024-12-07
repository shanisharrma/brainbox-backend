import Joi from 'joi';
import { ICapturePaymentRequestBody, IVerifyPaymentRequestBody } from '../types';

export const capturePaymentSchema = Joi.object<ICapturePaymentRequestBody, true>({
    provider: Joi.string().valid('razorpay', 'stripe').trim().required().messages({
        'any.only': 'Provider must be either "razorpay" or "stripe"',
        'string.base': 'Provider must be a string',
        'string.empty': 'Provider cannot be empty',
        'any.required': 'Provider is required',
    }),
    courseIds: Joi.array()
        .items(
            Joi.number().required().messages({
                'number.base': 'Each course ID must be a number',
                'number.empty': 'Course ID cannot be empty',
                'any.required': 'Course ID is required',
            }),
        )
        .messages({
            'array.base': 'Courses must be an array',
            'array.includes': 'Each course must be a number',
            'any.required': 'Courses are required',
        }),
});

export const verifyPaymentSchema = Joi.object<IVerifyPaymentRequestBody, true>({
    provider: Joi.string().valid('razorpay', 'stripe').trim().required().messages({
        'any.only': 'Provider must be either "razorpay" or "stripe"',
        'string.base': 'Provider must be a string',
        'string.empty': 'Provider cannot be empty',
        'any.required': 'Provider is required',
    }),
    orderId: Joi.string().trim().required().messages({
        'string.base': 'Order ID must be a string',
        'string.empty': 'Order ID cannot be empty',
        'any.required': 'Order ID is required',
    }),
    paymentId: Joi.string().trim().required().messages({
        'string.base': 'Payment ID must be a string',
        'string.empty': 'Payment ID cannot be empty',
        'any.required': 'Payment ID is required',
    }),
    signature: Joi.string().trim().optional().messages({
        'string.base': 'Signature must be a string',
        'string.empty': 'Signature cannot be empty',
        // 'any.required': 'Signature is required',
    }),
    courseIds: Joi.array()
        .items(
            Joi.number().required().messages({
                'number.base': 'Each course ID must be a number',
                'number.empty': 'Course ID cannot be empty',
                'any.required': 'Course ID is required',
            }),
        )
        .required()
        .messages({
            'array.base': 'Courses must be an array',
            'array.includes': 'Each course must be a number',
            'any.required': 'Courses are required',
        }),
});
