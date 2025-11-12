import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://project-planner-backend-iz69.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if:
    // 1. Status is 401 AND
    // 2. User is already logged in (has a token) AND
    // 3. It's NOT a login/signup request
    if (error.response?.status === 401) {
      const isAuthRequest = error.config.url.includes('/auth/login') || 
                           error.config.url.includes('/auth/register');
      
      // Only redirect if user was already logged in and token expired
      // NOT for failed login attempts
      if (!isAuthRequest && localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
