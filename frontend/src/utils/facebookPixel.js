// Facebook Pixel utility functions

// Initialize Facebook Pixel
export const initFacebookPixel = (pixelId) => {
  if (!pixelId || typeof window === 'undefined') {
    console.warn('Facebook Pixel: Pixel ID not provided or running on server');
    return;
  }

  // Check if fbq is already loaded
  if (window.fbq) {
    console.log('Facebook Pixel: Already initialized');
    return;
  }

  try {
    // Facebook Pixel base code
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

    // Wait a bit for script to load, then initialize
    // This handles cases where ad blockers might interfere
    setTimeout(() => {
      try {
        if (window.fbq) {
          window.fbq('init', pixelId);
          window.fbq('track', 'PageView');
          console.log('Facebook Pixel: Initialized with Pixel ID', pixelId);
        } else {
          console.warn('Facebook Pixel: Script blocked or failed to load (likely due to ad blocker)');
        }
      } catch (error) {
        console.warn('Facebook Pixel: Initialization error (may be blocked by ad blocker):', error.message);
      }
    }, 100);
  } catch (error) {
    console.warn('Facebook Pixel: Failed to initialize (may be blocked by ad blocker):', error.message);
  }
};

// Track custom event
export const trackEvent = (eventName, eventParams = {}) => {
  if (!window.fbq) {
    // Silently fail if Facebook Pixel is not available (e.g., blocked by ad blocker)
    // This prevents console spam and allows the app to function normally
    return;
  }

  try {
    window.fbq('track', eventName, eventParams);
    console.log('Facebook Pixel: Event tracked', { eventName, eventParams });
  } catch (error) {
    // Silently handle errors (likely due to ad blocker)
    console.warn('Facebook Pixel: Failed to track event:', eventName);
  }
};

// Standard Facebook Pixel Events

// Track page view
export const trackPageView = () => {
  // Only track if fbq is available
  if (window.fbq) {
    trackEvent('PageView');
  }
};

// Track view content (product view)
export const trackViewContent = (product) => {
  trackEvent('ViewContent', {
    content_name: product.name,
    content_ids: [product._id || product.id],
    content_type: 'product',
    value: product.price || 0,
    currency: 'BRL',
  });
};

// Track add to cart
export const trackAddToCart = (product, quantity = 1) => {
  trackEvent('AddToCart', {
    content_name: product.name,
    content_ids: [product.productId || product._id || product.id],
    content_type: 'product',
    value: (product.price || 0) * quantity,
    currency: 'BRL',
    num_items: quantity,
  });
};

// Track initiate checkout
export const trackInitiateCheckout = (cartItems, totalAmount) => {
  const contentIds = cartItems.map(item => 
    item.productId || item._id || item.id
  );
  const contentNames = cartItems.map(item => item.name);
  
  trackEvent('InitiateCheckout', {
    content_ids: contentIds,
    content_name: contentNames.join(', '),
    content_type: 'product',
    value: totalAmount,
    currency: 'BRL',
    num_items: cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0),
  });
};

// Track purchase
export const trackPurchase = (order) => {
  const contentIds = (order.products || []).map(item => 
    item.productId?._id || item.productId || item._id || item.id
  );
  const contentNames = (order.products || []).map(item => item.name);
  
  trackEvent('Purchase', {
    content_ids: contentIds,
    content_name: contentNames.join(', '),
    content_type: 'product',
    value: order.totalAmount || 0,
    currency: 'BRL',
    num_items: (order.products || []).reduce((sum, item) => sum + (item.quantity || 1), 0),
  });
};

// Track complete registration
export const trackCompleteRegistration = (method = 'email') => {
  trackEvent('CompleteRegistration', {
    method: method, // 'email' or 'google'
    status: true,
  });
};

// Track search
export const trackSearch = (searchTerm) => {
  trackEvent('Search', {
    search_string: searchTerm,
  });
};

// Track lead (document upload)
export const trackLead = (documentType) => {
  trackEvent('Lead', {
    content_name: `Document Upload: ${documentType}`,
    content_category: 'document',
  });
};

// Track contact (payment proof upload)
export const trackContact = (orderId) => {
  trackEvent('Contact', {
    content_name: `Payment Proof Upload`,
    content_ids: [orderId],
  });
};

// Track view category (product listing)
export const trackViewCategory = (products, categoryName = 'Products') => {
  const contentIds = products.map(product => product._id || product.id);
  const contentNames = products.map(product => product.name);
  
  trackEvent('ViewCategory', {
    content_ids: contentIds,
    content_name: contentNames.join(', '),
    content_type: 'product',
    content_category: categoryName,
  });
};

export default {
  initFacebookPixel,
  trackPageView,
  trackEvent,
  trackViewContent,
  trackAddToCart,
  trackInitiateCheckout,
  trackPurchase,
  trackCompleteRegistration,
  trackSearch,
  trackLead,
  trackContact,
  trackViewCategory,
};

