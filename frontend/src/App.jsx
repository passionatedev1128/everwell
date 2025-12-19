import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';
import FloatingCartButton from './components/FloatingCartButton';
import LoadingBar from './components/LoadingBar';
import PageTransition from './components/PageTransition';
import HubspotTracker from './components/HubspotTracker';
import { CartProvider } from './context/CartContext';
import { trackPageView } from './utils/analytics';
import { trackPageView as gtmTrackPageView } from './utils/gtm';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import Doubts from './pages/Doubts';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Login from './pages/Login';
import Admin from './pages/Admin';
import UserDetail from './pages/UserDetail';
import ProductDetail from './pages/ProductDetail';
import Dashboard from './pages/Dashboard';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import VerifyEmail from './pages/VerifyEmail';
import CompleteRegistration from './pages/CompleteRegistration';
import ResetPassword from './pages/ResetPassword';
import OAuthCallback from './pages/OAuthCallback';
import Booking from './pages/Booking';

// Component to track page views
function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    trackPageView(location.pathname + location.search, document.title);
    gtmTrackPageView(location.pathname + location.search, document.title);
    
    // HubSpot manual page tracking for SPA route changes
    // HubSpot does NOT auto-track SPAs, so we need to manually notify on every route change
    if (window._hsq) {
      window._hsq.push(['setPath', window.location.pathname]);
      window._hsq.push(['trackPageView']);
    }
  }, [location]);

  return null;
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const authStateRef = useRef(null);
  const isHandlingAuthChangeRef = useRef(false);

  useEffect(() => {
    // Check token expiration on mount
    let initialToken = localStorage.getItem('token');
    if (initialToken) {
      try {
        const { exp } = JSON.parse(atob(initialToken.split('.')[1]));
        if (exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          initialToken = null;
        }
      } catch (error) {
        console.error('Token validation error:', error);
      }
    }
    
    // Store initial auth state for comparison
    const initialAuthState = !!initialToken;
    authStateRef.current = initialAuthState;
    
    // Listen for storage changes to sync authentication state across tabs
    // Storage events only fire in OTHER tabs when localStorage changes, not the current tab
    const handleStorageChange = (e) => {
      // Only handle storage events from other tabs (e.key will be 'token' or 'user')
      if ((e.key === 'token' || e.key === 'user') && !isHandlingAuthChangeRef.current) {
        isHandlingAuthChangeRef.current = true;
        
        // Small delay to ensure localStorage is updated
        setTimeout(() => {
          const newToken = localStorage.getItem('token');
          const newAuthState = !!newToken;
          const oldAuthState = authStateRef.current;
          
          // Only navigate if auth state actually changed
          if (oldAuthState !== newAuthState) {
            authStateRef.current = newAuthState;
            
            // Dispatch custom event to update UI components (like Header)
            // Don't reload page - just update the UI state
            window.dispatchEvent(new CustomEvent('authStateChanged', { 
              detail: { isAuthenticated: newAuthState } 
            }));
          } else {
            // Even if auth state didn't change, dispatch event to update UI
            // (in case user data was updated)
            window.dispatchEvent(new CustomEvent('authStateChanged', { 
              detail: { isAuthenticated: newAuthState } 
            }));
          }
          
          isHandlingAuthChangeRef.current = false;
        }, 100);
      }
    };
    
    // Listen for BroadcastChannel messages (more reliable cross-tab communication)
    const handleBroadcastMessage = (e) => {
      if ((e.data.type === 'tokenChanged' || e.data.type === 'tokenRemoved' || e.data.type === 'userChanged') && !isHandlingAuthChangeRef.current) {
        isHandlingAuthChangeRef.current = true;
        
        setTimeout(() => {
          const newToken = localStorage.getItem('token');
          const newAuthState = !!newToken;
          const oldAuthState = authStateRef.current;
          
          if (oldAuthState !== newAuthState) {
            authStateRef.current = newAuthState;
            
            // Dispatch custom event to update UI components (like Header)
            // Don't reload page - just update the UI state
            window.dispatchEvent(new CustomEvent('authStateChanged', { 
              detail: { isAuthenticated: newAuthState } 
            }));
          }
          
          isHandlingAuthChangeRef.current = false;
        }, 100);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Set up BroadcastChannel listener
    let authChannel = null;
    if (window.BroadcastChannel) {
      authChannel = new BroadcastChannel('auth-sync');
      authChannel.addEventListener('message', handleBroadcastMessage);
    }
    
    // Show loading animation
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (authChannel) {
        authChannel.removeEventListener('message', handleBroadcastMessage);
        authChannel.close();
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5faf7] via-white to-primary/5">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-primary/10 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" style={{ animationDuration: '0.8s' }}></div>
            <div className="absolute inset-2 border-2 border-primary/20 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-primary rounded-lg opacity-80 animate-pulse"></div>
            </div>
          </div>
          <p className="text-primary font-semibold text-lg mb-2 animate-pulse">EverWell</p>
          <p className="text-mediumTeal font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <HubspotTracker />
      <CartProvider>
        <LoadingBar />
        <ScrollToTop />
        <PageViewTracker />
        <div className="min-h-screen flex flex-col bg-[#f5faf7]">
          <Header />
          <main className="flex-grow pt-16 sm:pt-20">
            <PageTransition>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/duvidas" element={<Doubts />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/login" element={<Login />} />
                <Route path="/verify-email/:token" element={<VerifyEmail />} />
                <Route path="/complete-registration/:token" element={<CompleteRegistration />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/auth/callback" element={<OAuthCallback />} />
                <Route path="/agendar" element={<Booking />} />
                <Route
                  path="/produtos"
                  element={
                    <ProtectedRoute requireAuth>
                      <Products />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/produtos/:slug"
                  element={
                    <ProtectedRoute requireAuth>
                      <ProductDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute requireAuth>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/carrinho"
                  element={
                    <ProtectedRoute requireAuth requireAuthorization>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute requireAuth requireAuthorization>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pedidos"
                  element={
                    <ProtectedRoute requireAuth requireAuthorization>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAuth requireAdmin>
                      <Admin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users/:userId"
                  element={
                    <ProtectedRoute requireAuth requireAdmin>
                      <UserDetail />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </PageTransition>
          </main>
          <Footer />
          <FloatingCartButton />
          <ScrollToTopButton />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;

