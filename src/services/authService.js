import api from './api';

export const authService = {
  // Signup new user
  signup: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data; // Returns { success, message, token, user }
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data; // Returns { success, message, token, user }
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data; // Returns { success, user }
  }
};
