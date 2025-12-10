// HubSpot Diagnostics - Comprehensive troubleshooting tool

export const diagnoseHubSpot = () => {
  if (typeof window === 'undefined') {
    console.log('❌ Running on server - HubSpot only works in browser');
    return;
  }

  console.group('🔍 HubSpot Comprehensive Diagnostics');
  
  // 1. Check script tag
  const script = document.getElementById('hs-script-loader');
  console.log('\n1️⃣ Script Tag Check:');
  console.log('   Present:', !!script);
  if (script) {
    console.log('   Source:', script.src);
    console.log('   ReadyState:', script.readyState);
    console.log('   Complete:', script.complete);
    console.log('   Async:', script.async);
    console.log('   Defer:', script.defer);
    console.log('   CookieYes attr:', script.getAttribute('data-cookieyes'));
    console.log('   Script Loaded Flag:', window.__hubspotScriptLoaded);
    
    // Check if script actually loaded
    const scriptLoaded = script.readyState === 'complete' || script.readyState === 'loaded' || script.complete || window.__hubspotScriptLoaded;
    if (!scriptLoaded) {
      console.warn('   ⚠️ Script tag exists but script has NOT finished loading');
      console.warn('   Check Network tab to see if script request was made');
    } else {
      console.log('   ✅ Script appears to have loaded');
    }
  } else {
    console.error('   ❌ Script tag NOT found in DOM');
  }

  // 2. Check Network requests
  console.log('\n2️⃣ Network Check:');
  console.log('   ⚠️ MANUAL CHECK REQUIRED - Open Network tab in DevTools');
  console.log('   Look for: js.hs-scripts.com/50689111.js');
  console.log('   Expected status: 200 (OK)');
  console.log('   If ERR_BLOCKED_BY_CLIENT: Ad blocker is blocking');
  console.log('   If 404: Wrong portal ID');
  console.log('   If (pending): Script is still loading');
  console.log('   If (failed): Network/CORS issue');
  
  // Try to check if we can detect the request
  if (script && script.src) {
    console.log('   Script URL:', script.src);
    console.log('   Portal ID from URL:', script.src.match(/\/(\d+)\.js/)?.[1] || 'Not found');
  }

  // 3. Check queue
  const queue = window._hsq;
  console.log('\n3️⃣ Queue Check:');
  console.log('   Queue exists:', !!queue);
  console.log('   Queue type:', Array.isArray(queue) ? 'array (not processed)' : typeof queue);
  console.log('   Queue length:', Array.isArray(queue) ? queue.length : 'N/A (processed)');
  
  if (Array.isArray(queue)) {
    console.warn('   ⚠️ Queue is still an array - HubSpot has NOT processed it yet');
    console.warn('   This means HubSpot script loaded but HubSpot did not initialize');
  } else if (queue && typeof queue === 'object') {
    console.log('   ✅ Queue processed by HubSpot');
  }

  // 4. Check HubSpot API objects
  console.log('\n4️⃣ HubSpot API Check:');
  console.log('   hsConversationsAPI:', !!window.hsConversationsAPI);
  console.log('   HubSpotConversations:', !!window.HubSpotConversations);
  console.log('   _hsq (processed):', !!(queue && typeof queue === 'object' && !Array.isArray(queue)));
  
  const hasAPI = !!(window.hsConversationsAPI || window.HubSpotConversations);
  if (!hasAPI) {
    console.warn('   ⚠️ HubSpot API objects NOT found');
  }

  // 5. Check cookie consent
  console.log('\n5️⃣ Cookie Consent Check:');
  const cookieYesAttr = script?.getAttribute('data-cookieyes');
  if (cookieYesAttr) {
    console.warn('   ⚠️ Script has data-cookieyes="marketing" attribute');
    console.warn('   This means the script will NOT execute until user accepts marketing cookies');
    console.warn('   Check if CookieYes or similar tool is blocking the script');
    
    // Check for common cookie consent tools
    const hasCookieYes = !!window.CookieYes;
    const hasCookiebot = !!window.Cookiebot;
    const hasOneTrust = !!window.OneTrust;
    
    console.log('   CookieYes detected:', hasCookieYes);
    console.log('   Cookiebot detected:', hasCookiebot);
    console.log('   OneTrust detected:', hasOneTrust);
    
    if (hasCookieYes) {
      console.warn('   ⚠️ CookieYes is active - script will not run until marketing cookies accepted');
      console.warn('   Solution: Accept marketing cookies or remove data-cookieyes attribute');
    }
  } else {
    console.log('   ✅ No cookie consent attribute (script should execute)');
  }

  // 6. Check ad blockers
  console.log('\n6️⃣ Ad Blocker Check:');
  const blocked = window.__hubspotBlocked;
  console.log('   Blocked flag:', blocked);
  if (blocked) {
    console.warn('   ⚠️ Script load error detected (likely ad blocker)');
  }

  // 7. Check initialization flags
  console.log('\n7️⃣ Initialization Flags:');
  console.log('   __hubspotInitialized:', window.__hubspotInitialized);
  console.log('   __hubspotInitializing:', window.__hubspotInitializing);
  console.log('   __hubspotScriptTagExists:', window.__hubspotScriptTagExists);

  // 8. Check for conflicts
  console.log('\n8️⃣ Potential Conflicts:');
  const hasGTM = !!window.dataLayer;
  const hasGA4 = !!window.gtag;
  console.log('   GTM (dataLayer):', hasGTM);
  console.log('   GA4 (gtag):', hasGA4);
  
  if (hasGTM || hasGA4) {
    console.log('   ℹ️ Google Analytics/GTM detected - should not conflict');
  }

  // 9. Summary and recommendations
  console.log('\n9️⃣ Summary & Recommendations:');
  
  const issues = [];
  const recommendations = [];
  
  if (!script) {
    issues.push('Script tag not found');
    recommendations.push('Check if initHubspot() is being called');
  } else if (script && !script.complete && script.readyState !== 'complete') {
    issues.push('Script not loaded yet');
    recommendations.push('Wait a few seconds and check again');
  }
  
  if (Array.isArray(queue)) {
    issues.push('HubSpot queue not processed');
    recommendations.push('HubSpot script may be blocked or not initializing');
  }
  
  if (cookieYesAttr) {
    issues.push('Cookie consent may be blocking script');
    recommendations.push('Accept marketing cookies or remove data-cookieyes attribute');
  }
  
  if (blocked) {
    issues.push('Script blocked by ad blocker');
    recommendations.push('Disable ad blocker or test in incognito mode');
  }
  
  if (issues.length === 0) {
    console.log('   ✅ No obvious issues found');
    console.log('   If HubSpot still not working, check:');
    console.log('   1. Network tab for script loading errors');
    console.log('   2. Console for JavaScript errors');
    console.log('   3. HubSpot portal ID is correct');
  } else {
    console.warn('   ⚠️ Issues found:');
    issues.forEach((issue, i) => {
      console.warn(`   ${i + 1}. ${issue}`);
    });
    console.log('\n   💡 Recommendations:');
    recommendations.forEach((rec, i) => {
      console.log(`   ${i + 1}. ${rec}`);
    });
  }
  
  console.groupEnd();
  
  return {
    scriptExists: !!script,
    scriptLoaded: script ? (script.complete || script.readyState === 'complete') : false,
    queueProcessed: !!(queue && typeof queue === 'object' && !Array.isArray(queue)),
    hasAPI: !!(window.hsConversationsAPI || window.HubSpotConversations),
    cookieConsent: !!cookieYesAttr,
    blocked: blocked,
    issues,
    recommendations
  };
};

export default diagnoseHubSpot;

