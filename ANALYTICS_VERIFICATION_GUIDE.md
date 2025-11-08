# Analytics Verification Guide

This guide shows you how to verify that Google Analytics 4, Facebook Pixel, and Google Tag Manager are working correctly.

## Quick Verification Checklist

- [ ] Check browser console for initialization messages
- [ ] Verify dataLayer is populated
- [ ] Test GA4 with DebugView
- [ ] Test Facebook Pixel with Events Manager
- [ ] Test GTM with Preview Mode
- [ ] Check Network tab for tracking requests

---

## 1. Browser Console Verification

### Step 1: Open Developer Tools
1. Press `F12` or `Right-click → Inspect`
2. Go to the **Console** tab

### Step 2: Check Initialization Messages

You should see these messages when the page loads:

```
✅ GA4: Initialized with measurement ID G-XXXXXXXXXX
✅ Facebook Pixel: Initialized with Pixel ID 123456789012345
✅ GTM: DataLayer initialized for container GTM-XXXXXXX
```

**If you see warnings:**
- `GA4: VITE_GA4_MEASUREMENT_ID not set` → Add to `.env.local`
- `Facebook Pixel: VITE_FACEBOOK_PIXEL_ID not set` → Add to `.env.local`
- `GTM: VITE_GTM_CONTAINER_ID not set` → Add to `.env.local`

### Step 3: Check Event Tracking

Navigate through your app and you should see:
```
✅ GA4: Event tracked { eventName: 'page_view', ... }
✅ Facebook Pixel: Event tracked { eventName: 'PageView', ... }
✅ GTM: Event pushed to dataLayer { event: 'page_view', ... }
```

---

## 2. Check dataLayer (GTM)

### In Browser Console:
```javascript
// Check if dataLayer exists
window.dataLayer

// You should see an array with objects like:
[
  { event: 'page_view', page_path: '/', page_title: '...' },
  { event: 'view_item', ecommerce: {...} },
  // ... more events
]

// Check latest event
window.dataLayer[window.dataLayer.length - 1]

// Filter specific events
window.dataLayer.filter(item => item.event === 'purchase')
```

---

## 3. Network Tab Verification

### Step 1: Open Network Tab
1. Press `F12` → Go to **Network** tab
2. Clear the network log (🚫 icon)

### Step 2: Filter and Check Requests

**For GA4:**
- Filter by: `collect` or `google-analytics`
- You should see requests to: `https://www.google-analytics.com/g/collect`
- Click on a request → **Payload** tab to see event data

**For Facebook Pixel:**
- Filter by: `facebook` or `fbevents`
- You should see requests to: `https://www.facebook.com/tr`
- Click on a request → **Payload** tab to see event data

**For GTM:**
- Filter by: `googletagmanager`
- You should see requests to: `https://www.googletagmanager.com/gtm.js`
- And requests to: `https://www.googletagmanager.com/r/...`

---

## 4. Google Analytics 4 Verification

### Method 1: GA4 DebugView (Real-time)

1. **Install Google Analytics Debugger:**
   - Chrome: [Install Extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
   - Enable it (click the extension icon)

2. **Open GA4 DebugView:**
   - Go to [Google Analytics](https://analytics.google.com/)
   - Select your property
   - Go to **Admin** → **DebugView** (under Property column)

3. **Test:**
   - Navigate through your app
   - Events should appear in real-time in DebugView
   - You should see: `page_view`, `view_item`, `add_to_cart`, etc.

### Method 2: GA4 Realtime Reports

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. Go to **Reports** → **Realtime**
4. Navigate through your app
5. You should see active users and events (may take a few seconds)

### Method 3: Browser Console

```javascript
// Check if gtag is loaded
window.gtag

// Manually trigger an event
gtag('event', 'test_event', {
  test_param: 'test_value'
})

// Check dataLayer
window.dataLayer
```

---

## 5. Facebook Pixel Verification

### Method 1: Facebook Events Manager (Real-time)

1. **Go to Events Manager:**
   - [Facebook Events Manager](https://business.facebook.com/events_manager2)
   - Select your pixel

2. **Use Test Events:**
   - Click **Test Events** tab
   - Enter your website URL: `http://localhost:5173` (or production URL)
   - Click **Open Website**
   - Navigate through your app
   - Events should appear in real-time

### Method 2: Facebook Pixel Helper (Chrome Extension)

1. **Install Extension:**
   - [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)

2. **Test:**
   - Navigate to your website
   - Click the extension icon
   - You should see:
     - ✅ Pixel ID detected
     - ✅ Events fired (PageView, ViewContent, etc.)

### Method 3: Browser Console

```javascript
// Check if fbq is loaded
window.fbq

// Manually trigger an event
fbq('track', 'PageView')

// Check for errors
window.fbq.queue
```

---

## 6. Google Tag Manager Verification

### Method 1: GTM Preview Mode (Best Method)

1. **Go to Google Tag Manager:**
   - [Google Tag Manager](https://tagmanager.google.com/)
   - Select your container

2. **Enter Preview Mode:**
   - Click **Preview** button (top right)
   - Enter your website URL: `http://localhost:5173` (or production URL)
   - Click **Connect**

3. **Test:**
   - A new window opens with GTM Preview panel
   - Navigate through your app
   - In the Preview panel, you should see:
     - **Tags Fired**: Which tags were triggered
     - **Triggers**: Which triggers activated
     - **Variables**: Variable values
     - **DataLayer**: Events pushed to dataLayer

### Method 2: Browser Console

```javascript
// Check if dataLayer exists
window.dataLayer

// Check GTM container
window.google_tag_manager

// Manually push event
window.dataLayer.push({
  event: 'test_event',
  test_param: 'test_value'
})
```

### Method 3: GTM Container Status

1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Select your container
3. Check **Versions** → Make sure container is **Published**
4. Check **Tags** → Verify tags are configured
5. Check **Triggers** → Verify triggers are set up

---

## 7. Testing Specific Events

### Test Page View
1. Navigate to any page
2. Check console: Should see `page_view` event
3. Check dataLayer: Should have `{ event: 'page_view', ... }`

### Test Product View
1. Go to `/produtos`
2. Click on a product
3. Check console: Should see `view_item` / `ViewContent` events
4. Check dataLayer: Should have product information

### Test Add to Cart
1. Go to a product detail page
2. Click "Adicionar ao Carrinho"
3. Check console: Should see `add_to_cart` / `AddToCart` events
4. Check dataLayer: Should have product and quantity

### Test Checkout
1. Add items to cart
2. Go to `/checkout`
3. Check console: Should see `begin_checkout` / `InitiateCheckout` events
4. Check dataLayer: Should have cart items and total

### Test Purchase
1. Complete an order
2. Check console: Should see `purchase` / `Purchase` events
3. Check dataLayer: Should have order ID, total, items

### Test Registration
1. Register a new account
2. Check console: Should see `sign_up` / `CompleteRegistration` events
3. Check dataLayer: Should have registration method

---

## 8. Common Issues & Solutions

### Issue: No initialization messages in console

**Solution:**
1. Check `.env.local` file exists in `frontend/` directory
2. Verify environment variables are set:
   ```env
   VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
   VITE_FACEBOOK_PIXEL_ID=123456789012345
   VITE_GTM_CONTAINER_ID=GTM-XXXXXXX
   ```
3. Restart development server:
   ```bash
   cd frontend
   npm run dev
   ```

### Issue: Events not showing in GA4/Facebook/GTM

**Solutions:**
1. **Wait a few minutes** - Some platforms have delays
2. **Check ad blockers** - Disable for testing
3. **Use DebugView/Test Events/Preview Mode** for real-time verification
4. **Check browser console** for errors
5. **Verify IDs are correct** - Double-check measurement ID, pixel ID, container ID

### Issue: dataLayer is empty

**Solution:**
1. Check that GTM script is loading (Network tab)
2. Verify `VITE_GTM_CONTAINER_ID` is set
3. Check browser console for errors
4. Make sure GTM container is published

### Issue: Network requests not appearing

**Solution:**
1. Clear browser cache
2. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Check Network tab filters are correct
4. Disable ad blockers
5. Try incognito/private mode

---

## 9. Quick Test Script

Run this in your browser console to test all three:

```javascript
// Test GA4
if (window.gtag) {
  console.log('✅ GA4 is loaded');
  window.gtag('event', 'test_event', { test: 'ga4' });
} else {
  console.log('❌ GA4 not loaded');
}

// Test Facebook Pixel
if (window.fbq) {
  console.log('✅ Facebook Pixel is loaded');
  window.fbq('track', 'PageView');
} else {
  console.log('❌ Facebook Pixel not loaded');
}

// Test GTM
if (window.dataLayer) {
  console.log('✅ GTM dataLayer exists');
  console.log('DataLayer length:', window.dataLayer.length);
  window.dataLayer.push({ event: 'test_event', test: 'gtm' });
} else {
  console.log('❌ GTM dataLayer not found');
}
```

---

## 10. Production Verification

### Before Going Live:

1. **Test in Production Environment:**
   - Deploy to staging/production
   - Test all events
   - Verify in GA4, Facebook, GTM

2. **Check Environment Variables:**
   - Verify production environment variables are set
   - Use production IDs (not test IDs)

3. **Verify Tags are Published:**
   - GTM container must be published
   - Check version history

4. **Monitor for 24-48 hours:**
   - Check GA4 reports
   - Check Facebook Events Manager
   - Monitor for errors

---

## Summary

**Quick Verification Steps:**
1. ✅ Check browser console for initialization
2. ✅ Navigate through app and check console logs
3. ✅ Use GA4 DebugView for real-time GA4 events
4. ✅ Use Facebook Test Events for real-time Facebook events
5. ✅ Use GTM Preview Mode for real-time GTM events
6. ✅ Check Network tab for tracking requests
7. ✅ Verify dataLayer is populated

**All three analytics tools should be working independently and can also work together through GTM!**

