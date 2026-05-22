import api from './api';

export const authService = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

export const configService = {
  list: () => api.get('/configs'),
  get: (id) => api.get(`/configs/${id}`),
  create: (data) => api.post('/configs', data),
  update: (id, data) => api.put(`/configs/${id}`, data),
  delete: (id) => api.delete(`/configs/${id}`),
};

export const crudService = {
  list: (configId, params) => api.get(`/apps/${configId}/records`, { params }),
  create: (configId, data) => api.post(`/apps/${configId}/records`, data),
  get: (configId, recordId) => api.get(`/apps/${configId}/records/${recordId}`),
  update: (configId, recordId, data) => api.put(`/apps/${configId}/records/${recordId}`, data),
  delete: (configId, recordId) => api.delete(`/apps/${configId}/records/${recordId}`),
};

export const csvService = {
  upload: (data) => api.post('/csv/upload', data)
};
