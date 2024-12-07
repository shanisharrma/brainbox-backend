import express from 'express';
import { AuthMiddleware, upload, ValidationMiddleware } from '../../middlewares';
import schemas from '../../schemas';
import {
    CourseController,
    CourseProgressController,
    RatingController,
    SectionController,
    SubSectionController,
} from '../../controllers';

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
        ValidationMiddleware.processRequestBody(),
        ValidationMiddleware.validateRequest(schemas.courseSchema),
        CourseController.create,
    );

// All Courses : GET /api/v1/courses
router.route('/courses').get(CourseController.showAll);

// Get Enrolled Courses : GET /api/v1/courses/enrolled
router
    .route('/courses/enrolled')
    .get(AuthMiddleware.checkAuth, AuthMiddleware.isStudent, CourseController.enrolledCourses);

// Get Enrolled Courses to View by enrolled student : GET /api/v1/courses/:courseId/view
router
    .route('/courses/:courseId/view')
    .get(AuthMiddleware.checkAuth, AuthMiddleware.isStudent, CourseController.viewEnrolledCourses);

// Get Instructor Courses : Get /api/v1/courses/taught
router
    .route('/courses/taught')
    .get(AuthMiddleware.checkAuth, AuthMiddleware.isInstructor, CourseController.taughtCourses);

// Single Course for Instructor: GET /api/v1/courses/:courseID
router
    .route('/courses/:courseId/edit')
    .get(AuthMiddleware.checkAuth, AuthMiddleware.isInstructor, CourseController.showEditable);

// Single Course : GET /api/v1/courses/:courseID
router.route('/courses/:courseId').get(CourseController.showPublic);

// Edit Course : PUT /api/v1/courses/:courseId
router
    .route('/courses/:courseId')
    .put(
        AuthMiddleware.checkAuth,
        AuthMiddleware.isInstructor,
        upload.single('thumbnail'),
        ValidationMiddleware.processRequestBody(),
        ValidationMiddleware.validateRequest(schemas.updateCourseSchema),
        CourseController.update,
    );

// Delete Course : DELETE /api/v1/courses/:courseId
router
    .route('/courses/:courseId')
    .delete(AuthMiddleware.checkAuth, AuthMiddleware.isInstructor, CourseController.delete);

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

//========================================================================================================== //
// ======================================= Rating & Reviews Routes =========================================
// ========================================================================================================= //

// Create Rating for course : POST /api/v1/courses/:courseId/ratings
router
    .route('/courses/:courseId/ratings')
    .post(
        AuthMiddleware.checkAuth,
        AuthMiddleware.isStudent,
        ValidationMiddleware.validateRequest(schemas.createRatingSchema),
        RatingController.create,
    );

// Get Rating Average for course : GET /api/v1/courses/:courseId/ratings
router.route('/courses/:courseId/ratings').get(RatingController.getAverage);

// Show all Rating : GET /api/v1/ratings
router.route('/ratings').get(RatingController.showAll);

//========================================================================================================== //
// ======================================= Course Progress Routes =========================================
// ========================================================================================================= //

// Add Course Progress : PUT /api/v1/courses/:courseId/subsections/:subSectionId
router
    .route('/courses/:courseId/subsections/:subSectionId')
    .put(AuthMiddleware.checkAuth, AuthMiddleware.isStudent, CourseProgressController.update);

export default router;
