import express from 'express';
import { csvController } from './csv.controller.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = express.Router();

router.use(authenticate);
router.post('/upload', csvController.upload);

export default router;
