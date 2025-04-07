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

// Add these functions to your api.js file

// Get all families (for admin use)
export const getAllFamilies = async () => {
  const response = await api.get('/admin/families');
  return response.data;
};

// Get user's families
export const getUserFamilies = async (userId) => {
  const response = await api.get(`/admin/users/${userId}/families`);
  return response.data;
};

// Add user to a family
export const addUserToFamily = async (familyId, userId, roleData) => {
  const response = await api.post(`/admin/families/${familyId}/members`, {
    user_id: userId,
    role: roleData.role || 'member',
    is_admin: roleData.is_admin || false
  });
  return response.data;
};

// Remove user from a family
export const removeUserFromFamily = async (familyId, userId) => {
  // This endpoint would need to be created on the backend
  const response = await api.delete(`/admin/families/${familyId}/members/${userId}`);
  return response.data;
};

// Update user's role in a family
export const updateUserFamilyRole = async (familyId, userId, roleData) => {
  // This endpoint would need to be created on the backend
  const response = await api.put(`/admin/families/${familyId}/members/${userId}`, {
    role: roleData.role,
    is_admin: roleData.is_admin
  });
  return response.data;
};

// Get families the user is not a member of yet
export const getAvailableFamilies = async (userId) => {
  // This endpoint would need to be created on the backend
  const response = await api.get(`/admin/users/${userId}/available-families`);
  return response.data;
};

// Create a new family
export const createFamily = async (familyData) => {
  const response = await api.post('/admin/families', familyData);
  return response.data;
};

// Update a family
export const updateFamily = async (familyId, familyData) => {
  const response = await api.put(`/admin/families/${familyId}`, familyData);
  return response.data;
};

// Delete a family
export const deleteFamily = async (familyId) => {
  const response = await api.delete(`/admin/families/${familyId}`);
  return response.data;
};

// Get family details
export const getFamilyDetails = async (familyId) => {
  const response = await api.get(`/admin/families/${familyId}`);
  return response.data;
};

export default api;