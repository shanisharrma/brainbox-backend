import Joi from 'joi';
import { ILoginRequestBody, IRegisterRequestBody } from '../types';

export const registerSchema = Joi.object<IRegisterRequestBody, true>({
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().min(8).trim().required(),
    phoneNumber: Joi.string().min(4).max(20).trim().required(),
    role: Joi.string().valid('student', 'admin', 'instructor').trim().required(),
    consent: Joi.boolean().valid(true).required(),
});

export const loginSchema = Joi.object<ILoginRequestBody, true>({
    email: Joi.string().email().trim().required(),
    password: Joi.string().min(8).trim().required(),
});
