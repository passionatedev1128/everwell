import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { trackProductView } from '../utils/analytics';
import { trackProductView as gtmTrackProductView } from '../utils/gtm';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/slug/${slug}`);
        const productData = response.data.product;
        setProduct(productData);
        
        // Track product view
        if (productData) {
          // GA4: Detailed product analytics (view_item)
          trackProductView(productData);
          // GTM: For tag management
          gtmTrackProductView(productData);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Produto não encontrado.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando produto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-accent">
        <div className="max-w-md w-full mx-4 text-center">
          <h2 className="text-2xl font-semibold text-text-dark mb-4">Produto não encontrado</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/produtos" className="btn-primary">
            Voltar para Produtos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-accent py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/produtos" className="text-primary hover:underline mb-6 inline-block">
          ← Voltar para Produtos
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {product.images && product.images.length > 0 && (
            <div className="mb-8">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
          )}

          <h1 className="text-4xl font-bold text-text-dark mb-4">{product.name}</h1>

          <div className="mb-6">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-sm text-yellow-700">
                <strong>Produto Restrito:</strong> {product.restrictions}
              </p>
            </div>
          </div>

          <div className="prose max-w-none mb-8">
            <p className="text-lg text-gray-700 whitespace-pre-line">
              {product.description}
            </p>
          </div>

          <div className="border-t pt-6">
            <p className="text-sm text-gray-500 mb-4">
              <strong>Importante:</strong> Este produto requer prescrição médica e autorização da Anvisa. 
              Entre em contato para mais informações.
            </p>
            <div className="space-y-4">
              {/* Add to Cart Section */}
              <div className="flex items-center gap-4 p-4 bg-bgSecondary rounded-lg">
                <label className="text-darkTeal font-medium">Quantidade:</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:bg-white transition-colors"
                  >
                    -
                  </button>
                  <span className="text-darkTeal font-semibold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:bg-white transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => {
                    addToCart(product, quantity);
                    setAddedToCart(true);
                    setTimeout(() => setAddedToCart(false), 3000);
                  }}
                  className="btn-primary flex-1"
                >
                  {addedToCart ? '✓ Adicionado ao Carrinho' : 'Adicionar ao Carrinho'}
                </button>
              </div>

              <div className="flex gap-4">
                <a
                  href="https://wa.me/5521998170460?text=Gostaria%20de%20saber%20mais%20sobre%20os%20produtos%20EverWell"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  Entrar em Contato
                </a>
                <Link
                  to="/agendar"
                  className="btn-secondary"
                >
                  Agendar Consulta
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

