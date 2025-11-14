import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/SkeletonLoader';
import { EmptyProducts } from '../components/EmptyState';
import { trackViewItemList } from '../utils/analytics';
import { trackViewCategory } from '../utils/hubspot';
import { trackViewItemList as gtmTrackViewItemList } from '../utils/gtm';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        const productsData = response.data.products || [];
        setProducts(productsData);
        
        // Track product list view
        if (productsData.length > 0) {
          trackViewItemList(productsData, 'Products');
          trackViewCategory(productsData, 'Products');
          gtmTrackViewItemList(productsData, 'Products');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Erro ao carregar produtos.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-bgSecondary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-darkTeal mb-2">Produtos</h1>
            <p className="text-mediumTeal">Carregando produtos...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bgSecondary py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-sm border border-primary/20 p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-semibold text-darkTeal mb-4">Ops! Algo deu errado</h2>
            <p className="text-mediumTeal mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={() => window.location.reload()} 
                className="btn-primary"
              >
                Tentar Novamente
              </button>
              <Link to="/" className="btn-secondary">
                Voltar para Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bgSecondary py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-darkTeal mb-2">Produtos</h1>
          <p className="text-mediumTeal">Nossos produtos exclusivos de cannabis medicinal</p>
        </div>

        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                <strong>Produtos Restritos:</strong> Conforme as Resoluções RDC 327/2019 e 660/2022 da Anvisa, 
                estes produtos são restritos e requerem prescrição médica e autorização para acesso.
              </p>
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <EmptyProducts />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;

