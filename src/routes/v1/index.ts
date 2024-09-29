import express from 'express';
import ApiController from '../../controllers/api-controller';

const router = express.Router();

router.route('/self').get(ApiController.self);
router.route('/health').get(ApiController.health);

export default router;
