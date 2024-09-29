import express from 'express';
import ApiController from '../../controllers/api.controller';

const router = express.Router();

router.route('/self').get(ApiController.self);

export default router;
