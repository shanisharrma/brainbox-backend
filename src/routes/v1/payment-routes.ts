import express from 'express';
import { AuthMiddleware, ValidationMiddleware } from '../../middlewares';
import schemas from '../../schemas';
import { PaymentController } from '../../controllers';

const router = express.Router();

// ========================================================================================================= //
// ========================================= Payment Routes ================================================
// ========================================================================================================= //

// Capture Payment : POST /api/v1/courses/:courseId/payments
router
    .route('/courses/:courseId/payments')
    .post(
        AuthMiddleware.checkAuth,
        AuthMiddleware.isStudent,
        ValidationMiddleware.validateRequest(schemas.capturePaymentSchema),
        PaymentController.capture,
    );

// Verify Payment : POST /api/v1/courses/:courseId/payments/verify
router
    .route('/courses/:courseId/payments/verify')
    .post(
        AuthMiddleware.checkAuth,
        AuthMiddleware.isStudent,
        ValidationMiddleware.validateRequest(schemas.verifyPaymentSchema),
        PaymentController.verify,
    );

export default router;
