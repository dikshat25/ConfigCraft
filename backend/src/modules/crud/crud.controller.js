import { crudService } from './crud.service.js';
import { apiResponse } from '../../utils/apiResponse.js';

export const crudController = {
  async createRecord(req, res, next) {
    try {
      const result = await crudService.createRecord(req.user.id, req.dynamicConfigId, req.body);
      return apiResponse.success(res, result, 201);
    } catch (err) {
      if (err.code === 'VALIDATION_ERROR') return apiResponse.error(res, err.message, err.code, err.details, 422);
      if (err.code === 'NOT_FOUND') return apiResponse.error(res, err.message, err.code, {}, 404);
      next(err);
    }
  },

  async listRecords(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const sort = req.query.sort || 'createdAt';
      const order = req.query.order === 'asc' ? 'asc' : 'desc';

      const result = await crudService.listRecords(req.user.id, req.dynamicConfigId, {
        page: page > 0 ? page : 1,
        limit: limit > 0 ? limit : 10,
        sort,
        order
      });
      return apiResponse.success(res, result);
    } catch (err) {
      if (err.code === 'NOT_FOUND') return apiResponse.error(res, err.message, err.code, {}, 404);
      next(err);
    }
  },

  async getRecord(req, res, next) {
    try {
      const result = await crudService.getRecord(req.user.id, req.dynamicConfigId, req.params.id);
      return apiResponse.success(res, result);
    } catch (err) {
      if (err.code === 'NOT_FOUND') return apiResponse.error(res, err.message, err.code, {}, 404);
      next(err);
    }
  },

  async updateRecord(req, res, next) {
    try {
      const result = await crudService.updateRecord(req.user.id, req.dynamicConfigId, req.params.id, req.body);
      return apiResponse.success(res, result);
    } catch (err) {
      if (err.code === 'VALIDATION_ERROR') return apiResponse.error(res, err.message, err.code, err.details, 422);
      if (err.code === 'NOT_FOUND') return apiResponse.error(res, err.message, err.code, {}, 404);
      next(err);
    }
  },

  async deleteRecord(req, res, next) {
    try {
      await crudService.deleteRecord(req.user.id, req.dynamicConfigId, req.params.id);
      return apiResponse.success(res, { deleted: true });
    } catch (err) {
      if (err.code === 'NOT_FOUND') return apiResponse.error(res, err.message, err.code, {}, 404);
      next(err);
    }
  }
};
