/**
 * Standardize API responses
 */
export const apiResponse = {
  success: (res, data, status = 200) => {
    return res.status(status).json({
      success: true,
      data
    });
  },

  error: (res, message, code = 'INTERNAL_ERROR', details = {}, status = 500) => {
    return res.status(status).json({
      success: false,
      error: {
        message,
        code,
        details
      }
    });
  }
};
