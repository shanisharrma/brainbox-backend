import {
    registerSchema,
    accountVerificationSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
} from './auth-schema';

import { createCategorySchema } from './category-schema';

import { courseSchema } from './course-schema';

export default {
    registerSchema,
    accountVerificationSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
    createCategorySchema,
    courseSchema,
};
