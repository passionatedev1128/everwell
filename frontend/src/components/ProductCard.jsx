import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-primary/20 overflow-hidden hover:shadow-md transition-shadow">
      {product.images && product.images.length > 0 && (
        <div className="bg-primary/5 flex items-center justify-center" style={{ minHeight: '200px', maxHeight: '300px', padding: '7px' }}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-contain max-h-[300px]"
            style={{ maxWidth: '100%', maxHeight: '300px' }}
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-darkTeal mb-2">{product.name}</h3>
        {product.subtitle && (
          <p className="text-sm font-medium text-primary mb-2">{product.subtitle}</p>
        )}
        <p className="text-2xl font-bold text-primary mb-2">
          R$ {product.price ? product.price.toFixed(2) : '0.00'}
        </p>
        <p className="text-sm text-mediumTeal mb-4 line-clamp-3">{product.description}</p>
        {product.restrictions && (
          <p className="text-xs text-lightTeal mb-4 italic">{product.restrictions}</p>
        )}
        <div className="flex gap-2">
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

