import { jwtDecode } from 'jwt-decode';

export const getToken = () => {
  return localStorage.getItem('token');
};

// BroadcastChannel for cross-tab communication (more reliable than storage events)
let authChannel = null;
if (typeof window !== 'undefined' && window.BroadcastChannel) {
  authChannel = new BroadcastChannel('auth-sync');
}

export const setToken = (token) => {
  localStorage.setItem('token', token);
  // Notify other tabs via BroadcastChannel
  if (authChannel) {
    authChannel.postMessage({ type: 'tokenChanged', token });
  }
};

export const removeToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Notify other tabs via BroadcastChannel
  if (authChannel) {
    authChannel.postMessage({ type: 'tokenRemoved' });
  }
};

export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const setUser = (user) => {
  const userStr = JSON.stringify(user);
  localStorage.setItem('user', userStr);
  // Notify other tabs via BroadcastChannel
  if (authChannel) {
    authChannel.postMessage({ type: 'userChanged', user });
  }
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

