import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import { trackPageView } from './utils/analytics';
import { trackPageView as hubspotTrackPageView } from './utils/hubspot';
import { trackPageView as gtmTrackPageView } from './utils/gtm';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import Doubts from './pages/Doubts';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Login from './pages/Login';
import Admin from './pages/Admin';
import ProductDetail from './pages/ProductDetail';
import Dashboard from './pages/Dashboard';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import OAuthCallback from './pages/OAuthCallback';
import Booking from './pages/Booking';

// Component to track page views
function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    trackPageView(location.pathname + location.search, document.title);
    hubspotTrackPageView();
    gtmTrackPageView(location.pathname + location.search, document.title);
  }, [location]);

  return null;
}

function App() {
  useEffect(() => {
    // Check token expiration on mount
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { exp } = JSON.parse(atob(token.split('.')[1]));
        if (exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Token validation error:', error);
      }
    }
  }, []);

  return (
    <CartProvider>
      <Router>
        <PageViewTracker />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/duvidas" element={<Doubts />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/login" element={<Login />} />
                  <Route path="/verify-email/:token" element={<VerifyEmail />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/auth/callback" element={<OAuthCallback />} />
                  <Route path="/agendar" element={<Booking />} />
              <Route
                path="/produtos"
                element={
                  <ProtectedRoute requireAuth requireAuthorization>
                    <Products />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/produtos/:slug"
                element={
                  <ProtectedRoute requireAuth requireAuthorization>
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
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;

