import {
    registerSchema,
    accountVerificationSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
    updateProfileSchema,
} from './auth-schema';

import { createCategorySchema } from './category-schema';

import {
    courseSchema,
    sectionSchema,
    updateSectionSchema,
    subSectionSchema,
    updateSubSectionSchema,
} from './course-schema';

import { createRatingSchema } from './rating-schema';

import { verifyPaymentSchema, capturePaymentSchema } from './payment-schema';

export default {
    registerSchema,
    accountVerificationSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
    createCategorySchema,
    courseSchema,
    sectionSchema,
    updateSectionSchema,
    subSectionSchema,
    updateSubSectionSchema,
    updateProfileSchema,
    createRatingSchema,
    capturePaymentSchema,
    verifyPaymentSchema,
};
