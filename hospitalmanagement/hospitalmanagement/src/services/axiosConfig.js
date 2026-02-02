import axios from 'axios';

// Set base URL from env or default to local backend
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
axios.defaults.withCredentials = true;

// Attach Authorization header when token exists
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Suppress warnings for backend API calls when backend is unavailable
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error && (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED')) {
      return Promise.resolve({ data: [] });
    }
    return Promise.reject(error);
  }
);

export default axios;
