import express from 'express';
import ApiController from '../../controllers/api-controller';
import authRoutes from './auth-routes';
import profileRoutes from './profile-routes';

const router = express.Router();

router.route('/self').get(ApiController.self);
router.route('/health').get(ApiController.health);

// Auth Routes
router.use(authRoutes);

// Profile Routes
router.use(profileRoutes);

export default router;
