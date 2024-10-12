import Joi from 'joi';
import { ICategoryRequestBody } from '../types';

export const createCategorySchema = Joi.object<ICategoryRequestBody, true>({
    name: Joi.string().trim().required(),
    description: Joi.string().max(120).trim().required(),
});
