// HubSpot tracking utility functions

const ensureQueue = () => {
  if (typeof window === 'undefined') return null;
  window._hsq = window._hsq || [];
  return window._hsq;
};

export const initHubspot = (portalId) => {
  if (!portalId || typeof window === 'undefined') {
    console.warn('HubSpot: portal ID not provided or running on server');
    return;
  }

  if (window.__hubspotInitialized) {
    console.log('HubSpot: already initialized');
    return;
  }

  ensureQueue();

  const existingScript = document.getElementById('hs-script-loader');
  if (existingScript) {
    window.__hubspotInitialized = true;
    console.log('HubSpot: script already present');
    return;
  }

  const script = document.createElement('script');
  script.id = 'hs-script-loader';
  script.async = true;
  script.defer = true;
  script.src = `https://js.hs-scripts.com/${portalId}.js`;
  script.onload = () => {
    window.__hubspotInitialized = true;
    console.log('HubSpot: Initialized with portal ID', portalId);
  };
  script.onerror = () => {
    console.warn('HubSpot: Failed to load tracking script');
  };
  document.head.appendChild(script);
};

export const trackEvent = (eventName, properties = {}) => {
  const queue = ensureQueue();
  if (!queue) return;

  try {
    queue.push([
      'trackCustomBehavioralEvent',
      {
        name: eventName,
        properties,
      },
    ]);
    console.log('HubSpot: Event tracked', { eventName, properties });
  } catch (error) {
    console.warn('HubSpot: Failed to track event', eventName, error);
  }
};

export const trackPageView = (path, title) => {
  const queue = ensureQueue();
  if (!queue) return;

  try {
    if (path) {
      queue.push(['setPath', path]);
    }
    if (title) {
      queue.push(['setDocumentTitle', title]);
    }
    queue.push(['trackPageView']);
    console.log('HubSpot: Page view tracked', { path, title });
  } catch (error) {
    console.warn('HubSpot: Failed to track page view', error);
  }
};

export const trackViewContent = (product) => {
  trackEvent('view_content', {
    product_name: product.name,
    product_id: product._id || product.id,
    category: product.category || 'CBD Products',
    price: product.price || 0,
  });
};

export const trackAddToCart = (product, quantity = 1) => {
  trackEvent('add_to_cart', {
    product_name: product.name,
    product_id: product.productId || product._id || product.id,
    category: product.category || 'CBD Products',
    price: product.price || 0,
    quantity,
  });
};

export const trackInitiateCheckout = (cartItems, totalAmount) => {
  trackEvent('begin_checkout', {
    total_value: totalAmount,
    items: cartItems.map((item) => ({
      product_id: item.productId || item._id || item.id,
      name: item.name,
      quantity: item.quantity || 1,
      price: item.price || 0,
    })),
  });
};

export const trackPurchase = (order) => {
  trackEvent('purchase', {
    order_id: order._id || order.id,
    total_value: order.totalAmount || 0,
    items: (order.products || []).map((item) => ({
      product_id: item.productId?._id || item.productId || item._id || item.id,
      name: item.name,
      quantity: item.quantity || 1,
      price: item.price || 0,
    })),
  });
};

export const trackCompleteRegistration = (method = 'email') => {
  trackEvent('complete_registration', {
    method,
  });
};

export const trackSearch = (searchTerm) => {
  trackEvent('search', {
    query: searchTerm,
  });
};

export const trackLead = (leadSource) => {
  // Handle different lead sources (goal_form, document_upload, etc.)
  if (leadSource === 'goal_form') {
    trackEvent('goal_form', {
      source: 'homepage_form',
    });
  } else {
    // For document uploads
    trackEvent('document_upload', {
      document_type: leadSource,
    });
  }
};

export const trackContact = (orderId) => {
  trackEvent('payment_proof_upload', {
    order_id: orderId,
  });
};

export const identifyContact = (user = {}) => {
  const queue = ensureQueue();
  if (!queue) return;
  const { email, _id, id, role, isAuthorized, name } = user || {};
  if (!email) return;
  try {
    queue.push(['identify', {
      email,
      userId: _id || id,
      role: role || 'user',
      isAuthorized: !!isAuthorized,
      name,
    }]);
  } catch (e) {
    // no-op
  }
};

export const trackViewCategory = (products, categoryName = 'Products') => {
  trackEvent('view_category', {
    category: categoryName,
    items: products.map((product) => ({
      product_id: product._id || product.id,
      name: product.name,
      price: product.price || 0,
    })),
  });
};

export default {
  initHubspot,
  trackEvent,
  trackPageView,
  trackViewContent,
  trackAddToCart,
  trackInitiateCheckout,
  trackPurchase,
  trackCompleteRegistration,
  trackSearch,
  trackLead,
  trackContact,
  trackViewCategory,
  identifyContact,
};
