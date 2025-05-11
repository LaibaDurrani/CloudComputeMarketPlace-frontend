import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include the auth token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API calls
export const register = (userData) => api.post('/api/auth/register', userData);
export const login = (email, password) => api.post('/api/auth/login', { email, password });
export const logout = () => api.get('/api/auth/logout');
export const getCurrentUser = () => api.get('/api/auth/me');

// Profile API calls
export const updateProfile = (profileData) => api.put('/api/profile', profileData);
export const updatePassword = (passwordData) => api.put('/api/profile/password', passwordData);
export const deleteAccount = () => api.delete('/api/profile');
export const getUserComputers = () => api.get('/api/profile/computers');
export const getUserRentals = () => api.get('/api/profile/rentals');
export const getRentedOutComputers = () => api.get('/api/profile/rentedout');

// Computers API calls
export const getAllComputers = () => api.get('/api/computers');
export const getComputer = (id) => api.get(`/api/computers/${id}`);
export const createComputer = (computerData) => api.post('/api/computers', computerData);
export const updateComputer = (id, computerData) => api.put(`/api/computers/${id}`, computerData);
export const deleteComputer = (id) => api.delete(`/api/computers/${id}`);

// Rentals API calls
export const createRental = async (rentalData) => {
  try {
    console.log('Creating rental with data:', rentalData);
    const response = await api.post('/api/rentals', rentalData);
    console.log('Rental creation successful:', response.data);
    return response;
  } catch (error) {
    console.error('Rental creation error:', error.response?.data || error.message);
    throw error;
  }
};
export const getRental = (id) => api.get(`/api/rentals/${id}`);
export const updateRentalStatus = (id, status) => api.put(`/api/rentals/${id}`, { status });
export const addRentalAccessDetails = (id, accessDetails) => api.put(`/api/rentals/${id}/access`, accessDetails);

export default api;
