import { apiResponse } from '../utils/apiResponse.js';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      return apiResponse.error(res, 'Validation error', 'VALIDATION_ERROR', err.errors, 400);
    }
  };
};
