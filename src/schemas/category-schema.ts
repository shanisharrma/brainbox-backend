import Joi from 'joi';
import { ICategoryRequestBody } from '../types';

export const createCategorySchema = Joi.object<ICategoryRequestBody, true>({
    name: Joi.string().trim().required().messages({
        'string.empty': 'Name is required',
        'any.required': 'Name is required',
    }),
    description: Joi.string().max(120).trim().required().messages({
        'string.empty': 'Description is required',
        'string.max': 'Description must be less than or equal to 120 characters',
        'any.required': 'Description is required',
    }),
});
