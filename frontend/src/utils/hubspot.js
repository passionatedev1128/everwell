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

export default {
  initHubspot,
  trackPageView,
  identifyContact,
};
