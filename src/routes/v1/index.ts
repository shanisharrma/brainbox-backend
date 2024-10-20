import express from 'express';
import ApiController from '../../controllers/api-controller';
import authRoutes from './auth-routes';
import profileRoutes from './profile-routes';
import categoryRoutes from './category-routes';
import courseRoutes from './course-routes';
import paymentRoutes from './payment-routes';

const router = express.Router();

/**
 * @openapi
 * /api/v1/self:
 *  get:
 *      tags:
 *          - Server Status
 *      description: Response if the app is up and running
 *      responses:
 *         200:
 *             description: App is up and running
 */
router.route('/self').get(ApiController.self);

/**
 * @openapi
 * /api/v1/health:
 *  get:
 *      tags:
 *          - Healthcheck
 *      description: Response if the app is up and running
 *      responses:
 *         200:
 *             description: App is up and running
 */
router.route('/health').get(ApiController.health);

// Auth Routes
router.use(authRoutes);

// Profile Routes
router.use(profileRoutes);

// Category Routes
router.use(categoryRoutes);

// Course Routes
router.use(courseRoutes);

// Payment Routes
router.use(paymentRoutes);

export default router;
