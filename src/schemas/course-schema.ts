import Joi, { ObjectSchema } from 'joi';
import { ICourseRequestBody, ISectionRequestBody } from '../types';

export const courseSchema: ObjectSchema = Joi.object<ICourseRequestBody, true>({
    name: Joi.string().trim().required().messages({
        'any.required': 'Course name is required.',
        'string.empty': 'Course name cannot be empty.',
    }),
    description: Joi.string().max(120).trim().required().messages({
        'any.required': 'Description is required.',
        'string.empty': 'Description cannot be empty.',
        'string.max': 'Description must be at most 120 characters long.',
    }),
    whatYouWillLearn: Joi.string().trim().required().messages({
        'any.required': 'What you will learn is required.',
        'string.empty': 'What you will learn cannot be empty.',
    }),
    price: Joi.number().positive().required().messages({
        'any.required': 'Price is required.',
        'number.positive': 'Price must be a positive number.',
    }),
    category: Joi.string().trim().required().messages({
        'any.required': 'Category is required.',
        'string.empty': 'Category cannot be empty.',
    }),
}).required();

export const sectionSchema: ObjectSchema = Joi.object<ISectionRequestBody, true>({
    name: Joi.string().trim().required().messages({
        'any.required': 'Section name is required.',
        'string.empty': 'Section name cannot be empty.',
    }),
}).required();

export const updateSectionSchema: ObjectSchema = Joi.object<Partial<ISectionRequestBody>, true>({
    name: Joi.string().trim().optional().messages({
        'string.empty': 'Section name cannot be empty.',
    }),
}).required();
