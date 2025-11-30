import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Log API URL in development to help debug
if (import.meta.env.MODE === 'development') {
  console.log('API URL:', API_URL);
}

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
      
      // Public routes that should not trigger redirects
      const publicRoutes = ['/', '/duvidas', '/blog', '/login', '/reset-password', '/auth/callback', '/agendar'];
      const currentPath = window.location.pathname;
      const isPublicRoute = publicRoutes.some(route => currentPath === route) || 
                           currentPath.startsWith('/blog/') ||
                           currentPath.startsWith('/verify-email/') ||
                           currentPath.startsWith('/complete-registration/');
      
      // Check if user was deleted (404 on /auth/me endpoint)
      if (error.response?.status === 404 && error.config?.url?.includes('/auth/me')) {
        // User no longer exists - clear session
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Only redirect if not on a public route
        if (!isPublicRoute && currentPath !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
      
      // For other 401/403 errors, only redirect if not on a public route
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Store error message if available
      if (error.response?.data?.message) {
        sessionStorage.setItem('authError', error.response.data.message);
      }
      
      // Only redirect if not on a public route and not already on login page
      if (!isPublicRoute && currentPath !== '/login') {
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

export const completeRegistration = async (token, userData) => {
  const response = await api.post(`/auth/complete-registration/${token}`, userData);
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

// Admin Product API functions
export const getAllProductsAdmin = async () => {
  const response = await api.get('/admin/products');
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post('/admin/products', productData);
  return response.data;
};

export const updateProduct = async (productId, productData) => {
  const response = await api.patch(`/admin/products/${productId}`, productData);
  return response.data;
};

export const deleteProduct = async (productId) => {
  const response = await api.delete(`/admin/products/${productId}`);
  return response.data;
};

export const uploadProductImages = async (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('images', file);
  });
  
  const response = await api.post('/admin/products/upload-images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Feedback API functions
export const createFeedback = async (feedbackData) => {
  const response = await api.post('/feedback', feedbackData);
  return response.data;
};

// User photo upload
export const uploadUserPhoto = async (file) => {
  const formData = new FormData();
  formData.append('photo', file);
  
  const response = await api.post('/users/photo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Blog API functions (Admin)
export const getAllBlogsAdmin = async () => {
  const response = await api.get('/blogs/admin/all');
  return response.data;
};

export const getBlogById = async (blogId) => {
  const response = await api.get(`/blogs/admin/${blogId}`);
  return response.data;
};

export const createBlog = async (blogData) => {
  const response = await api.post('/blogs/admin', blogData);
  return response.data;
};

export const updateBlog = async (blogId, blogData) => {
  const response = await api.patch(`/blogs/admin/${blogId}`, blogData);
  return response.data;
};

export const deleteBlog = async (blogId) => {
  const response = await api.delete(`/blogs/admin/${blogId}`);
  return response.data;
};

// Feedback API functions (Admin)
export const getAllFeedbacksAdmin = async (status = null) => {
  const params = status && status !== 'all' ? { status } : {};
  const response = await api.get('/feedback', { params });
  return response.data;
};

export const updateFeedbackStatus = async (feedbackId, status, response) => {
  const response_data = await api.patch(`/feedback/${feedbackId}/status`, { status, response });
  return response_data.data;
};

export const deleteFeedback = async (feedbackId) => {
  const response = await api.delete(`/feedback/${feedbackId}`);
  return response.data;
};

// Notification API functions
export const getNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await api.patch(`/notifications/${notificationId}/read`);
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await api.patch('/notifications/read-all');
  return response.data;
};

// Admin notification/message functions
export const getAllNotificationsAdmin = async (userId = null, read = null) => {
  const params = {};
  if (userId) params.userId = userId;
  if (read !== null) params.read = read;
  const response = await api.get('/notifications/admin/all', { params });
  return response.data;
};

export const createNotificationAdmin = async (notificationData) => {
  const response = await api.post('/notifications/admin', notificationData);
  return response.data;
};

export const sendNotificationToAllUsers = async (notificationData) => {
  const response = await api.post('/notifications/admin/send-all', notificationData);
  return response.data;
};

export const updateNotificationAdmin = async (notificationId, notificationData) => {
  const response = await api.patch(`/notifications/admin/${notificationId}`, notificationData);
  return response.data;
};

export const deleteNotificationAdmin = async (notificationId) => {
  const response = await api.delete(`/notifications/admin/${notificationId}`);
  return response.data;
};

// Admin user password update
export const updateUserPasswordAdmin = async (userId, password) => {
  const response = await api.patch(`/admin/users/${userId}/password`, { password });
  return response.data;
};

// Admin document management
export const updateDocumentStatus = async (userId, documentType, status) => {
  const response = await api.patch('/admin/users/documents/status', {
    userId,
    documentType,
    status
  });
  return response.data;
};

export default api;

