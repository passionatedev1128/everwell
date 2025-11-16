import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getUser } from '../utils/auth';
import { useCart } from '../context/CartContext';

const FloatingCartButton = () => {
  const navigate = useNavigate();
  const { getCartItemsCount } = useCart();
  const count = getCartItemsCount();
  const authenticated = isAuthenticated();
  const user = getUser();
  const canAccessCart = authenticated && user?.isAuthorized;

  const handleClick = () => {
    if (canAccessCart) {
      navigate('/carrinho');
    } else {
      navigate('/login', { state: { redirect: '/carrinho' } });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="floating-cart-button fixed bottom-6 right-6 z-40 flex items-center gap-3 px-5 py-3 rounded-full shadow-[0_18px_45px_-25px_rgba(15,41,61,0.7)] bg-primary text-white font-semibold uppercase tracking-wide hover:shadow-[0_24px_60px_-20px_rgba(79,179,168,0.6)] hover:bg-primary-dark active:bg-primary-dark/90"
      style={{
        transition: 'box-shadow 0.2s ease-out, background-color 0.2s ease-out',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden'
      }}
    >
      <svg className="w-5 h-5 transition-transform duration-200 hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <span>Carrinho</span>
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white text-primary text-sm font-bold">
        {count > 99 ? '99+' : count}
      </span>
    </button>
  );
};

export default FloatingCartButton;
