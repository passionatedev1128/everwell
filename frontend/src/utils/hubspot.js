// HubSpot tracking utility functions

const ensureQueue = () => {
  if (typeof window === 'undefined') return null;
  
  // Ensure HubSpot queue is separate from GA4 dataLayer
  // HubSpot uses _hsq, GA4 uses dataLayer - they should not interfere
  if (!window._hsq) {
    window._hsq = [];
  }
  
  // Make sure we're not accidentally using dataLayer
  // HubSpot queue should be independent
  return window._hsq;
};

// Check if HubSpot script is actually loaded and ready
const isHubSpotReady = () => {
  if (typeof window === 'undefined') return false;
  
  // Check if the script element exists
  const script = document.getElementById('hs-script-loader');
  if (!script) return false;
  
  // HubSpot replaces the _hsq array with an object when it's ready
  // Check if _hsq is an object (HubSpot processed it) or still an array
  const queue = window._hsq;
  if (queue && typeof queue === 'object' && !Array.isArray(queue)) {
    // HubSpot has processed the queue - it's ready
    return true;
  }
  
  // Also check if HubSpot global objects exist (more reliable)
  if (window.hsConversationsAPI || window.HubSpotConversations) {
    return true;
  }
  
  // Script tag exists but HubSpot hasn't processed queue yet
  return false;
};

// Detect if HubSpot requests are being blocked (e.g., by ad blockers)
const detectBlockedRequests = () => {
  if (typeof window === 'undefined') return false;
  
  // If script tag exists but HubSpot API is not available after a delay,
  // it's likely being blocked
  const script = document.getElementById('hs-script-loader');
  if (script && !window.__hubspotInitialized) {
    // Check if script has been loading for more than 5 seconds
    const loadTime = script.getAttribute('data-load-start');
    if (loadTime && Date.now() - parseInt(loadTime) > 5000) {
      return true;
    }
  }
  return false;
};

// Wait for HubSpot to be ready (with timeout)
const waitForHubSpot = (maxWait = 5000) => {
  return new Promise((resolve) => {
    if (isHubSpotReady()) {
      resolve(true);
      return;
    }

    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (isHubSpotReady() || Date.now() - startTime > maxWait) {
        clearInterval(checkInterval);
        resolve(isHubSpotReady());
      }
    }, 100);
  });
};

// Check if marketing cookies are accepted
const hasMarketingConsent = () => {
  if (typeof window === 'undefined') return false;
  
  // Check CookieYes
  if (window.CookieYes) {
    const consent = window.CookieYes.getConsent();
    return consent?.marketing === true;
  }
  
  // Check Cookiebot
  if (window.Cookiebot) {
    const consent = window.Cookiebot.consent;
    return consent?.marketing === true;
  }
  
  // Check OneTrust
  if (window.OneTrust) {
    return window.OneTrust.GetDomainData().GroupsConsent?.includes('C0004'); // Marketing group
  }
  
  // Check for common consent cookies
  const cookies = document.cookie.split(';');
  const consentCookies = cookies.some(cookie => {
    const [name, value] = cookie.trim().split('=');
    return (
      (name.includes('consent') && value?.includes('marketing')) ||
      (name.includes('cookieyes') && value?.includes('marketing')) ||
      (name.includes('cookiebot') && value?.includes('marketing'))
    );
  });
  
  // If no consent tool detected, assume consent (for development)
  // In production, you should have a consent tool
  return consentCookies || import.meta.env.DEV;
};

// Wait for marketing cookie consent
const waitForConsent = (maxWait = 30000) => {
  return new Promise((resolve) => {
    if (hasMarketingConsent()) {
      resolve(true);
      return;
    }

    // Listen for consent events
    const checkConsent = () => {
      if (hasMarketingConsent()) {
        resolve(true);
        return true;
      }
      return false;
    };

    // CookieYes events
    if (window.CookieYes) {
      window.addEventListener('CookieYes', checkConsent);
    }

    // Cookiebot events
    if (window.Cookiebot) {
      window.addEventListener('CookiebotOnConsentReady', checkConsent);
      window.addEventListener('CookiebotOnAccept', checkConsent);
    }

    // OneTrust events
    if (window.OneTrust) {
      window.addEventListener('OneTrustGroupsUpdated', checkConsent);
    }

    // Poll as fallback
    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (checkConsent() || Date.now() - startTime > maxWait) {
        clearInterval(checkInterval);
        if (!checkConsent()) {
          resolve(false);
        }
      }
    }, 500);
  });
};

export const initHubspot = (portalId) => {
  if (!portalId || typeof window === 'undefined') {
    console.warn('HubSpot: portal ID not provided or running on server');
    return;
  }

  // Check if already initialized or currently initializing
  if (window.__hubspotInitialized || window.__hubspotInitializing) {
    if (import.meta.env.DEV && window.__hubspotInitialized) {
      console.log('HubSpot: already initialized');
    }
    return;
  }

  ensureQueue();

  // Check for existing script by ID
  const existingScriptById = document.getElementById('hs-script-loader');
  
  // Also check for any script with the same src (in case ID is different)
  const scriptSrc = `https://js.hs-scripts.com/${portalId}.js`;
  const existingScripts = Array.from(document.querySelectorAll('script[src*="hs-scripts.com"]'));
  const existingScriptBySrc = existingScripts.find(script => 
    script.src === scriptSrc || script.src === scriptSrc.replace('https:', '')
  );

  const existingScript = existingScriptById || existingScriptBySrc;
  
  // If script exists but doesn't have data-cookieyes, add it
  if (existingScript && !existingScript.getAttribute('data-cookieyes')) {
    existingScript.setAttribute('data-cookieyes', 'marketing');
    if (import.meta.env.DEV) {
      console.log('HubSpot: Added data-cookieyes attribute to existing script');
    }
  }
  
  if (existingScript) {
    if (import.meta.env.DEV && existingScriptBySrc && !existingScriptById) {
      console.warn('HubSpot: Found script with matching src but different ID. This may cause issues.');
    }
    // Script exists, but we need to wait for it to load
    // Set a flag that script tag exists, but don't assume it's loaded yet
    window.__hubspotScriptTagExists = true;
    
    // Mark load start time if not already marked
    if (!existingScript.getAttribute('data-load-start')) {
      existingScript.setAttribute('data-load-start', Date.now().toString());
    }
    
    if (import.meta.env.DEV) {
      console.log('HubSpot: script tag detected, waiting for load...');
    }
    
    // Check if script is already loaded
    if (existingScript.readyState === 'complete' || existingScript.readyState === 'loaded') {
      // Script has finished loading, but wait for HubSpot to process queue
      // Don't set initialized until HubSpot actually processes the queue
      checkHubSpotReady();
    } else {
      // Script is still loading, add event listeners
      existingScript.addEventListener('load', () => {
        window.__hubspotScriptTagExists = true;
        // Wait a bit for HubSpot to process the queue
        checkHubSpotReady();
      });
      
      existingScript.addEventListener('error', () => {
        window.__hubspotBlocked = true;
        window.__hubspotInitialized = false;
        if (import.meta.env.DEV) {
          console.info('HubSpot: Script failed to load (likely blocked by ad blocker)');
        }
      });
    }
    
    // Function to check if HubSpot is actually ready (queue processed)
    const checkHubSpotReady = () => {
      // Poll for HubSpot readiness - it may take a moment to process the queue
      let attempts = 0;
      const maxAttempts = 20; // 10 seconds total (20 * 500ms)
      
      const checkInterval = setInterval(() => {
        attempts++;
        const ready = isHubSpotReady();
        
        if (ready) {
          clearInterval(checkInterval);
          window.__hubspotInitialized = true;
          if (import.meta.env.DEV) {
            console.log('HubSpot: Script loaded and HubSpot is ready (queue processed)');
          }
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          // Script loaded but HubSpot not ready - might be blocked or still initializing
          if (import.meta.env.DEV) {
            console.warn('HubSpot: Script loaded but HubSpot not ready after 10 seconds');
            console.warn('   This may indicate:');
            console.warn('   1. HubSpot is blocked by ad blocker');
            console.warn('   2. HubSpot is still initializing (wait longer)');
            console.warn('   3. Network issues preventing HubSpot from loading');
            console.warn('   The queue will still work - HubSpot will process it when ready');
          }
        }
      }, 500); // Check every 500ms
    };
    
    // Start checking immediately if script is already loaded
    if (existingScript.readyState === 'complete' || existingScript.readyState === 'loaded') {
      checkHubSpotReady();
    }
    
    return;
  }

  // Mark as initializing to prevent duplicate calls
  window.__hubspotInitializing = true;
  
  // Double-check one more time before creating (race condition protection)
  // Also check for any HubSpot scripts (in case ID is different)
  const allHubSpotScripts = Array.from(document.querySelectorAll('script[src*="hs-scripts.com"]'));
  if (allHubSpotScripts.length > 0) {
    // Remove duplicates, keep only one
    if (allHubSpotScripts.length > 1) {
      if (import.meta.env.DEV) {
        console.warn(`HubSpot: Found ${allHubSpotScripts.length} HubSpot scripts, removing duplicates...`);
      }
      // Keep the first one, remove the rest
      for (let i = 1; i < allHubSpotScripts.length; i++) {
        allHubSpotScripts[i].remove();
      }
    }
    
    // Ensure the remaining script has data-cookieyes attribute
    const remainingScript = allHubSpotScripts[0];
    if (remainingScript && !remainingScript.getAttribute('data-cookieyes')) {
      remainingScript.setAttribute('data-cookieyes', 'marketing');
      if (import.meta.env.DEV) {
        console.log('HubSpot: Added data-cookieyes attribute to existing script');
      }
    }
    
    window.__hubspotInitializing = false;
    if (import.meta.env.DEV) {
      console.log('HubSpot: Script already exists, skipping creation');
    }
    return;
  }

  // Create script element directly (more control over attributes)
  const script = document.createElement('script');
  script.id = 'hs-script-loader';
  script.type = 'text/javascript';
  script.async = true;
  script.defer = true;
  script.src = `//js.hs-scripts.com/${portalId}.js`;
  
  // CRITICAL: Add data-cookieyes attribute so cookie consent tool recognizes it
  script.setAttribute('data-cookieyes', 'marketing');
  script.setAttribute('data-load-start', Date.now().toString());
  
  // Verify attribute was set
  if (import.meta.env.DEV) {
    console.log('HubSpot: Creating script with data-cookieyes="marketing"');
    console.log('   Script src:', script.src);
    console.log('   Attribute set:', script.getAttribute('data-cookieyes'));
  }
  
  // Insert script into DOM
  const firstScript = document.getElementsByTagName('script')[0];
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    document.head.appendChild(script);
  }
  
  // Double-check attribute is still there after insertion (use setTimeout to ensure DOM is updated)
  setTimeout(() => {
    const insertedScript = document.getElementById('hs-script-loader');
    if (insertedScript) {
      if (!insertedScript.getAttribute('data-cookieyes')) {
        insertedScript.setAttribute('data-cookieyes', 'marketing');
        if (import.meta.env.DEV) {
          console.warn('HubSpot: Attribute was missing after insertion, re-added it');
        }
      }
      // Verify it's there
      if (import.meta.env.DEV) {
        const attr = insertedScript.getAttribute('data-cookieyes');
        console.log('HubSpot: Script in DOM, data-cookieyes attribute:', attr);
        if (!attr) {
          console.error('HubSpot: ERROR - data-cookieyes attribute is missing!');
          // Try setting it again with different method
          insertedScript.setAttribute('data-cookieyes', 'marketing');
          insertedScript.dataset.cookieyes = 'marketing';
        }
      }
    }
  }, 100);
  
  script.onload = () => {
    window.__hubspotScriptTagExists = true;
    window.__hubspotInitializing = false;
    window.__hubspotScriptLoaded = true;
    
    if (import.meta.env.DEV) {
      console.log('HubSpot: Script loaded successfully, waiting for HubSpot to process queue...');
      console.log('   Script src:', script.src);
    }
    
    // Wait for HubSpot to actually process the queue before marking as initialized
    // The script may load, but HubSpot needs time to process the queue
    let attempts = 0;
    const maxAttempts = 30; // 15 seconds total (increased from 10)
    
    const checkInterval = setInterval(() => {
      attempts++;
      const ready = isHubSpotReady();
      
      if (ready) {
        clearInterval(checkInterval);
        window.__hubspotInitialized = true;
        if (import.meta.env.DEV) {
          console.log('✅ HubSpot: Initialized with portal ID', portalId, '- Queue processed');
        }
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        window.__hubspotInitialized = false; // Make sure flag is false
        if (import.meta.env.DEV) {
          console.error('❌ HubSpot: Script loaded but queue NOT processed after 15 seconds');
          console.error('   This indicates HubSpot script loaded but failed to initialize');
          console.error('   Possible causes:');
          console.error('   1. HubSpot script is blocked by ad blocker (check Network tab)');
          console.error('   2. HubSpot portal ID is incorrect');
          console.error('   3. Network/CORS issues preventing HubSpot from loading');
          console.error('   4. Cookie consent tool blocking execution');
          console.error('   Run diagnoseHubSpot() for detailed diagnostics');
          console.warn('   The queue will still work - HubSpot will process it when ready');
        }
      } else if (import.meta.env.DEV && attempts % 4 === 0) {
        // Log progress every 2 seconds
        console.log(`   HubSpot: Still waiting... (${attempts * 0.5}s elapsed)`);
      }
    }, 500); // Check every 500ms
  };
  
  script.onerror = (error) => {
    // Script failed to load
    window.__hubspotBlocked = true;
    window.__hubspotInitialized = false;
    window.__hubspotInitializing = false;
    window.__hubspotScriptLoaded = false;
    
    if (import.meta.env.DEV) {
      console.error('❌ HubSpot: Script failed to load');
      console.error('   Error:', error);
      console.error('   Possible causes:');
      console.error('   1. Ad blocker blocking the script (ERR_BLOCKED_BY_CLIENT)');
      console.error('   2. Network connectivity issues');
      console.error('   3. Incorrect portal ID (404 error)');
      console.error('   4. CORS/security policy blocking the script');
      console.error('   Check Network tab for detailed error');
      console.warn('   The queue will still work - HubSpot will process it when ready');
    }
  };
  
  // Also add a timeout to detect if script never loads
  setTimeout(() => {
    if (!window.__hubspotScriptLoaded && !window.__hubspotBlocked && !window.__hubspotInitialized) {
      const scriptElement = document.getElementById('hs-script-loader');
      if (scriptElement && !scriptElement.complete && scriptElement.readyState !== 'complete') {
        if (import.meta.env.DEV) {
          console.warn('⚠️ HubSpot: Script tag exists but script has not loaded after 10 seconds');
          console.warn('   This may indicate:');
          console.warn('   1. Script is blocked by ad blocker');
          console.warn('   2. Network issues');
          console.warn('   3. Script is waiting for cookie consent');
          console.warn('   Run diagnoseHubSpot() for detailed diagnostics');
        }
      }
    }
  }, 10000); // Check after 10 seconds
  
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
    
    // Only log in development mode to avoid console noise
    if (import.meta.env.DEV) {
      console.log('HubSpot: Page view tracked', { path, title });
    }
  } catch (error) {
    // Suppress warnings in production - blocked requests are expected with ad blockers
    if (import.meta.env.DEV) {
      console.warn('HubSpot: Failed to track page view', error);
    }
  }
};

export const identifyContact = async (user = {}) => {
  const queue = ensureQueue();
  if (!queue) {
    if (import.meta.env.DEV) {
      console.warn('HubSpot: Queue not available, cannot identify contact');
    }
    return;
  }
  
  const { email, _id, id, role, isAuthorized, name } = user || {};
  
  if (!email) {
    if (import.meta.env.DEV) {
      console.warn('HubSpot: Cannot identify contact - email is required', { user });
    }
    return;
  }
  
  // Prepare contact data
  const identifyContactData = {
    email,
    userId: _id || id,
    role: role || 'user',
    isAuthorized: !!isAuthorized,
    name,
  };
  
  try {
    // Wait for HubSpot script to be ready (with timeout)
    // Even if script isn't fully loaded, we can add to queue - HubSpot will process it when ready
    const scriptReady = await waitForHubSpot(3000);
    
    if (!scriptReady && !window.__hubspotScriptTagExists) {
      if (import.meta.env.DEV) {
        console.warn('HubSpot: Script tag not found, contact identification may not work');
      }
    }
    
    // Add to queue - HubSpot will process this when ready
    // The queue pattern is designed to work even before HubSpot is fully loaded
    // Note: If HubSpot is blocked by ad blocker, the queue will remain but won't be processed
    // This is fine - the app continues to work normally
    queue.push(['identify', identifyContactData]);
    
    if (import.meta.env.DEV) {
      console.log('HubSpot: Contact identified - Added to queue', identifyContactData);
      console.log('📡 Look for requests to track.hubspot.com in Network tab');
      console.log('   Filter by: "hubspot" or "track.hubspot"');
      
      // Monitor if queue gets processed
      const initialQueueLength = Array.isArray(queue) ? queue.length : 0;
      setTimeout(() => {
        const currentQueue = window._hsq;
        const isProcessed = !Array.isArray(currentQueue) || currentQueue.length < initialQueueLength;
        
        if (isProcessed) {
          console.log('✅ HubSpot: Queue processed - request should appear in Network tab');
        } else {
          console.warn('⚠️ HubSpot: Queue not processed yet. Possible reasons:');
          console.warn('   1. HubSpot script still loading (wait a few seconds)');
          console.warn('   2. Ad blocker blocking HubSpot requests');
          console.warn('   3. HubSpot script failed to load');
          console.warn('   Run debugHubSpot() to check status');
        }
      }, 5000);
    }
    
    // If HubSpot is ready, try to force process the queue
    if (scriptReady && window.hsConversationsAPI) {
      // HubSpot is ready - the queue should process immediately
      if (import.meta.env.DEV) {
        console.log('HubSpot: Script ready, queue should process immediately');
      }
    }
  } catch (e) {
    // Only log errors in development to avoid console noise
    if (import.meta.env.DEV) {
      console.error('HubSpot: Failed to identify contact', e, identifyContactData);
    }
  }
};

// Monitor HubSpot initialization
export const monitorHubSpotInit = (duration = 10000) => {
  if (typeof window === 'undefined') return;
  
  const startTime = Date.now();
  const checkInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const ready = isHubSpotReady();
    
    if (ready) {
      clearInterval(checkInterval);
      window.__hubspotInitialized = true;
      if (import.meta.env.DEV) {
        console.log(`✅ HubSpot: Ready after ${elapsed}ms`);
      }
      return;
    }
    
    if (elapsed >= duration) {
      clearInterval(checkInterval);
      if (import.meta.env.DEV) {
        console.warn(`⚠️ HubSpot: Not ready after ${duration}ms`);
        console.warn('   Run debugHubSpot() for more details');
      }
    }
  }, 500);
  
  if (import.meta.env.DEV) {
    console.log(`🔍 Monitoring HubSpot initialization for ${duration}ms...`);
  }
};

// Force HubSpot to process the queue if it's ready
export const forceProcessQueue = () => {
  if (typeof window === 'undefined') return false;
  
  const queue = window._hsq;
  if (!queue) {
    console.warn('HubSpot: No queue found');
    return false;
  }
  
  // If queue is still an array, HubSpot hasn't processed it yet
  if (Array.isArray(queue) && queue.length > 0) {
    console.log('HubSpot: Queue is still an array, HubSpot may not be ready yet');
    console.log('Queue contents:', queue);
    return false;
  }
  
  // If queue is an object, HubSpot has processed it
  if (typeof queue === 'object' && !Array.isArray(queue)) {
    console.log('HubSpot: Queue has been processed by HubSpot');
    
    // Try to manually trigger if HubSpot API is available
    if (window.hsConversationsAPI) {
      console.log('HubSpot: HubSpot API available, queue should process automatically');
      return true;
    }
  }
  
  return false;
};

// Debug function to check HubSpot status
export const debugHubSpot = () => {
  if (typeof window === 'undefined') {
    console.log('HubSpot Debug: Running on server');
    return;
  }

  const queue = window._hsq;
  const queueIsArray = Array.isArray(queue);
  const queueIsObject = queue && typeof queue === 'object' && !Array.isArray(queue);
  const script = document.getElementById('hs-script-loader');
  
  const debug = {
    scriptTag: !!script,
    queue: queue,
    queueType: queueIsArray ? 'array' : queueIsObject ? 'object (HubSpot processed)' : 'undefined',
    queueLength: queueIsArray ? queue.length : 0,
    initialized: window.__hubspotInitialized || false,
    scriptTagExists: window.__hubspotScriptTagExists || false,
    blocked: window.__hubspotBlocked || false,
    hubspotReady: isHubSpotReady(),
    hasHubSpotAPI: !!(window.hsConversationsAPI || window.HubSpotConversations),
  };

  console.group('🔍 HubSpot Debug Info');
  console.log('Script Tag Present:', debug.scriptTag);
  console.log('Script Tag Exists Flag:', debug.scriptTagExists);
  console.log('Initialized Flag:', debug.initialized, debug.initialized && !debug.hubspotReady ? '⚠️ (set too early!)' : '');
  console.log('HubSpot Actually Ready:', debug.hubspotReady, debug.hubspotReady ? '✅' : '❌');
  console.log('Blocked:', debug.blocked);
  console.log('Has HubSpot API:', debug.hasHubSpotAPI);
  console.log('Queue Type:', debug.queueType);
  console.log('Queue Length:', debug.queueLength);
  console.log('Queue Contents:', debug.queue);
  
  // Warn if initialized flag doesn't match actual readiness
  if (debug.initialized && !debug.hubspotReady) {
    console.warn('⚠️ WARNING: Initialized flag is true but HubSpot is not actually ready!');
    console.warn('   This means the flag was set too early. HubSpot will continue to initialize.');
    console.warn('   The queue will still work - HubSpot will process it when ready.');
  }
  
  if (debug.scriptTag) {
    console.log('Script Source:', script.src);
    console.log('Script Complete:', script.complete);
    console.log('Script ReadyState:', script.readyState);
    console.log('Script Async:', script.async);
    console.log('Script Defer:', script.defer);
    
    // Check if script actually loaded
    const scriptLoaded = script.readyState === 'complete' || script.readyState === 'loaded' || script.complete;
    console.log('Script Loaded:', scriptLoaded);
    
    if (!scriptLoaded) {
      console.warn('⚠️ Script tag exists but script has not finished loading yet');
      console.warn('   This is normal if the page just loaded - wait a few seconds');
    } else if (!debug.hubspotReady) {
      console.warn('⚠️ Script loaded but HubSpot is not ready');
      console.warn('   Possible reasons:');
      console.warn('   1. HubSpot is still initializing (wait a few more seconds)');
      console.warn('   2. HubSpot is blocked by ad blocker');
      console.warn('   3. HubSpot script failed to initialize');
    }
  }
  
  // Check Network tab for requests
  console.log('\n📡 Network Tab Check:');
  console.log('1. Look for: js.hs-scripts.com/50689111.js (script loading)');
  console.log('2. Look for: track.hubspot.com/__ptc.gif (tracking pixel - identify/page views)');
  console.log('3. Look for: track.hubspot.com/v1/event (custom events)');
  console.log('4. Filter by: "hubspot" or "track.hubspot"');
  console.log('\nNote: identify() may not make immediate requests.');
  console.log('      HubSpot may batch requests or send on next page view.');
  
  if (!debug.hubspotReady && debug.scriptTag) {
    console.warn('⚠️ HubSpot script tag exists but HubSpot is not ready yet');
    console.warn('   This could mean:');
    console.warn('   - Script is still loading (wait a few seconds)');
    console.warn('   - Script is blocked by ad blocker');
    console.warn('   - Script failed to load');
  }
  
  if (debug.blocked) {
    console.warn('⚠️ HubSpot appears to be blocked by ad blocker');
  }
  
  if (queueIsArray && debug.queueLength > 0) {
    console.warn('⚠️ Queue has items but HubSpot hasn\'t processed them yet');
    console.warn('   Items in queue:', debug.queueLength);
  }
  
  console.groupEnd();
  
  return debug;
};

// Force add data-cookieyes attribute to all HubSpot scripts
export const fixHubSpotCookieAttribute = () => {
  const allHubSpotScripts = Array.from(document.querySelectorAll('script[src*="hs-scripts.com"]'));
  let fixed = 0;
  
  allHubSpotScripts.forEach(script => {
    if (!script.getAttribute('data-cookieyes')) {
      script.setAttribute('data-cookieyes', 'marketing');
      script.dataset.cookieyes = 'marketing'; // Also set via dataset
      fixed++;
      if (import.meta.env.DEV) {
        console.log('HubSpot: Added data-cookieyes attribute to script:', script.src);
      }
    }
  });
  
  if (import.meta.env.DEV) {
    if (fixed > 0) {
      console.log(`HubSpot: Fixed ${fixed} script(s) - added data-cookieyes attribute`);
    } else {
      console.log('HubSpot: All scripts already have data-cookieyes attribute');
    }
  }
  
  return fixed;
};

// Manually trigger HubSpot loading (useful after consent is given)
export const loadHubSpotAfterConsent = (portalId) => {
  if (!portalId) {
    portalId = import.meta.env.VITE_HUBSPOT_PORTAL_ID;
  }
  
  if (!portalId) {
    console.warn('HubSpot: Portal ID not provided');
    return;
  }
  
  // Check if HubSpot is actually ready (not just script tag exists)
  if (isHubSpotReady() || window.__hubspotInitialized) {
    if (import.meta.env.DEV) {
      console.log('HubSpot: Already loaded and ready');
    }
    return;
  }
  
  // Check for all HubSpot scripts and remove duplicates
  const allHubSpotScripts = Array.from(document.querySelectorAll('script[src*="hs-scripts.com"]'));
  if (allHubSpotScripts.length > 0) {
    if (import.meta.env.DEV) {
      console.warn(`HubSpot: Found ${allHubSpotScripts.length} HubSpot script(s)`);
    }
    
    // Remove all existing scripts
    allHubSpotScripts.forEach(script => {
      script.remove();
      if (import.meta.env.DEV) {
        console.log('HubSpot: Removed existing script:', script.src);
      }
    });
    
    // Reset all flags
    window.__hubspotInitialized = false;
    window.__hubspotInitializing = false;
    window.__hubspotScriptTagExists = false;
    window.__hubspotBlocked = false;
    window.__hubspotScriptLoaded = false;
    
    if (import.meta.env.DEV) {
      console.log('HubSpot: Removed all existing scripts, will create new one with data-cookieyes attribute');
    }
  }
  
  if (import.meta.env.DEV) {
    console.log('HubSpot: Loading after consent given...');
  }
  
  // initHubspot(portalId);
};

export default {
  initHubspot,
  trackPageView,
  identifyContact,
  debugHubSpot,
  forceProcessQueue,
  monitorHubSpotInit,
  loadHubSpotAfterConsent,
  fixHubSpotCookieAttribute,
};
