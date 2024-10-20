import Joi, { ObjectSchema } from 'joi';
import {
    IChangePasswordRequestBody,
    IForgotRequestBody,
    ILoginRequestBody,
    IProfileRequestBody,
    IRegisterRequestBody,
    IResetPasswordRequestBody,
    IVerificationRequestBody,
} from '../types';

/**
 * @openapi
 * components:
 *  schemas:
 *      RegisterUserInput:
 *          type: object
 *          required:
 *              - firstName
 *              - lastName
 *              - email
 *              - password
 *              - phoneNumber
 *              - role
 *              - consent
 *          properties:
 *              firstName:
 *                  type: string
 *                  default: Jane
 *              lastName:
 *                  type: string
 *                  default: Doe
 *              email:
 *                  type: string
 *                  default: jane.doe@example.com
 *              password:
 *                  type: string
 *                  default: strongPassword@123
 *              phoneNumber:
 *                  type: string
 *                  default: 91999999999
 *              role:
 *                  type: string
 *                  default: student
 *              consent:
 *                  type: boolean
 *                  default: true
 *      RegisterUserResponse:
 *          type: object
 *          properties:
 *              firstName:
 *                  type: string
 *              lastName:
 *                  type: string
 *              email:
 *                  type: string
 *              createdAt:
 *                  type: string
 *              updatedAt:
 *                  type: string
 *              phoneNumber:
 *                  type: string
 *              role:
 *                  type: string
 *              consent:
 *                  type: boolean
 */
export const registerSchema = Joi.object<IRegisterRequestBody, true>({
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().min(8).trim().required(),
    phoneNumber: Joi.string().min(4).max(20).trim().required(),
    role: Joi.string().valid('student', 'admin', 'instructor').trim().required(),
    consent: Joi.boolean().valid(true).required(),
});

export const accountVerificationSchema = Joi.object<IVerificationRequestBody, true>({
    code: Joi.string().max(6).trim().required(),
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

export const updateProfileSchema: ObjectSchema = Joi.object<Partial<IProfileRequestBody>, true>({
    about: Joi.string().trim().optional().messages({
        'string.empty': 'About cannot be empty.',
    }),
    dateOfBirth: Joi.string().trim().optional().messages({
        'string.empty': 'Date of Birth cannot be empty.',
    }),
    gender: Joi.string().trim().optional().messages({
        'string.empty': 'Gender cannot be empty.',
    }),
}).required();
