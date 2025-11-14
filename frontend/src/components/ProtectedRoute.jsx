import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAuthorized, isAdmin } from '../utils/auth';

const ProtectedRoute = ({ children, requireAuth = false, requireAuthorization = false, requireAdmin = false }) => {
  // Check authorization first before rendering anything
  if (requireAuth && !isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requireAuthorization && !isAuthorized()) {
    // Don't show the page, redirect immediately
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

