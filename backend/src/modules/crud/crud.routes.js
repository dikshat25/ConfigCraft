import express from 'express';
import { crudController } from './crud.controller.js';

const router = express.Router();

router.post('/records', crudController.createRecord);
router.get('/records', crudController.listRecords);
router.get('/records/:id', crudController.getRecord);
router.put('/records/:id', crudController.updateRecord);
router.delete('/records/:id', crudController.deleteRecord);

export default router;
