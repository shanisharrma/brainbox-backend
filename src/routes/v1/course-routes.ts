import express from 'express';
import { AuthMiddleware, upload, ValidationMiddleware } from '../../middlewares';
import schemas from '../../schemas';
import { CourseController } from '../../controllers';

const router = express.Router();

// Create Course : POST /api/v1/courses
router
    .route('/courses')
    .post(
        upload.single('thumbnail'),
        ValidationMiddleware.validateRequest(schemas.courseSchema),
        AuthMiddleware.checkAuth,
        AuthMiddleware.isInstructor,
        CourseController.create,
    );

// All Courses : GET /api/v1/courses
router.route('/courses').get(CourseController.showAll);

export default router;
