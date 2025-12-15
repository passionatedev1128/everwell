import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { isAuthenticated, getUser, removeToken, setUser } from '../utils/auth';
import { getCurrentUser } from '../utils/api';
import { useCart } from '../context/CartContext';
import NotificationBell from './NotificationBell';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary/20 backdrop-blur-xl border-b-4 border-brandBlack shadow-lg header-extra-effect">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="flex items-center justify-center rounded-lg text-white font-semibold text-base sm:text-lg" style={{ width: "148px" }}>
              <img src = "/logos/logo_everwell_colored_green.png" />
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
                      ? 'border-b-2 pb-2 font-semibold'
                      : 'hover:bg-primary-dark/20'
                  }`}
                  style={{
                    color: shouldShowActive ? '#C0DF16' : '#C0DF16',
                    borderColor: shouldShowActive ? '#C0DF16' : 'transparent'
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
              {authenticated ? (
              <div className="flex items-center gap-2">
                <NotificationBell />
                <div className="relative" ref={accountMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsAccountMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary-dark/20 transition-all duration-300 group"
                    style={{ color: '#C0DF16' }}
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
                    className={`w-8 h-8 rounded-full bg-primary text-darkTeal flex items-center justify-center text-sm font-medium transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:ring-2 group-hover:ring-primary/30 ${
                      hasValidPhoto(user) ? 'hidden' : ''
                    }`}
                  >
                    {user?.name?.charAt(0)?.toUpperCase() || 'E'}
                  </div>
                  <div className="hidden xl:flex flex-col items-start text-left">
                    <span className="text-sm font-medium leading-tight" style={{ color: '#C0DF16' }}>
                      {user?.name}
                    </span>
                    <span className="text-xs" style={{ color: '#C0DF16', opacity: 0.7 }}>
                      Minha conta
                    </span>
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''}`}
                    style={{ color: '#C0DF16', opacity: 0.7 }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  </button>

                  {isAccountMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-64 bg-white shadow-2xl border border-primary/10 py-2 z-50 backdrop-blur-sm animate-scale-in" 
                    style={{ 
                      borderRadius: '24px',
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <div className="absolute top-2 right-4 -mt-2 w-4 h-4 bg-white border-l border-t border-primary/10 transform rotate-45"></div>
                    <div className="px-4 py-3 border-b border-primary/10 bg-gradient-to-r from-primary/5 to-transparent">
                      <p className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>{user?.name}</p>
                    </div>
                    <div className="py-1">
                      <a
                        href="/agendar"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-all duration-300 rounded-md mx-1"
                        style={{ backgroundColor: '#C0DF16' }}
                        onClick={() => setIsAccountMenuOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Agendar consulta
                      </a>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium hover:bg-primary/10 transition-colors rounded-md mx-1"
                        style={{ color: '#1A1A1A' }}
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
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium hover:bg-primary/10 transition-colors rounded-md mx-1"
                          style={{ color: '#1A1A1A' }}
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
                        className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-red-50 transition-all duration-300 rounded-md mx-1 group relative overflow-hidden"
                        style={{ color: '#dc2626' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#b91c1c'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#dc2626'}
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
                <svg className="w-6 h-6 text-primary hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}
          </div>

          <button
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md hover:bg-primary-dark/20 transition-colors"
            style={{ color: '#C0DF16' }}
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
                      ? 'bg-primary/30'
                      : 'hover:bg-primary-dark/20'
                  }`}
                  style={{ color: '#C0DF16' }}
                >
                  {link.label}
                </Link>
              ))}

              {authenticated && user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold tracking-wide ${
                    isActive('/admin') ? 'bg-primary/30 shadow-lg' : 'bg-white/20'
                  }`}
                  style={{ color: '#C0DF16' }}
                >
                  Admin
                </Link>
              )}

              {authenticated && (
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold tracking-wide ${
                    isActive('/dashboard') ? 'bg-primary/30 shadow-lg' : 'bg-white/20'
                  }`}
                  style={{ color: '#C0DF16' }}
                >
                  Dashboard
                </Link>
              )}

              {authenticated && user?.isAuthorized && (
                <Link
                  to="/carrinho"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark/20 flex items-center gap-2"
                  style={{ color: '#C0DF16', opacity: 0.9 }}
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
                      <p className="text-sm font-medium truncate" style={{ color: '#C0DF16' }}>{user?.name}</p>
                      <p className="text-xs" style={{ color: '#C0DF16', opacity: 0.7 }}>Conta EverWell</p>
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
                <Link to="/login" className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-dark/20 hover:bg-primary-dark/30 transition-colors mx-auto">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#C0DF16' }}>
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

    </header>
  );
};

export default Header;

