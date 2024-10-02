import express from 'express';
import { ValidationMiddleware } from '../../middlewares';
import schema from '../../schemas';
import { AuthController } from '../../controllers';

const router = express.Router();

// from here we will write all the routes for authentication and authorization
// Register : POST /api/v1/register
router
    .route('/register')
    .post(
        ValidationMiddleware.validateRequest(schema.registerSchema),
        AuthController.register,
    );

export default router;
