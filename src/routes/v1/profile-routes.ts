import express from 'express';
import { AuthMiddleware, upload, ValidationMiddleware } from '../../middlewares';
import { ProfileController } from '../../controllers';
import schemas from '../../schemas';

const router = express.Router();

// ========================================================================================================= //
// ========================================== Profile Routes ===============================================
// ========================================================================================================= //

// Profile : GET /api/v1/profile
router.route('/profile').get(AuthMiddleware.checkAuth, ProfileController.profile);

// Update Profile : PUT /api/v1/profile
router
    .route('/profile')
    .put(
        AuthMiddleware.checkAuth,
        upload.single('profile'),
        ValidationMiddleware.validateRequest(schemas.updateProfileSchema),
        ProfileController.update,
    );

// Get Instructor Data: GET /api/v1/dashboard/instructor
router.route('/dashboard/instructor').get(AuthMiddleware.checkAuth, ProfileController.getInstructorData);

export default router;
