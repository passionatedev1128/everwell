import { createContext, useContext, useEffect, useState } from 'react';
import { trackAddToCart, trackRemoveFromCart } from '../utils/analytics';
// HubSpot: Removed add_to_cart - GA4 handles e-commerce analytics
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
        // GA4: Detailed e-commerce analytics
        trackAddToCart({ ...product, productId: product._id }, 1);
        // GTM: For tag management
        gtmTrackAddToCart({ ...product, productId: product._id }, 1);
        // HubSpot: Not needed - GA4 handles e-commerce analytics
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
      // GA4: Detailed e-commerce analytics
      trackAddToCart({ ...product, productId: product._id }, 1);
      // GTM: For tag management
      gtmTrackAddToCart({ ...product, productId: product._id }, 1);
      // HubSpot: Not needed - GA4 handles e-commerce analytics
      
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

