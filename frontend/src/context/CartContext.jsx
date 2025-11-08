import { createContext, useContext, useState, useEffect } from 'react';
import { trackAddToCart, trackRemoveFromCart } from '../utils/analytics';
import { trackAddToCart as fbTrackAddToCart } from '../utils/facebookPixel';
import { trackAddToCart as gtmTrackAddToCart, trackRemoveFromCart as gtmTrackRemoveFromCart } from '../utils/gtm';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('everwell_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('everwell_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productId === product._id);
      
      if (existingItem) {
        const updatedItems = prevItems.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        // Track add to cart (increment quantity)
        trackAddToCart({ ...product, productId: product._id }, 1);
        fbTrackAddToCart({ ...product, productId: product._id }, 1);
        gtmTrackAddToCart({ ...product, productId: product._id }, 1);
        return updatedItems;
      }
      
      const newItem = {
        productId: product._id,
        name: product.name,
        slug: product.slug,
        price: product.price || 0,
        image: product.images?.[0] || '',
        quantity: 1,
      };
      
      // Track add to cart (new item)
      trackAddToCart({ ...product, productId: product._id }, 1);
      fbTrackAddToCart({ ...product, productId: product._id }, 1);
      gtmTrackAddToCart({ ...product, productId: product._id }, 1);
      
      return [...prevItems, newItem];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const itemToRemove = prevItems.find((item) => item.productId === productId);
      if (itemToRemove) {
        // Track remove from cart
        trackRemoveFromCart(itemToRemove, itemToRemove.quantity);
        gtmTrackRemoveFromCart(itemToRemove, itemToRemove.quantity);
      }
      return prevItems.filter((item) => item.productId !== productId);
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

