import express from 'express';
import { AuthMiddleware, upload, ValidationMiddleware } from '../../middlewares';
import schemas from '../../schemas';
import { CourseController, SectionController } from '../../controllers';

const router = express.Router();

// ========================================================================================================= //
// ========================================= Course Routes =================================================
// ========================================================================================================= //

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

// ========================================================================================================= //
// ========================================= Section Routes ================================================
// ========================================================================================================= //

// Create Course Section : POST /api/v1/courses/:courseId/sections
router
    .route('/courses/:courseId/sections')
    .post(
        ValidationMiddleware.validateRequest(schemas.sectionSchema),
        AuthMiddleware.checkAuth,
        AuthMiddleware.isInstructor,
        SectionController.create,
    );

// Update Course Section : PUT /api/v1/courses/:courseId/sections/:sectionId
router
    .route('/courses/:courseId/sections/:sectionId')
    .put(
        ValidationMiddleware.validateRequest(schemas.updateSectionSchema),
        AuthMiddleware.checkAuth,
        AuthMiddleware.isInstructor,
        SectionController.update,
    );

// Delete Course Section : DELETE /api/v1/courses/:courseId/sections/:sectionId
router
    .route('/courses/:courseId/sections/:sectionId')
    .delete(AuthMiddleware.checkAuth, AuthMiddleware.isInstructor, SectionController.delete);

export default router;
