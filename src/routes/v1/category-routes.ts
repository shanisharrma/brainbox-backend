import express from 'express';
import { AuthMiddleware, ValidationMiddleware } from '../../middlewares';
import schemas from '../../schemas';
import { CategoryController } from '../../controllers';

const router = express.Router();

// Create Category : POST /api/v1/category
router
    .route('/categories')
    .post(
        ValidationMiddleware.validateRequest(schemas.createCategorySchema),
        AuthMiddleware.checkAuth,
        AuthMiddleware.isAdmin,
        CategoryController.create,
    );

// Show all Categories : GET /api/v1/categories
router.route('/categories').get(AuthMiddleware.checkAuth, CategoryController.showAll);

export default router;
