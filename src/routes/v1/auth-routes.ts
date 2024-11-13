import express from 'express';
import { AuthMiddleware, ValidationMiddleware } from '../../middlewares';
import schema from '../../schemas';
import { AuthController } from '../../controllers';

const router = express.Router();

/**
 * @openapi
 * /api/v1/register:
 *  post:
 *      tags:
 *          - User
 *      summary: Register a User
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/RegisterUserInput'
 *      responses:
 *          201:
 *              description: Created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/RegisterUserResponse'
 *          422:
 *              description: Unprocessable Entity
 *          409:
 *              description: Conflict
 *          404:
 *              description: Not Found
 *          500:
 *              description: Internal Server Error
 */
router.route('/register').post(ValidationMiddleware.validateRequest(schema.registerSchema), AuthController.register);

// Account Confirmation : PUT /api/v1/account-confirmation/:token?code=123456
router
    .route('/account-confirmation/:token')
    .put(ValidationMiddleware.validateRequest(schema.accountVerificationSchema), AuthController.confirmation);

// Login : POST /api/v1/login
router.route('/login').post(ValidationMiddleware.validateRequest(schema.loginSchema), AuthController.login);

// Request Email Verification : POST /api/v1/account-confirmation
router.route('/account-confirmation').put(AuthMiddleware.checkAuth, AuthController.requestConfirmation);

// Logout : POST /api/v1/logout
router.route('/logout').post(AuthMiddleware.checkAuth, AuthController.logout);

// Refresh Token : POST /api/v1/refresh-token
router.route('/refresh-token').post(AuthController.refreshToken);

// Forgot Password : POST /api/v1/forgot-password
router
    .route('/forgot-password')
    .post(ValidationMiddleware.validateRequest(schema.forgotPasswordSchema), AuthController.forgotPassword);

// Reset Password : PUT /api/v1/reset-password/:token
router
    .route('/reset-password/:token')
    .put(ValidationMiddleware.validateRequest(schema.resetPasswordSchema), AuthController.resetPassword);

// Change Password
router
    .route('/change-password')
    .put(
        AuthMiddleware.checkAuth,
        ValidationMiddleware.validateRequest(schema.changePasswordSchema),
        AuthController.changePassword,
    );

export default router;
