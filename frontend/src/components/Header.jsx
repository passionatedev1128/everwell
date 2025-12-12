import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { isAuthenticated, getUser, removeToken, setUser } from '../utils/auth';
import { getCurrentUser } from '../utils/api';
import { useCart } from '../context/CartContext';
import FeedbackModal from './FeedbackModal';
import NotificationBell from './NotificationBell';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const accountMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const authenticated = isAuthenticated();
  const [user, setUserState] = useState(getUser());
  const { getCartItemsCount } = useCart();
  const cartCount = getCartItemsCount();

  // Helper function to check if user has a valid photo
  const hasValidPhoto = (user) => {
    return user?.photo && 
           typeof user.photo === 'string' && 
           user.photo.trim() !== '' && 
           user.photo !== 'null' && 
           user.photo !== 'undefined';
  };

  // Fetch fresh user data from API when component mounts and user is authenticated
  useEffect(() => {
    const fetchUserData = async () => {
      if (authenticated) {
        try {
          const response = await getCurrentUser();
          if (response.success && response.user) {
            // Update localStorage with fresh user data (including photo)
            setUser(response.user);
            setUserState(response.user);
          }
        } catch (error) {
          // Silently fail - use localStorage data as fallback
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [authenticated]);

  // Listen for user updates
  useEffect(() => {
    const handleUserUpdate = () => {
      const updatedUser = getUser();
      setUserState(updatedUser);
    };
    window.addEventListener('userUpdated', handleUserUpdate);
    // Also refresh on location change (in case user data was updated elsewhere)
    const interval = setInterval(() => {
      const currentUser = getUser();
      if (JSON.stringify(currentUser) !== JSON.stringify(user)) {
        setUserState(currentUser);
      }
    }, 1000);
    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate);
      clearInterval(interval);
    };
  }, [user]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Produtos', path: '/produtos' },
    { label: 'Dúvidas', path: '/duvidas' },
    { label: 'Blog', path: '/blog' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    removeToken();
    navigate('/');
    setIsMenuOpen(false);
    setIsAccountMenuOpen(false);
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    
    // Check if current path matches
    if (location.pathname.startsWith(path)) {
      return true;
    }
    
    // Special handling for protected routes when not authenticated
    // If user is on login page and was redirected from a protected route, show it as active
    if (location.pathname === '/login' && !authenticated) {
      const state = location.state;
      if (state && (state.from === path || state.redirect === path)) {
        return true;
      }
    }
    
    return false;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary/10 backdrop-blur-xl border-b-2 border-primary/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="flex items-center justify-center rounded-lg text-white font-semibold text-base sm:text-lg" style={{ width: "148px" }}>
              <img src = "/logos/logo_everwell_colored.png" />
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 mx-8">
            {navLinks.map((link) => {
              // Check if user is authenticated for product link
              const isProductLink = link.path === '/produtos';
              const shouldShowActive = isActive(link.path);
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  state={link.path === '/produtos' && !authenticated ? { from: link.path } : undefined}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 relative ${
                    shouldShowActive
                      ? 'text-[rgb(79,179,168)] border-b-2 border-[rgb(79,179,168)] pb-2'
                      : 'text-[rgb(79,179,168)]/80 hover:text-[rgb(79,179,168)] hover:bg-[rgb(79,179,168)]/10'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {authenticated && (
              <>
                <button
                  onClick={() => setIsFeedbackModalOpen(true)}
                  className="px-3 py-2 text-sm font-medium text-[rgb(79,179,168)]/80 hover:text-[rgb(79,179,168)] transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-md rounded-md"
                  title="Deixe seu feedback"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  Feedback
                </button>
              </>
            )}
              {authenticated ? (
              <div className="flex items-center gap-2">
                <NotificationBell />
                <div className="relative" ref={accountMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsAccountMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/10 transition-all duration-300 group"
                  >
                  {hasValidPhoto(user) ? (
                    <img 
                      src={user.photo} 
                      alt={user?.name || 'User'} 
                      className="w-8 h-8 rounded-full object-cover transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:ring-2 group-hover:ring-primary/30"
                      onError={(e) => {
                        // If image fails to load, hide it and show fallback
                        e.target.style.display = 'none';
                        const fallback = e.target.nextElementSibling;
                        if (fallback) {
                          fallback.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:ring-2 group-hover:ring-primary/30 ${
                      hasValidPhoto(user) ? 'hidden' : ''
                    }`}
                  >
                    {user?.name?.charAt(0)?.toUpperCase() || 'E'}
                  </div>
                  <div className="hidden xl:flex flex-col items-start text-left">
                    <span className="text-sm font-medium text-[rgb(79,179,168)] leading-tight">
                      {user?.name}
                    </span>
                    <span className="text-xs text-mediumTeal">
                      Minha conta
                    </span>
                  </div>
                  <svg
                    className={`w-4 h-4 text-mediumTeal transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >                                      
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  </button>

                  {isAccountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-primary/20 py-2 z-50 backdrop-blur-sm animate-scale-in">
                    <div className="absolute top-0 right-4 -mt-2 w-4 h-4 bg-white border-l border-t border-primary/20 transform rotate-45"></div>
                    <div className="px-4 py-3 border-b border-primary/10 bg-gradient-to-r from-primary/5 to-transparent">
                      <p className="text-sm font-semibold text-darkTeal">{user?.name}</p>
                    </div>
                    <div className="py-1">
                      <a
                        href="/agendar"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors rounded-md mx-1"
                        onClick={() => setIsAccountMenuOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Agendar consulta
                      </a>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-darkTeal hover:bg-primary/10 transition-colors rounded-md mx-1"
                        onClick={() => setIsAccountMenuOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Dashboard
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-darkTeal hover:bg-primary/10 transition-colors rounded-md mx-1"
                          onClick={() => setIsAccountMenuOpen(false)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Painel administrativo
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-primary/10 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300 rounded-md mx-1 group relative overflow-hidden"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-red-50 to-red-100 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                        <svg className="w-4 h-4 transition-all duration-300 group-hover:translate-x-2 group-hover:rotate-12 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="relative z-10 font-semibold">Sair</span>
                      </button>
                    </div>
                  </div>
                  )}
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 hover:bg-primary/20 transition-all duration-300 hover:scale-110">
                <img src="/icons/user-login-icon.svg" alt="Entrar" className="w-7 h-7" onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }} />
                <svg className="w-6 h-6 text-[rgb(79,179,168)] hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}
          </div>

          <button
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md text-darkTeal hover:bg-primary/10 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-primary/20 shadow-lg animate-slide-down">
          <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  state={link.path === '/produtos' && !authenticated ? { from: link.path } : undefined}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-primary text-white'
                      : 'text-darkTeal/70 hover:bg-primary/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {authenticated && user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold tracking-wide ${
                    isActive('/admin') ? 'bg-primary text-white shadow-lg' : 'bg-white/60 text-darkTeal/80'
                  }`}
                >
                  Admin
                </Link>
              )}

              {authenticated && (
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold tracking-wide ${
                    isActive('/dashboard') ? 'bg-primary text-white shadow-lg' : 'bg-white/60 text-darkTeal/80'
                  }`}
                >
                  Dashboard
                </Link>
              )}

              {authenticated && user?.isAuthorized && (
                <Link
                  to="/carrinho"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2 rounded-md text-sm font-medium text-darkTeal/70 hover:bg-primary/10 flex items-center gap-2"
                >
                  <span>Carrinho</span>
                  {cartCount > 0 && (
                    <span className="bg-primary text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>
              )}
            </nav>

            <div className="pt-3 sm:pt-4 border-t border-primary/10 flex flex-col gap-2">
              {authenticated ? (
                <>
                  <div className="flex items-center gap-3 px-3 sm:px-4 py-2">
                    {hasValidPhoto(user) ? (
                      <img 
                        src={user.photo} 
                        alt={user?.name || 'User'} 
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                        onError={(e) => {
                          // If image fails to load, hide it and show fallback
                          e.target.style.display = 'none';
                          const fallback = e.target.nextElementSibling;
                          if (fallback) {
                            fallback.style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium flex-shrink-0 ${
                        hasValidPhoto(user) ? 'hidden' : ''
                      }`}
                    >
                      {user?.name?.charAt(0)?.toUpperCase() || 'E'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-darkTeal truncate">{user?.name}</p>
                      <p className="text-xs text-mediumTeal">Conta EverWell</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout} 
                    className="btn-secondary w-full text-center group hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300 hover:shadow-md"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sair
                    </span>
                  </button>
                </>
              ) : (
                <Link to="/login" className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors mx-auto">
                  <svg className="w-6 h-6 text-[rgb(79,179,168)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              )}

              <a
                href="/agendar"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="btn-primary text-center w-full"
              >
                Agendar consulta
              </a>
            </div>
          </div>
        </div>
      )}

      <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} />
    </header>
  );
};

export default Header;

