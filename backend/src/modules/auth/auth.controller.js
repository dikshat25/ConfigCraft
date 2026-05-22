import { authService } from './auth.service.js';
import { apiResponse } from '../../utils/apiResponse.js';
import { logger } from '../../utils/logger.js';

export const authController = {
  async signup(req, res, next) {
    try {
      const result = await authService.signup(req.body);
      logger.info('User signed up', { userId: result.user.id });
      return apiResponse.success(res, result, 201);
    } catch (err) {
      if (err.code === 'EMAIL_IN_USE') {
        return apiResponse.error(res, err.message, err.code, {}, 400);
      }
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      logger.info('User logged in', { userId: result.user.id });
      return apiResponse.success(res, result);
    } catch (err) {
      if (err.code === 'INVALID_CREDENTIALS') {
        return apiResponse.error(res, err.message, err.code, {}, 401);
      }
      next(err);
    }
  },

  async me(req, res, next) {
    return apiResponse.success(res, {
      user: { id: req.user.id, email: req.user.email, name: req.user.name }
    });
  }
};
