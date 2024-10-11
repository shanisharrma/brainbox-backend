import express from 'express';
import { AuthMiddleware } from '../../middlewares';
import { ProfileController } from '../../controllers';

const router = express.Router();

// Profile : GET /api/v1/profile
router.route('/profile').get(AuthMiddleware.checkAuth, ProfileController.profile);

export default router;
