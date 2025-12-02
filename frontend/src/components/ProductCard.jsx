import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-primary/20 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col" style={{ minHeight: '580px', height: '580px', width: '100%' }}>
      {product.images && product.images.length > 0 && (
        <div className="bg-primary/5 flex items-center justify-center flex-shrink-0" style={{ height: '250px', minHeight: '250px', maxHeight: '250px' }}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-contain"
            style={{ maxWidth: '100%', maxHeight: '250px', padding: '10px' }}
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-shrink-0" style={{ height: '330px', minHeight: '330px' }}>
        <h3 className="text-lg font-semibold text-darkTeal mb-2 flex-shrink-0" style={{ height: '28px', minHeight: '28px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</h3>
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

