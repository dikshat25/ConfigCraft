import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (!error.response) {
      toast.error('Cannot reach server');
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    
    if (status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    } else if (status === 422) {
      // Let the component handle inline validation errors
    } else if (status >= 500) {
      toast.error('Something went wrong on our end');
    }

    return Promise.reject(data.error || error);
  }
);

export default api;
