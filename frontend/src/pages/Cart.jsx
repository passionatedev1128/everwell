import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { EmptyCart } from '../components/EmptyState';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const total = getCartTotal();

  return (
    <div className="min-h-screen bg-bgSecondary py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-darkTeal mb-8 font-heading">Carrinho de Compras</h1>

        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-bgTertiary rounded-md flex items-center justify-center">
                      <span className="text-mediumTeal">Imagem</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-darkTeal mb-2">{item.name}</h3>
                      <p className="text-mediumTeal mb-4">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:bg-bgSecondary transition-colors"
                          >
                            -
                          </button>
                          <span className="text-darkTeal font-semibold w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:bg-bgSecondary transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-primary">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </p>
                          <button 
                            onClick={() => removeFromCart(item.productId)}
                            className="text-sm text-error hover:underline mt-1"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold text-darkTeal mb-4 font-heading">Resumo do Pedido</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-mediumTeal">
                    <span>Subtotal</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-mediumTeal">
                    <span>Frete</span>
                    <span>Calculado no checkout</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold text-darkTeal">
                    <span>Total</span>
                    <span className="text-primary">R$ {total.toFixed(2)}</span>
                  </div>
                </div>

                <Link to="/checkout" className="btn-primary w-full text-center block">
                  Finalizar Compra
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

