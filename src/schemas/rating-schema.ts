import Joi from 'joi';
import { IRatingRequestBody } from '../types';

export const createRatingSchema = Joi.object<IRatingRequestBody, true>({
    rating: Joi.number().required().min(1).max(5).messages({
        'number.base': 'Rating must be a number.',
        'number.min': 'Rating must be at least 1.',
        'number.max': 'Rating must be at most 5.',
        'number.required': 'Rating is required.',
    }),
    review: Joi.string().required().min(5).max(500).messages({
        'string.base': 'Review must be a string.',
        'string.min': 'Review must be at least 5 characters long.',
        'string.max': 'Review must be at most 500 characters long.',
        'string.required': 'Review is required.',
    }),
});
