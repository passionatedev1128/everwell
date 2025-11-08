import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { isAuthenticated, getUser, removeToken } from '../utils/auth';
import { useCart } from '../context/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const authenticated = isAuthenticated();
  const user = getUser();
  const { getCartItemsCount } = useCart();
  const cartCount = getCartItemsCount();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Produtos', path: '/produtos' },
    { label: 'Dúvidas', path: '/duvidas' },
    { label: 'Blog', path: '/blog' }
  ];

  const handleLogout = () => {
    removeToken();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-primary/10 backdrop-blur-xl" />
        <div className="absolute inset-0 border-b border-white/40 shadow-[0_8px_30px_-20px_rgba(15,41,61,0.6)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/15 text-primary font-heading text-xl shadow-[0_12px_40px_-25px_rgba(79,179,168,0.9)]">
                EW
              </span>
              <div className="flex flex-col">
                <span className="font-heading text-xl font-semibold text-darkTeal tracking-tight">EverWell</span>
                <span className="text-xs uppercase tracking-[0.4em] text-darkTeal/60">CBD Experts</span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${
                    isActive(link.path)
                      ? 'text-white bg-primary shadow-[0_18px_40px_-20px_rgba(79,179,168,0.9)]'
                      : 'text-darkTeal/70 hover:text-darkTeal hover:bg-white/70'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {authenticated && user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`relative px-5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${
                    isActive('/admin')
                      ? 'text-white bg-primary shadow-[0_18px_40px_-20px_rgba(79,179,168,0.9)]'
                      : 'text-darkTeal/70 hover:text-darkTeal hover:bg-white/70'
                  }`}
                >
                  Admin
                </Link>
              )}

              {authenticated && (
                <Link
                  to="/dashboard"
                  className={`relative px-5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${
                    isActive('/dashboard')
                      ? 'text-white bg-primary shadow-[0_18px_40px_-20px_rgba(79,179,168,0.9)]'
                      : 'text-darkTeal/70 hover:text-darkTeal hover:bg-white/70'
                  }`}
                >
                  Dashboard
                </Link>
              )}

              {authenticated && user?.isAuthorized && (
                <Link
                  to="/carrinho"
                  className="relative px-4 py-2 rounded-full text-darkTeal/70 hover:text-darkTeal hover:bg-white/70 transition-all duration-300"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Carrinho</span>
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </div>
                </Link>
              )}
            </nav>

            <div className="hidden lg:flex items-center gap-4">
              {authenticated ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-white/60 backdrop-blur px-4 py-2 rounded-full border border-white/50">
                    <div className="w-9 h-9 rounded-full bg-primary/15 text-primary flex items-center justify-center font-heading text-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || 'E'}
                    </div>
                    <div className="text-xs uppercase tracking-wide text-darkTeal/70">
                      {user?.name}
                    </div>
                  </div>
                  <button onClick={handleLogout} className="btn-secondary">
                    Sair
                  </button>
                </div>
              ) : (
                <Link to="/login" className="btn-secondary">
                  Entrar
                </Link>
              )}

              <Link to="/agendar" className="btn-primary">
                Agendar consulta
              </Link>
            </div>

            <button
              className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-white/70 border border-white/50 shadow-sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="h-6 w-6 text-darkTeal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden backdrop-blur-xl bg-white/80 border-b border-white/40 shadow-[0_18px_60px_-30px_rgba(15,41,61,0.6)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold tracking-wide ${
                    isActive(link.path)
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-white/60 text-darkTeal/80'
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
                  className="px-4 py-3 rounded-xl text-sm font-semibold tracking-wide bg-white/60 text-darkTeal/80 flex items-center gap-3"
                >
                  <span>Carrinho</span>
                  {cartCount > 0 && (
                    <span className="bg-primary text-white text-[11px] font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>
              )}
            </nav>

            <div className="pt-2 border-t border-white/50 flex flex-col gap-3">
              {authenticated ? (
                <>
                  <div className="flex items-center gap-3 bg-white/70 backdrop-blur px-4 py-3 rounded-2xl">
                    <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center font-heading">
                      {user?.name?.charAt(0)?.toUpperCase() || 'E'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-darkTeal">{user?.name}</p>
                      <p className="text-xs text-darkTeal/60 uppercase tracking-wide">Conta EverWell</p>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="btn-secondary w-full text-center">
                    Sair
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn-secondary text-center">
                  Entrar
                </Link>
              )}

              <Link
                to="/agendar"
                onClick={() => setIsMenuOpen(false)}
                className="btn-primary text-center"
              >
                Agendar consulta
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

