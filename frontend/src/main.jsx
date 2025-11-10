import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast'
import { initGA4 } from './utils/analytics'
import { initHubspot } from './utils/hubspot'
import { initGTM } from './utils/gtm'

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
const hubspotPortalId = import.meta.env.VITE_HUBSPOT_PORTAL_ID;
if (hubspotPortalId) {
  initHubspot(hubspotPortalId);
} else {
  console.warn('HubSpot: VITE_HUBSPOT_PORTAL_ID not set in environment variables');
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

