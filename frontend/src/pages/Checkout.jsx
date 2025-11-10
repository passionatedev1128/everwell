import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { trackBeginCheckout, trackPurchase } from '../utils/analytics';
import { trackInitiateCheckout, trackPurchase as hsTrackPurchase } from '../utils/hubspot';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Brasil'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subtotal = getCartTotal();
  const shipping = 0; // TODO: Calculate shipping
  const total = subtotal + shipping;

  // Track begin checkout when component mounts
  useEffect(() => {
    if (cartItems.length > 0) {
      trackBeginCheckout(cartItems, total);
      trackInitiateCheckout(cartItems, total);
    }
  }, []); // Only on mount

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Prepare order data
      const orderData = {
        products: cartItems.map(item => ({
          productId: item.productId,
          name: item.name,
          slug: item.slug,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: formData,
        totalAmount: total
      };

      const response = await api.createOrder(orderData);
      
      if (response.success) {
        // Track purchase
        const order = response.order || orderData;
        trackPurchase(order);
        hsTrackPurchase(order);
        
        clearCart();
        toast.success('Pedido criado com sucesso!');
        navigate('/pedidos');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao criar pedido. Tente novamente.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-bgSecondary py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-darkTeal mb-8 font-heading">Finalizar Compra</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Shipping Address Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-darkTeal mb-6 font-heading">Endereço de Entrega</h2>
              
              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Rua e Número</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className={`form-input ${error && !formData.street ? 'form-error' : formData.street ? 'form-success' : ''}`}
                    placeholder="Rua das Flores, 123"
                    required
                  />
                  {error && !formData.street && (
                    <p className="text-red-500 text-sm mt-1">Rua é obrigatória</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Cidade</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="São Paulo"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Estado</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="SP"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">CEP</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="01234-567"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">País</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Proof Upload Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-darkTeal mb-4 font-heading">Comprovante de Pagamento</h2>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong>Nota:</strong> Após criar o pedido, você poderá enviar o comprovante de pagamento na página de pedidos. 
                      O comprovante pode ser enviado a qualquer momento após a criação do pedido.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-darkTeal mb-4 font-heading">Resumo do Pedido</h2>
              
              <div className="space-y-3 mb-4">
                {cartItems.length === 0 ? (
                  <p className="text-mediumTeal">Nenhum item no carrinho</p>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-mediumTeal">{item.name} x{item.quantity}</span>
                      <span className="text-darkTeal">R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))
                )}
                
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between text-mediumTeal">
                    <span>Subtotal</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-mediumTeal">
                    <span>Frete</span>
                    <span>R$ {shipping.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-lg font-bold text-darkTeal">
                    <span>Total</span>
                    <span className="text-primary">R$ {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                  {error}
                </div>
              )}
              <button 
                type="submit" 
                className={`btn-primary w-full ${loading ? 'btn-loading' : ''}`}
                disabled={loading || cartItems.length === 0}
              >
                {loading ? 'Criando Pedido...' : 'Confirmar Pedido'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;

