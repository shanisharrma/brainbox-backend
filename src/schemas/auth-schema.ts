import Joi from 'joi';
import {
    IChangePasswordRequestBody,
    IForgotRequestBody,
    ILoginRequestBody,
    IRegisterRequestBody,
    IResetPasswordRequestBody,
} from '../types';

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

export const forgotPasswordSchema = Joi.object<IForgotRequestBody, true>({
    email: Joi.string().email().trim().required(),
});

export const resetPasswordSchema = Joi.object<IResetPasswordRequestBody, true>({
    password: Joi.string().min(8).trim().required(),
    confirmPassword: Joi.string().min(8).trim().valid(Joi.ref('password')).required(),
});

export const changePasswordSchema = Joi.object<IChangePasswordRequestBody, true>({
    oldPassword: Joi.string().min(8).trim().required(),
    newPassword: Joi.string().min(8).trim().required(),
    confirmNewPassword: Joi.string().min(8).valid(Joi.ref('newPassword')).trim().required(),
});
