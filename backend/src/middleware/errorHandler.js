import { apiResponse } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack, path: req.path });

  if (err.type === 'entity.parse.failed') {
    return apiResponse.error(res, 'Invalid JSON body', 'INVALID_JSON', {}, 400);
  }

  return apiResponse.error(res, 'Internal server error', 'INTERNAL_ERROR', {}, 500);
};
