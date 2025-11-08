// Google Tag Manager utility functions

// Initialize GTM
export const initGTM = (containerId) => {
  if (!containerId || typeof window === 'undefined') {
    console.warn('GTM: Container ID not provided or running on server');
    return;
  }

  // Check if GTM is already loaded
  if (window.dataLayer && window.dataLayer.find) {
    const gtmLoaded = window.dataLayer.find(item => item.gtmLoad);
    if (gtmLoaded) {
      console.log('GTM: Already initialized');
      return;
    }
  }

  // Initialize dataLayer if not already done
  window.dataLayer = window.dataLayer || [];

  // GTM script will be loaded from index.html
  // This function just ensures dataLayer is ready
  console.log('GTM: DataLayer initialized for container', containerId);
};

// Push event to dataLayer
export const pushToDataLayer = (eventData) => {
  if (!window.dataLayer) {
    console.warn('GTM: dataLayer not initialized');
    return;
  }

  window.dataLayer.push(eventData);
  console.log('GTM: Event pushed to dataLayer', eventData);
};

// Track page view
export const trackPageView = (path, title) => {
  pushToDataLayer({
    event: 'page_view',
    page_path: path || window.location.pathname,
    page_title: title || document.title,
    page_location: window.location.href,
  });
};

// Track custom event
export const trackEvent = (eventName, eventParams = {}) => {
  pushToDataLayer({
    event: eventName,
    ...eventParams,
  });
};

// E-commerce Events

// Track product view
export const trackProductView = (product) => {
  pushToDataLayer({
    event: 'view_item',
    ecommerce: {
      currency: 'BRL',
      value: product.price || 0,
      items: [{
        item_id: product._id || product.id,
        item_name: product.name,
        item_category: product.category || 'CBD Products',
        price: product.price || 0,
        quantity: 1,
      }],
    },
  });
};

// Track add to cart
export const trackAddToCart = (product, quantity = 1) => {
  pushToDataLayer({
    event: 'add_to_cart',
    ecommerce: {
      currency: 'BRL',
      value: (product.price || 0) * quantity,
      items: [{
        item_id: product.productId || product._id || product.id,
        item_name: product.name,
        item_category: product.category || 'CBD Products',
        price: product.price || 0,
        quantity: quantity,
      }],
    },
  });
};

// Track remove from cart
export const trackRemoveFromCart = (product, quantity = 1) => {
  pushToDataLayer({
    event: 'remove_from_cart',
    ecommerce: {
      currency: 'BRL',
      value: (product.price || 0) * quantity,
      items: [{
        item_id: product.productId || product._id || product.id,
        item_name: product.name,
        item_category: product.category || 'CBD Products',
        price: product.price || 0,
        quantity: quantity,
      }],
    },
  });
};

// Track begin checkout
export const trackBeginCheckout = (cartItems, totalAmount) => {
  pushToDataLayer({
    event: 'begin_checkout',
    ecommerce: {
      currency: 'BRL',
      value: totalAmount,
      items: cartItems.map(item => ({
        item_id: item.productId || item._id || item.id,
        item_name: item.name,
        item_category: item.category || 'CBD Products',
        price: item.price || 0,
        quantity: item.quantity || 1,
      })),
    },
  });
};

// Track purchase
export const trackPurchase = (order) => {
  pushToDataLayer({
    event: 'purchase',
    ecommerce: {
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
    },
  });
};

// User Events

// Track sign up
export const trackSignUp = (method = 'email') => {
  pushToDataLayer({
    event: 'sign_up',
    method: method, // 'email' or 'google'
  });
};

// Track login
export const trackLogin = (method = 'email') => {
  pushToDataLayer({
    event: 'login',
    method: method, // 'email' or 'google'
  });
};

// Track document upload
export const trackDocumentUpload = (documentType) => {
  pushToDataLayer({
    event: 'document_upload',
    document_type: documentType, // 'medicalPrescription', 'importAuthorization', 'proofOfResidence'
  });
};

// Track payment proof upload
export const trackPaymentProofUpload = (orderId) => {
  pushToDataLayer({
    event: 'payment_proof_upload',
    order_id: orderId,
  });
};

// Track view item list (product listing page)
export const trackViewItemList = (products, listName = 'Products') => {
  pushToDataLayer({
    event: 'view_item_list',
    ecommerce: {
      item_list_name: listName,
      item_list_id: 'products',
      items: products.map(product => ({
        item_id: product._id || product.id,
        item_name: product.name,
        item_category: product.category || 'CBD Products',
        price: product.price || 0,
      })),
    },
  });
};

export default {
  initGTM,
  pushToDataLayer,
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
  trackViewItemList,
};

