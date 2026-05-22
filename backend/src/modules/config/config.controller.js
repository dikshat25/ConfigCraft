import { configService } from './config.service.js';
import { apiResponse } from '../../utils/apiResponse.js';
import { logger } from '../../utils/logger.js';

export const configController = {
  async createConfig(req, res, next) {
    try {
      const result = await configService.createConfig(req.user.id, req.body);
      logger.info('Config created', { userId: req.user.id, configId: result.id });
      return apiResponse.success(res, result, 201);
    } catch (err) {
      next(err);
    }
  },

  async listConfigs(req, res, next) {
    try {
      const result = await configService.listConfigs(req.user.id);
      return apiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  },

  async getConfig(req, res, next) {
    try {
      const result = await configService.getConfig(req.user.id, req.params.id);
      return apiResponse.success(res, result);
    } catch (err) {
      if (err.code === 'NOT_FOUND') return apiResponse.error(res, err.message, err.code, {}, 404);
      if (err.code === 'FORBIDDEN') return apiResponse.error(res, err.message, err.code, {}, 403);
      next(err);
    }
  },

  async updateConfig(req, res, next) {
    try {
      const result = await configService.updateConfig(req.user.id, req.params.id, req.body);
      logger.info('Config updated', { userId: req.user.id, configId: result.id });
      return apiResponse.success(res, result);
    } catch (err) {
      if (err.code === 'NOT_FOUND') return apiResponse.error(res, err.message, err.code, {}, 404);
      if (err.code === 'FORBIDDEN') return apiResponse.error(res, err.message, err.code, {}, 403);
      next(err);
    }
  },

  async deleteConfig(req, res, next) {
    try {
      await configService.deleteConfig(req.user.id, req.params.id);
      logger.info('Config deleted', { userId: req.user.id, configId: req.params.id });
      return apiResponse.success(res, { deleted: true });
    } catch (err) {
      if (err.code === 'NOT_FOUND') return apiResponse.error(res, err.message, err.code, {}, 404);
      if (err.code === 'FORBIDDEN') return apiResponse.error(res, err.message, err.code, {}, 403);
      next(err);
    }
  }
};
