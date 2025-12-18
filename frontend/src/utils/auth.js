import { jwtDecode } from 'jwt-decode';

export const getToken = () => {
  return localStorage.getItem('token');
};

// Helper to dispatch storage event for cross-tab sync
const dispatchStorageEvent = (key, newValue) => {
  // Dispatch storage event manually to notify other tabs
  window.dispatchEvent(new StorageEvent('storage', {
    key: key,
    newValue: newValue,
    oldValue: localStorage.getItem(key),
    storageArea: localStorage,
    url: window.location.href
  }));
};

export const setToken = (token) => {
  localStorage.setItem('token', token);
  dispatchStorageEvent('token', token);
};

export const removeToken = () => {
  const oldToken = localStorage.getItem('token');
  const oldUser = localStorage.getItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  dispatchStorageEvent('token', null);
  dispatchStorageEvent('user', null);
};

export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const setUser = (user) => {
  const userStr = JSON.stringify(user);
  localStorage.setItem('user', userStr);
  dispatchStorageEvent('user', userStr);
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch {
    return false;
  }
};

export const isAuthorized = () => {
  const user = getUser();
  return user?.isAuthorized === true;
};

export const isAdmin = () => {
  const user = getUser();
  return user?.role === 'admin';
};

// Session timeout (30 minutes of inactivity)
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
let sessionTimeoutId = null;

export const resetSessionTimeout = () => {
  // Clear existing timeout
  if (sessionTimeoutId) {
    clearTimeout(sessionTimeoutId);
  }

  // Set new timeout
  sessionTimeoutId = setTimeout(() => {
    // Session expired - clear token and user
    removeToken();
    // Redirect to login if on protected page
    if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
      window.location.href = '/login';
    }
  }, SESSION_TIMEOUT);
};

// Initialize session timeout on user activity
if (typeof window !== 'undefined') {
  // Reset timeout on any user activity
  ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetSessionTimeout, { passive: true });
  });

  // Reset timeout on page load if authenticated
  if (isAuthenticated()) {
    resetSessionTimeout();
  }
}

