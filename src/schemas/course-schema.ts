import Joi, { ObjectSchema } from 'joi';
import { ICourseRequestBody, ISectionRequestBody, ISubSectionRequestBody } from '../types';

export const courseSchema: ObjectSchema<ICourseRequestBody> = Joi.object<ICourseRequestBody, true>({
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
        'string.empty': 'Category cannot be empty',
        'any.required': 'Category is required',
    }),
    requirements: Joi.string().min(3).trim().required().messages({
        'string.empty': 'Tags cannot be empty',
        'string.min': 'Tags must be at least 3 characters long',
        'any.required': 'Requirements are required',
    }),
    tags: Joi.array().items(Joi.string().min(3).trim().required()).messages({
        'array.base': 'Tags must be an array',
        'array.includes': 'Each item of tags must be a string',
        'string.empty': 'Tags cannot be empty',
        'string.min': 'Tags must be at least 3 characters long',
        'any.required': 'Tags are required',
    }),
    status: Joi.string().valid('draft', 'published').trim().messages({
        'string.empty': 'Status of course is required.',
        'any.required': 'Status of course is required.',
    }),
}).required();

export const updateCourseSchema: ObjectSchema = Joi.object<Partial<ICourseRequestBody>, true>({
    name: Joi.string().trim().optional().messages({
        'string.empty': 'Course name cannot be empty.',
    }),
    description: Joi.string().max(120).trim().optional().messages({
        'string.empty': 'Description cannot be empty.',
        'string.max': 'Description must be at most 120 characters long.',
    }),
    whatYouWillLearn: Joi.string().trim().optional().messages({
        'string.empty': 'What you will learn cannot be empty.',
    }),
    price: Joi.number().positive().optional().messages({
        'number.positive': 'Price must be a positive number.',
    }),
    category: Joi.string().trim().optional().messages({
        'string.empty': 'Category cannot be empty',
    }),
    tags: Joi.array().items(Joi.string().min(3).trim().optional()).messages({
        'array.base': 'Value must be an array',
        'array.includes': 'Each item must be a string',
        'string.empty': 'Tags cannot be empty',
        'string.min': 'Tags must be at least 3 characters long',
    }),
    requirements: Joi.string().min(3).trim().optional().messages({
        'string.empty': 'Tags cannot be empty',
        'string.min': 'Tags must be at least 3 characters long',
    }),
    status: Joi.string().valid('draft', 'published').trim().messages({
        'string.empty': 'Status of course is required.',
        'any.required': 'Status of course is required.',
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

export const subSectionSchema: ObjectSchema = Joi.object<ISubSectionRequestBody, true>({
    title: Joi.string().trim().required().messages({
        'any.required': 'Sub Section title is required.',
        'string.empty': 'Sub Section title cannot be empty.',
    }),
    description: Joi.string().trim().required().messages({
        'any.required': 'Sub Section description is required.',
        'string.empty': 'Sub Section description cannot be empty.',
    }),
}).required();

export const updateSubSectionSchema: ObjectSchema = Joi.object<Partial<ISubSectionRequestBody>, true>({
    title: Joi.string().trim().optional().messages({
        'string.empty': 'Sub Section title cannot be empty.',
    }),
    description: Joi.string().trim().optional().messages({
        'string.empty': 'Sub Section description cannot be empty.',
    }),
}).required();
