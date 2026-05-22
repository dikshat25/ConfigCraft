import express from 'express';
import { authController } from './auth.controller.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { authenticate } from '../../middleware/authenticate.js';
import { signupSchema, loginSchema } from './auth.validator.js';

const router = express.Router();

router.post('/signup', validateRequest(signupSchema), authController.signup);
router.post('/login', validateRequest(loginSchema), authController.login);
router.get('/me', authenticate, authController.me);

export default router;
