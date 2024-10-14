import express from 'express';
import { AuthMiddleware, upload, ValidationMiddleware } from '../../middlewares';
import schemas from '../../schemas';
import { CourseController, SectionController, SubSectionController } from '../../controllers';

const router = express.Router();

// ========================================================================================================= //
// ========================================= Course Routes =================================================
// ========================================================================================================= //

// Create Course : POST /api/v1/courses
router
    .route('/courses')
    .post(
        AuthMiddleware.checkAuth,
        AuthMiddleware.isInstructor,
        upload.single('thumbnail'),
        ValidationMiddleware.validateRequest(schemas.courseSchema),
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
        AuthMiddleware.checkAuth,
        AuthMiddleware.isInstructor,
        ValidationMiddleware.validateRequest(schemas.sectionSchema),
        SectionController.create,
    );

// Update Course Section : PUT /api/v1/courses/:courseId/sections/:sectionId
router
    .route('/courses/:courseId/sections/:sectionId')
    .put(
        AuthMiddleware.checkAuth,
        AuthMiddleware.isInstructor,
        ValidationMiddleware.validateRequest(schemas.updateSectionSchema),
        SectionController.update,
    );

// Delete Course Section : DELETE /api/v1/courses/:courseId/sections/:sectionId
router
    .route('/courses/:courseId/sections/:sectionId')
    .delete(AuthMiddleware.checkAuth, AuthMiddleware.isInstructor, SectionController.delete);

// ========================================================================================================= //
// ======================================= Sub Section Routes ==============================================
// ========================================================================================================= //

// Create Course Sub Section : POST /api/v1/sections/:sectionId/subsections
router
    .route('/sections/:sectionId/subsections')
    .post(
        AuthMiddleware.checkAuth,
        AuthMiddleware.isInstructor,
        upload.single('lecture'),
        ValidationMiddleware.validateRequest(schemas.subSectionSchema),
        SubSectionController.create,
    );

// Update Course Sub Section : PUT /api/v1/sections/:sectionId/subsections/subsectionId
router
    .route('/sections/:sectionId/subsections/:subSectionId')
    .put(
        AuthMiddleware.checkAuth,
        AuthMiddleware.isInstructor,
        upload.single('lecture'),
        ValidationMiddleware.validateRequest(schemas.updateSubSectionSchema),
        SubSectionController.update,
    );

// Delete Course Sub Section : DELETE /api/v1/sections/:sectionId/subsections/subsectionId
router
    .route('/sections/:sectionId/subsections/:subSectionId')
    .delete(AuthMiddleware.checkAuth, AuthMiddleware.isInstructor, SubSectionController.delete);

export default router;
