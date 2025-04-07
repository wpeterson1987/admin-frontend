import axios from 'axios';
import { getToken } from './auth';

const API_URL = process.env.REACT_APP_API_URL || 'https://tasks.valortek.com/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API functions for authentication
export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

// API functions for affiliate networks (mock for now)
export const getNetworks = async () => {
  // Uncomment to use real API once backend is ready
  // const response = await api.get('/admin/affiliate-networks');
  // return response.data;

  // Mock data for initial testing
  return {
    success: true,
    networks: [
      {
        id: 1,
        name: 'amazon',
        display_name: 'Amazon Associates',
        affiliate_id: 'example-20',
        is_active: true,
        base_commission_rate: 3.5
      },
      {
        id: 2,
        name: 'walmart',
        display_name: 'Walmart Affiliate',
        affiliate_id: 'affiliate123',
        is_active: true,
        base_commission_rate: 4.0
      }
    ]
  };
};

// Get all users
export const getUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

// Get a single user
export const getUser = async (userId) => {
  const response = await api.get(`/admin/users/${userId}`);
  return response.data;
};

// Create a new user
export const createUser = async (userData) => {
  const response = await api.post('/admin/users', userData);
  return response.data;
};

// Update a user
export const updateUser = async (userId, userData) => {
  const response = await api.put(`/admin/users/${userId}`, userData);
  return response.data;
};

// Delete a user
export const deleteUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

// Change user password
export const changeUserPassword = async (userId, passwordData) => {
  const response = await api.put(`/admin/users/${userId}/password`, passwordData);
  return response.data;
};

export default api;