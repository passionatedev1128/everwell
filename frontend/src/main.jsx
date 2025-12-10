import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast'
import { initGA4 } from './utils/analytics'
import { initHubspot, debugHubSpot, forceProcessQueue, monitorHubSpotInit, loadHubSpotAfterConsent, fixHubSpotCookieAttribute } from './utils/hubspot'
import { initGTM } from './utils/gtm'
import diagnoseHubSpot from './utils/hubspot-diagnostics'

// Initialize Google Tag Manager
const gtmContainerId = import.meta.env.VITE_GTM_CONTAINER_ID;
if (gtmContainerId) {
  initGTM(gtmContainerId);
  
  // Load GTM script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmContainerId}`;
  document.head.appendChild(script);
  
  // Update noscript iframe
  const noscriptIframe = document.querySelector('noscript iframe');
  if (noscriptIframe) {
    noscriptIframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmContainerId}`;
  }
} else {
  console.warn('GTM: VITE_GTM_CONTAINER_ID not set in environment variables');
}

// Initialize Google Analytics 4
const ga4MeasurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID;
if (ga4MeasurementId) {
  initGA4(ga4MeasurementId);
} else {
  console.warn('GA4: VITE_GA4_MEASUREMENT_ID not set in environment variables');
}

// Initialize HubSpot Tracking
// Wait for marketing cookie consent before loading HubSpot
const hubspotPortalId = import.meta.env.VITE_HUBSPOT_PORTAL_ID;
if (hubspotPortalId) {
  // Initialize queue immediately (needed for identifyContact to work)
  if (typeof window !== 'undefined') {
    window._hsq = window._hsq || [];
  }
  
  // Check if marketing cookies are accepted
  const checkConsentAndLoad = () => {
    // Check for common cookie consent tools
    let hasConsent = false;
    
    // CookieYes
    if (window.CookieYes) {
      const consent = window.CookieYes.getConsent?.();
      hasConsent = consent?.marketing === true;
    }
    
    // Cookiebot
    if (window.Cookiebot && !hasConsent) {
      hasConsent = window.Cookiebot.consent?.marketing === true;
    }
    
    // OneTrust
    if (window.OneTrust && !hasConsent) {
      const domainData = window.OneTrust.GetDomainData?.();
      hasConsent = domainData?.GroupsConsent?.includes('C0004');
    }
    
    // Check consent cookies as fallback
    if (!hasConsent) {
      const cookies = document.cookie.split(';');
      hasConsent = cookies.some(cookie => {
        const [name, value] = cookie.trim().split('=');
        return (
          (name.includes('consent') && value?.includes('marketing')) ||
          (name.includes('cookieyes') && value?.includes('marketing')) ||
          (name.includes('cookiebot') && value?.includes('marketing'))
        );
      });
    }
    
    // In development, assume consent if no tool detected
    if (!hasConsent && import.meta.env.DEV) {
      const hasConsentTool = !!(window.CookieYes || window.Cookiebot || window.OneTrust);
      if (!hasConsentTool) {
        hasConsent = true; // Assume consent in dev if no tool
      }
    }
    
    if (hasConsent) {
      if (import.meta.env.DEV) {
        console.log('HubSpot: Marketing cookies accepted, loading HubSpot...');
      }
      // Delay slightly to avoid conflicts with GA4/GTM
      setTimeout(() => {
        initHubspot(hubspotPortalId);
      }, 500);
    } else {
      // Listen for consent events
      const loadOnConsent = () => {
        if (import.meta.env.DEV) {
          console.log('HubSpot: Marketing cookies accepted, loading HubSpot...');
        }
        setTimeout(() => {
          initHubspot(hubspotPortalId);
        }, 500);
      };
      
      // CookieYes events
      if (window.CookieYes) {
        window.addEventListener('CookieYes', loadOnConsent);
      }
      
      // Cookiebot events
      if (window.Cookiebot) {
        window.addEventListener('CookiebotOnConsentReady', loadOnConsent);
        window.addEventListener('CookiebotOnAccept', loadOnConsent);
      }
      
      // OneTrust events
      if (window.OneTrust) {
        window.addEventListener('OneTrustGroupsUpdated', loadOnConsent);
      }
      
      if (import.meta.env.DEV) {
        console.warn('HubSpot: Waiting for marketing cookie consent...');
        console.warn('   HubSpot will load automatically when user accepts marketing cookies');
      }
    }
  };
  
  // Wait a bit for consent tools to initialize, then check
  setTimeout(checkConsentAndLoad, 1000);
} else {
  console.warn('HubSpot: VITE_HUBSPOT_PORTAL_ID not set in environment variables');
  // Even without Portal ID in env, static script in HTML will still work
  // Just initialize the queue for identifyContact to work
  if (typeof window !== 'undefined') {
    window._hsq = window._hsq || [];
  }
}

// Expose debug functions in development mode
if (import.meta.env.DEV && typeof window !== 'undefined') {
  window.debugHubSpot = debugHubSpot;
  window.forceProcessQueue = forceProcessQueue;
  window.monitorHubSpotInit = monitorHubSpotInit;
  window.diagnoseHubSpot = diagnoseHubSpot;
  window.loadHubSpotAfterConsent = loadHubSpotAfterConsent;
  window.fixHubSpotCookieAttribute = fixHubSpotCookieAttribute;
  console.log('💡 HubSpot Debug Tools:');
  console.log('   - debugHubSpot() - Quick status check');
  console.log('   - diagnoseHubSpot() - Comprehensive diagnostics (RECOMMENDED)');
  console.log('   - fixHubSpotCookieAttribute() - Fix missing data-cookieyes attribute');
  console.log('   - loadHubSpotAfterConsent() - Manually load HubSpot after consent');
  console.log('   - forceProcessQueue() - Force process queue if ready');
  console.log('   - monitorHubSpotInit() - Monitor HubSpot initialization');
  
  // Auto-monitor HubSpot initialization on page load
  setTimeout(() => {
    if (!window.__hubspotInitialized) {
      monitorHubSpotInit(15000);
    }
  }, 2000);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster 
      position="top-right"
      containerStyle={{
        top: 20,
        right: 20,
        zIndex: 9999,
      }}
      toastOptions={{
        duration: 3000, // 3 seconds default
        style: {
          background: '#fff',
          color: '#1a3d3a',
          border: '1px solid #e6f3f1',
          borderRadius: '8px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 9999,
        },
        success: {
          duration: 3000, // 3 seconds for success
          iconTheme: {
            primary: '#52c41a',
            secondary: '#fff',
          },
        },
        error: {
          duration: 3000, // 3 seconds for errors
          style: {
            background: '#fff',
            color: '#1a3d3a',
            border: '1px solid #ff7875',
            borderRadius: '8px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(255, 120, 117, 0.3)',
            zIndex: 9999,
          },
          iconTheme: {
            primary: '#ff7875',
            secondary: '#fff',
          },
        },
      }}
    />
  </React.StrictMode>,
)

