import { useState, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services';

export function useAuth() {
  const { user, token, isAuthenticated, login, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await authService.login(credentials);
      login(data.user, data.token);
      return data;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [login]);

  const handleSignup = useCallback(async (details) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await authService.signup(details);
      login(data.user, data.token);
      return data;
    } catch (err) {
      setError(err.message || 'Signup failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [login]);

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login: handleLogin,
    signup: handleSignup,
    logout
  };
}
