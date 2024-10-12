import express from 'express';
import ApiController from '../../controllers/api-controller';
import authRoutes from './auth-routes';
import profileRoutes from './profile-routes';
import categoryRoutes from './category-routes';
import courseRoutes from './course-routes';

const router = express.Router();

router.route('/self').get(ApiController.self);
router.route('/health').get(ApiController.health);

// Auth Routes
router.use(authRoutes);

// Profile Routes
router.use(profileRoutes);

// Category Routes
router.use(categoryRoutes);

// Course Routes
router.use(courseRoutes);

export default router;
