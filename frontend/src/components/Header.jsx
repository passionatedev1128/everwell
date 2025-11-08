import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { isAuthenticated, getUser, removeToken } from '../utils/auth';
import { useCart } from '../context/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const user = getUser();
  const { getCartItemsCount } = useCart();
  const cartCount = getCartItemsCount();

  const handleLogout = () => {
    removeToken();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200" style={{ borderColor: '#e6f3f1' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary font-heading">EverWell</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-darkTeal hover:text-primary transition-colors font-medium">
              Home
            </Link>
            <Link to="/produtos" className="text-darkTeal hover:text-primary transition-colors font-medium">
              Produtos
            </Link>
            <Link to="/duvidas" className="text-darkTeal hover:text-primary transition-colors font-medium">
              Dúvidas
            </Link>
            <Link to="/blog" className="text-darkTeal hover:text-primary transition-colors font-medium">
              Blog
            </Link>
            
            {authenticated ? (
              <div className="flex items-center space-x-4">
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-darkTeal hover:text-primary transition-colors font-medium">
                    Admin
                  </Link>
                )}
                <Link to="/dashboard" className="text-darkTeal hover:text-primary transition-colors font-medium">
                  Dashboard
                </Link>
                {/* Cart Icon */}
                {authenticated && user?.isAuthorized && (
                  <Link to="/carrinho" className="relative p-2 hover:text-primary transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {cartCount > 0 && (
                      <span className="absolute top-0 right-0 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </Link>
                )}
                <span className="text-sm text-mediumTeal">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm"
                >
                  Sair
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary">
                Login
              </Link>
            )}
            
                <Link to="/agendar" className="btn-primary">
                  AGENDAR CONSULTA
                </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-slide-in" style={{ borderColor: '#e6f3f1' }}>
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-darkTeal hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/produtos" className="text-darkTeal hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)}>
                Produtos
              </Link>
              <Link to="/duvidas" className="text-darkTeal hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)}>
                Dúvidas
              </Link>
              <Link to="/blog" className="text-darkTeal hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)}>
                Blog
              </Link>
              {authenticated ? (
                <>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="text-darkTeal hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)}>
                      Admin
                    </Link>
                  )}
                  <Link to="/dashboard" className="text-darkTeal hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                  {authenticated && user?.isAuthorized && (
                    <Link to="/carrinho" className="text-darkTeal hover:text-primary font-medium flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                      <span>Carrinho</span>
                      {cartCount > 0 && (
                        <span className="bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {cartCount > 9 ? '9+' : cartCount}
                        </span>
                      )}
                    </Link>
                  )}
                  <span className="text-sm text-mediumTeal">{user?.name}</span>
                  <button onClick={handleLogout} className="btn-secondary text-left">
                    Sair
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn-primary" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
              )}
                  <Link
                    to="/agendar"
                    className="btn-primary text-center"
                  >
                    AGENDAR CONSULTA
                  </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

