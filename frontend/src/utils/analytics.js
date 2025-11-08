// Google Analytics 4 utility functions

// Initialize GA4
export const initGA4 = (measurementId) => {
  if (!measurementId || typeof window === 'undefined') {
    console.warn('GA4: Measurement ID not provided or running on server');
    return;
  }

  // Check if gtag is already loaded
  if (window.gtag) {
    console.log('GA4: Already initialized');
    return;
  }

  // Load GA4 script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', measurementId, {
    page_path: window.location.pathname,
  });

  window.__GA4_MEASUREMENT_ID = measurementId;

  console.log('GA4: Initialized with measurement ID', measurementId);
};

// Track page view
export const trackPageView = (path, title) => {
  if (!window.gtag) {
    console.warn('GA4: gtag not initialized');
    return;
  }

  const measurementId = window.__GA4_MEASUREMENT_ID || import.meta.env.VITE_GA4_MEASUREMENT_ID;
  if (!measurementId) {
    console.warn('GA4: Measurement ID not available for page view tracking');
    return;
  }

  window.gtag('config', measurementId, {
    page_path: path || window.location.pathname,
    page_title: title || document.title,
  });

  console.log('GA4: Page view tracked', { path, title });
};

// Track custom event
export const trackEvent = (eventName, eventParams = {}) => {
  if (!window.gtag) {
    console.warn('GA4: gtag not initialized');
    return;
  }

  window.gtag('event', eventName, eventParams);
  console.log('GA4: Event tracked', { eventName, eventParams });
};

// E-commerce Events

// Track product view
export const trackProductView = (product) => {
  trackEvent('view_item', {
    currency: 'BRL',
    value: product.price || 0,
    items: [{
      item_id: product._id || product.id,
      item_name: product.name,
      item_category: product.category || 'CBD Products',
      price: product.price || 0,
      quantity: 1,
    }],
  });
};

// Track add to cart
export const trackAddToCart = (product, quantity = 1) => {
  trackEvent('add_to_cart', {
    currency: 'BRL',
    value: (product.price || 0) * quantity,
    items: [{
      item_id: product.productId || product._id || product.id,
      item_name: product.name,
      item_category: product.category || 'CBD Products',
      price: product.price || 0,
      quantity: quantity,
    }],
  });
};

// Track remove from cart
export const trackRemoveFromCart = (product, quantity = 1) => {
  trackEvent('remove_from_cart', {
    currency: 'BRL',
    value: (product.price || 0) * quantity,
    items: [{
      item_id: product.productId || product._id || product.id,
      item_name: product.name,
      item_category: product.category || 'CBD Products',
      price: product.price || 0,
      quantity: quantity,
    }],
  });
};

// Track begin checkout
export const trackBeginCheckout = (cartItems, totalAmount) => {
  trackEvent('begin_checkout', {
    currency: 'BRL',
    value: totalAmount,
    items: cartItems.map(item => ({
      item_id: item.productId || item._id || item.id,
      item_name: item.name,
      item_category: item.category || 'CBD Products',
      price: item.price || 0,
      quantity: item.quantity || 1,
    })),
  });
};

// Track purchase
export const trackPurchase = (order) => {
  trackEvent('purchase', {
    transaction_id: order._id || order.id,
    value: order.totalAmount || 0,
    currency: 'BRL',
    items: (order.products || []).map(item => ({
      item_id: item.productId?._id || item.productId || item._id || item.id,
      item_name: item.name,
      item_category: item.category || 'CBD Products',
      price: item.price || 0,
      quantity: item.quantity || 1,
    })),
  });
};

// User Events

// Track sign up
export const trackSignUp = (method = 'email') => {
  trackEvent('sign_up', {
    method: method, // 'email' or 'google'
  });
};

// Track login
export const trackLogin = (method = 'email') => {
  trackEvent('login', {
    method: method, // 'email' or 'google'
  });
};

// Track document upload
export const trackDocumentUpload = (documentType) => {
  trackEvent('document_upload', {
    document_type: documentType, // 'medicalPrescription', 'importAuthorization', 'proofOfResidence'
  });
};

// Track payment proof upload
export const trackPaymentProofUpload = (orderId) => {
  trackEvent('payment_proof_upload', {
    order_id: orderId,
  });
};

// Track search
export const trackSearch = (searchTerm) => {
  trackEvent('search', {
    search_term: searchTerm,
  });
};

// Track view item list (product listing page)
export const trackViewItemList = (products, listName = 'Products') => {
  trackEvent('view_item_list', {
    item_list_name: listName,
    item_list_id: 'products',
    items: products.map(product => ({
      item_id: product._id || product.id,
      item_name: product.name,
      item_category: product.category || 'CBD Products',
      price: product.price || 0,
    })),
  });
};

// Track share (if sharing features are added)
export const trackShare = (contentType, itemId, method = 'web') => {
  trackEvent('share', {
    content_type: contentType,
    item_id: itemId,
    method: method,
  });
};

// Track video play (if videos are added)
export const trackVideoPlay = (videoName) => {
  trackEvent('video_start', {
    video_title: videoName,
  });
};

// Track video complete
export const trackVideoComplete = (videoName) => {
  trackEvent('video_complete', {
    video_title: videoName,
  });
};

// Track exception/error
export const trackException = (description, fatal = false) => {
  trackEvent('exception', {
    description: description,
    fatal: fatal,
  });
};

export default {
  initGA4,
  trackPageView,
  trackEvent,
  trackProductView,
  trackAddToCart,
  trackRemoveFromCart,
  trackBeginCheckout,
  trackPurchase,
  trackSignUp,
  trackLogin,
  trackDocumentUpload,
  trackPaymentProofUpload,
  trackSearch,
  trackViewItemList,
  trackShare,
  trackVideoPlay,
  trackVideoComplete,
  trackException,
};

