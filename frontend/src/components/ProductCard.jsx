import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <div className="card hover:shadow-xl transition-shadow">
      {product.images && product.images.length > 0 && (
        <div className="mb-4">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}
      <h3 className="text-xl font-semibold text-darkTeal mb-2">{product.name}</h3>
      <p className="text-mediumTeal mb-4 line-clamp-3">{product.description}</p>
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
  );
};

export default ProductCard;

