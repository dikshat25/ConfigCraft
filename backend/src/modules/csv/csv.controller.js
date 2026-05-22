import { csvService } from './csv.service.js';
import { apiResponse } from '../../utils/apiResponse.js';
import { logger } from '../../utils/logger.js';

export const csvController = {
  async upload(req, res, next) {
    try {
      const result = await csvService.importCsv(req.user.id, req.body);
      logger.info('CSV imported', { userId: req.user.id, total: result.total, imported: result.imported });
      
      // If no data rows found error
      if (result.total === 0) {
        return apiResponse.success(res, { total: 0, imported: 0, message: "No data rows found" });
      }

      return apiResponse.success(res, result);
    } catch (err) {
      if (err.code === 'CSV_IMPORT_ERROR') {
        return apiResponse.success(res, { total: 0, imported: 0, message: err.message });
      }
      if (err.code === 'FORBIDDEN') {
        return apiResponse.error(res, err.message, err.code, {}, 403);
      }
      next(err);
    }
  }
};
