import { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, register as apiRegister, getCurrentUser, logout as apiLogout } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    // Get stored user from localStorage
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Load user from token if exists
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await getCurrentUser();
      const userData = response.data.data;
      
      // Update localStorage with fresh user data
      localStorage.setItem('user', JSON.stringify(userData));
      
      setCurrentUser(userData);
      setError(null);
    } catch (err) {
      // Clear localStorage on authentication failure
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      setError(err.response?.data?.error || 'Failed to authenticate');
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await apiRegister(userData);
      
      // Save auth data to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setCurrentUser(response.data.user);
      
      // Navigate to dashboard after successful registration
      navigate('/dashboard');
      return response.data;
    } catch (err) {
      console.error('Register error details:', err.response?.data);
      
      let errorMessage = 'Registration failed';
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.errors && err.response.data.errors.length > 0) {
        errorMessage = err.response.data.errors[0].msg;
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };// Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await apiLogin(email, password);
      
      // Save auth data to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setCurrentUser(response.data.user);
      setError(null);
      
      // Navigate to dashboard after successful login
      navigate('/dashboard');
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };  // Logout user
  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all auth data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      setCurrentUser(null);
      
      // Navigate to home page after logout
      navigate('/');
    }
  };

  // Clear errors
  const clearErrors = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        error,
        register,
        login,
        logout,
        clearErrors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
