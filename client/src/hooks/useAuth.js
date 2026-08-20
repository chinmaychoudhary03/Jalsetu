import { useState } from 'react';
import useAuthStore from '../store/authStore';
import api from '../lib/axios';

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login, logout, user, isAuthenticated } = useAuthStore();

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', credentials);
      login(response.data.token, response.data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login: handleLogin,
    logout
  };
};

export default useAuth;
