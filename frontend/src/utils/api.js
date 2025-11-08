import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Don't redirect if we're already on login/register endpoints
      const isAuthEndpoint = error.config?.url?.includes('/auth/login') || 
                             error.config?.url?.includes('/auth/register');
      
      // Don't redirect for login/register errors - let the component handle it
      if (isAuthEndpoint) {
        return Promise.reject(error);
      }
      
      // For other 401/403 errors, redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Store error message if available
      if (error.response?.data?.message) {
        sessionStorage.setItem('authError', error.response.data.message);
      }
      
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Order API functions
export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getOrders = async (status = null) => {
  const params = status ? { status } : {};
  const response = await api.get('/orders', { params });
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

export const uploadPaymentProof = async (orderId, paymentUrl) => {
  const response = await api.post(`/orders/${orderId}/payment`, { url: paymentUrl });
  return response.data;
};

// Admin order functions
export const getAllOrdersAdmin = async (status = null, userId = null) => {
  const params = {};
  if (status) params.status = status;
  if (userId) params.userId = userId;
  const response = await api.get('/admin/orders', { params });
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.patch(`/admin/orders/${orderId}/status`, { status });
  return response.data;
};

// User API functions
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.patch('/users/profile', profileData);
  return response.data;
};

export const uploadDocument = async (documentType, file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post(`/users/documents/${documentType}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Update payment proof to use file upload
export const uploadPaymentProofFile = async (orderId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post(`/orders/${orderId}/payment`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Auth API functions
export const verifyEmail = async (token) => {
  const response = await api.get(`/auth/verify-email/${token}`);
  return response.data;
};

export const resendVerification = async () => {
  const response = await api.post('/auth/resend-verification');
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await api.post(`/auth/reset-password/${token}`, { password });
  return response.data;
};

export default api;

