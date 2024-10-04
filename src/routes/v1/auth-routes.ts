import express from 'express';
import { AuthMiddleware, ValidationMiddleware } from '../../middlewares';
import schema from '../../schemas';
import { AuthController } from '../../controllers';

const router = express.Router();

// from here we will write all the routes for authentication and authorization
// Register : POST /api/v1/register
router.route('/register').post(ValidationMiddleware.validateRequest(schema.registerSchema), AuthController.register);

// Account Confirmation : PUT /api/v1/account-confirmation/:token?code=123456
router.route('/account-confirmation/:token').put(AuthController.confirmation);

// Login : POST /api/v1/login
router.route('/login').post(ValidationMiddleware.validateRequest(schema.loginSchema), AuthController.login);

// Profile : GET /api/v1/profile
router.route('/profile').get(AuthMiddleware.checkAuth, AuthController.profile);

// Request Email Verification : POST /api/v1/account-confirmation
router.route('/account-confirmation').post(AuthMiddleware.checkAuth, AuthController.requestConfirmation);

// Logout : POST /api/v1/logout
router.route('/logout').post(AuthMiddleware.checkAuth, AuthController.logout);

// Refresh Token : POST /api/v1/refresh-token
router.route('/refresh-token').post(AuthMiddleware.checkAuth, AuthController.refreshToken);

// Forgot Password : POST /api/v1/forgot-password
router
    .route('/forgot-password')
    .post(ValidationMiddleware.validateRequest(schema.forgotPasswordSchema), AuthController.forgotPassword);

export default router;
