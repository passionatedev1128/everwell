import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <div 
      className="bg-white shadow-sm border border-primary/20 overflow-hidden h-full flex flex-col transition-all duration-300 ease-in-out" 
      style={{ 
        minHeight: '580px', 
        height: '580px', 
        width: '100%', 
        borderRadius: '40px',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(192, 223, 22, 0.3), 0 0 0 2px rgba(192, 223, 22, 0.2)';
        e.currentTarget.style.borderColor = '#C0DF16';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '';
        e.currentTarget.style.borderColor = '';
      }}
    >
      {product.images && product.images.length > 0 && (
        <div 
          className="bg-primary/5 flex items-center justify-center flex-shrink-0 overflow-hidden" 
          style={{ 
            height: '250px', 
            minHeight: '250px', 
            maxHeight: '250px',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            const img = e.currentTarget.querySelector('img');
            if (img) {
              img.style.transform = 'scale(1.15)';
              img.style.transition = 'transform 0.4s ease-in-out';
            }
          }}
          onMouseLeave={(e) => {
            const img = e.currentTarget.querySelector('img');
            if (img) {
              img.style.transform = 'scale(1)';
            }
          }}
        >
          {/* Usage Timing Badge */}
          {product.usageTiming && product.usageTiming.trim() !== '' && (
            <div 
              className="absolute top-3 right-3 z-50 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide shadow-lg"
              style={{
                background: product.usageTiming === 'Recovery' 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : product.usageTiming === 'Post-workout'
                  ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                  : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: '#FFFFFF',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
                pointerEvents: 'none'
              }}
            >
              {product.usageTiming}
            </div>
          )}
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-contain"
            style={{ 
              maxWidth: '100%', 
              maxHeight: '250px', 
              padding: '10px',
              transition: 'transform 0.4s ease-in-out'
            }}
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-shrink-0" style={{ height: '330px', minHeight: '330px' }}>
        <h3 className="text-lg font-semibold text-darkTeal mb-2 flex-shrink-0 primary-color-text-green" style={{ height: '28px', minHeight: '28px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</h3>
        {product.subtitle && (
          <p className="text-sm font-medium text-primary mb-2 flex-shrink-0" style={{ height: '20px', minHeight: '20px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.subtitle}</p>
        )}
        <p className="text-2xl font-bold text-primary mb-2 flex-shrink-0" style={{ height: '32px', minHeight: '32px' }}>
          R$ {product.price ? product.price.toFixed(2) : '0.00'}
        </p>
        <p className="text-sm text-mediumTeal mb-4 line-clamp-3 flex-shrink-0" style={{ height: '70px', minHeight: '70px', maxHeight: '70px', overflow: 'hidden' }}>{product.description || ''}</p>
        {product.restrictions && (
          <p className="text-xs text-lightTeal mb-4 italic flex-shrink-0" style={{ height: '40px', minHeight: '40px', maxHeight: '40px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{product.restrictions}</p>
        )}
        <div className="flex gap-2 mt-auto flex-shrink-0" style={{ height: '40px', minHeight: '40px' }}>
          <Link
            to={`/produtos/${product.slug}`}
            className="btn-secondary flex-1 text-center"
          >
            Ver Detalhes
          </Link>
          <button
            onClick={handleAddToCart}
            className="btn-primary flex-1"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

