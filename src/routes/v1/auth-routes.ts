import express from 'express';
import { AuthMiddleware, ValidationMiddleware } from '../../middlewares';
import schema from '../../schemas';
import { AuthController } from '../../controllers';
import { loginSchema } from '../../schemas/auth-schema';

const router = express.Router();

// from here we will write all the routes for authentication and authorization
// Register : POST /api/v1/register
router.route('/register').post(ValidationMiddleware.validateRequest(schema.registerSchema), AuthController.register);

// Account Confirmation : PUT /api/v1/account-confirmation/:token?code=123456
router.route('/account-confirmation/:token').put(AuthController.confirmation);

// Login : POST /api/v1/login
router.route('/login').post(ValidationMiddleware.validateRequest(loginSchema), AuthController.login);

// Profile : GET /api/v1/profile
router.route('/profile').get(AuthMiddleware.checkAuth, AuthController.profile);

export default router;
