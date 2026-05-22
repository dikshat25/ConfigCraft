import express from 'express';
import { configController } from './config.controller.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = express.Router();

router.use(authenticate);

router.post('/', configController.createConfig);
router.get('/', configController.listConfigs);
router.get('/:id', configController.getConfig);
router.put('/:id', configController.updateConfig);
router.delete('/:id', configController.deleteConfig);

export default router;
