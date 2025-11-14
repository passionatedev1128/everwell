# HubSpot Testing Guide - Complete

This guide covers testing both **HubSpot Frontend Tracking** (browser-based events) and **HubSpot Backend CRM Integration** (API-based contact management).

---

## 📋 Prerequisites

### 1. Get Your HubSpot Credentials

**Frontend Tracking (Portal ID):**
1. Go to [HubSpot Settings](https://app.hubspot.com/settings)
2. Navigate to **Tracking & Analytics → Tracking code**
3. Copy your **Hub ID** (Portal ID) - Example: `12345678`

**Backend CRM (API Key):**
1. Go to [HubSpot Settings](https://app.hubspot.com/settings)
2. Navigate to **Integrations → Private Apps** (or **API Key**)
3. Create a new private app or get your API key
4. Copy the **API Key** - Example: `pat-na1-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

### 2. Configure Environment Variables

**Frontend (`frontend/.env.local`):**
```env
VITE_HUBSPOT_PORTAL_ID=12345678
```

**Backend (`backend/.env`):**
```env
HUBSPOT_API_KEY=pat-na1-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### 3. Restart Servers

```bash
# Frontend
cd frontend
npm run dev

# Backend
cd backend
npm run dev
```

---

## 🧪 Part 1: Testing Frontend Tracking (Browser Events)

### Method 1: Browser Console Verification

**Step 1: Open Developer Tools**
- Press `F12` or `Right-click → Inspect`
- Go to **Console** tab

**Step 2: Check Initialization**
When the page loads, you should see:
```
✅ HubSpot: Initialized with portal ID 12345678
```

**Step 3: Test Events in Console**
```javascript
// Check if HubSpot queue exists
window._hsq

// You should see an array with events like:
// [
//   ['trackPageView'],
//   ['trackCustomBehavioralEvent', { name: 'view_content', ... }],
//   ...
// ]

// Manually trigger a test event
window._hsq.push(['trackCustomBehavioralEvent', {
  name: 'test_event',
  properties: { test: 'value' }
}]);
```

**Step 4: Navigate and Watch Console**
As you navigate through the app, you should see:
```
✅ HubSpot: Page view tracked { path: '/', title: 'EverWell' }
✅ HubSpot: Event tracked { eventName: 'view_content', properties: {...} }
✅ HubSpot: Event tracked { eventName: 'add_to_cart', properties: {...} }
```

---

### Method 2: HubSpot Events Manager (Real-time Testing)

**Step 1: Open HubSpot Events Manager**
1. Go to [HubSpot Events Manager](https://app.hubspot.com/events/manager)
2. Select your portal

**Step 2: Use Test Events**
1. Click **Test Events** tab
2. Enter your website URL: `http://localhost:5173` (or production URL)
3. Click **Open Website**
4. Navigate through your app
5. Events should appear in real-time in the Test Events panel

**What to Look For:**
- ✅ PageView events
- ✅ Custom behavioral events (view_content, add_to_cart, purchase, etc.)
- ✅ Event properties (product_name, order_id, etc.)

---

### Method 3: HubSpot Pixel Helper (Chrome Extension)

**Step 1: Install Extension**
- [HubSpot Pixel Helper](https://chrome.google.com/webstore/detail/hubspot-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)

**Step 2: Test**
1. Navigate to your website
2. Click the extension icon in your browser toolbar
3. You should see:
   - ✅ HubSpot Portal ID detected: `12345678`
   - ✅ Events fired: PageView, ViewContent, AddToCart, etc.
   - ✅ Event properties displayed

---

### Method 4: Network Tab Verification

**Step 1: Open Network Tab**
1. Press `F12` → Go to **Network** tab
2. Clear the network log (🚫 icon)

**Step 2: Filter HubSpot Requests**
- Filter by: `hs-scripts`, `hs-analytics`, or `track.hubspot.com`

**Step 3: Navigate Through App**
You should see requests to:
- `https://js.hs-scripts.com/12345678.js` (script loading)
- `https://track.hubspot.com/__ptq.gif?...` (event tracking)

**Step 4: Inspect Requests**
- Click on a request
- Go to **Payload** or **Preview** tab
- You should see event data being sent

---

### Method 5: Test Specific Events

#### Test Page View
```javascript
// In browser console
window._hsq.push(['trackPageView']);
// Check console: Should see "HubSpot: Page view tracked"
```

#### Test Custom Event
```javascript
// In browser console
window._hsq.push(['trackCustomBehavioralEvent', {
  name: 'test_custom_event',
  properties: {
    test_property: 'test_value',
    number_property: 123
  }
}]);
// Check console: Should see "HubSpot: Event tracked"
```

#### Test Product View
1. Navigate to `/produtos`
2. Click on a product
3. Check console: Should see `view_content` event with product details

#### Test Add to Cart
1. Go to a product detail page
2. Click "Adicionar ao Carrinho"
3. Check console: Should see `add_to_cart` event with product and quantity

#### Test Purchase
1. Complete an order
2. Check console: Should see `purchase` event with order ID and total

#### Test Lead Form
1. Submit the goal form on homepage
2. Check console: Should see `goal_form` event

#### Test Booking
1. Complete a booking via SimplyBook widget
2. Check console: Should see `booking_completed` event

---

## 🧪 Part 2: Testing Backend CRM Integration

### Method 1: Backend Console Logs

**Step 1: Check Backend Initialization**
When backend starts, you should see:
```
✅ HubSpot client initialized
```

If you see:
```
⚠️ HUBSPOT_API_KEY not set. HubSpot integration disabled.
```
→ Add `HUBSPOT_API_KEY` to `backend/.env`

**Step 2: Create a Test Order**
1. Complete a purchase in the app
2. Check backend console logs

**You should see:**
```
✅ HubSpot: contact created for user@example.com
```
OR
```
ℹ️ HubSpot: contact updated for user@example.com
```

---

### Method 2: HubSpot CRM Verification

**Step 1: Go to HubSpot CRM**
1. Go to [HubSpot Contacts](https://app.hubspot.com/contacts)
2. Select your portal

**Step 2: Search for Test Contact**
1. Search for the email address you used in the test order
2. The contact should appear

**Step 3: Verify Contact Properties**
Click on the contact and check:
- ✅ **Email**: Should match user email
- ✅ **First Name**: Should be populated
- ✅ **Last Name**: Should be populated
- ✅ **Order ID**: Should show the latest order ID
- ✅ **Last Order Total**: Should show order amount
- ✅ **Last Order Status**: Should show order status (pending, paid, etc.)

**Step 4: Test Contact Update**
1. Create another order with the same email
2. Go back to HubSpot CRM
3. Refresh the contact
4. **Last Order Total** and **Last Order Status** should update

---

### Method 3: HubSpot API Testing (Advanced)

**Step 1: Test API Connection**
```bash
# In backend directory
node -e "
const Hubspot = require('@hubspot/api-client');
const client = new Hubspot.Client({ apiKey: process.env.HUBSPOT_API_KEY });
client.crm.contacts.basicApi.getPage().then(result => {
  console.log('✅ HubSpot API connected');
  console.log('Contacts found:', result.results.length);
}).catch(err => {
  console.error('❌ HubSpot API error:', err.message);
});
"
```

**Step 2: Test Contact Creation**
```bash
# Create a test contact via API
curl -X POST "https://api.hubapi.com/crm/v3/objects/contacts" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "properties": {
      "email": "test@example.com",
      "firstname": "Test",
      "lastname": "User"
    }
  }'
```

---

## 📊 Complete Testing Checklist

### Frontend Tracking Tests

- [ ] **Initialization**
  - [ ] Console shows: `HubSpot: Initialized with portal ID ...`
  - [ ] `window._hsq` exists and is an array
  - [ ] Network tab shows script loading from `js.hs-scripts.com`

- [ ] **Page Views**
  - [ ] Navigate to `/` → See `page_view` event
  - [ ] Navigate to `/produtos` → See `page_view` event
  - [ ] Navigate to `/blog` → See `page_view` event

- [ ] **Product Events**
  - [ ] View product list → See `view_category` event
  - [ ] View product detail → See `view_content` event
  - [ ] Add to cart → See `add_to_cart` event

- [ ] **E-commerce Events**
  - [ ] Go to checkout → See `begin_checkout` event
  - [ ] Complete purchase → See `purchase` event

- [ ] **Lead Events**
  - [ ] Submit goal form → See `goal_form` event
  - [ ] Complete booking → See `booking_completed` event
  - [ ] Upload document → See `document_upload` event

- [ ] **Registration Events**
  - [ ] Register new account → See `complete_registration` event

### Backend CRM Tests

- [ ] **API Connection**
  - [ ] Backend console shows: `✅ HubSpot client initialized`
  - [ ] No errors in backend logs

- [ ] **Contact Creation**
  - [ ] Create order with new email
  - [ ] Check HubSpot CRM → Contact created
  - [ ] Verify all properties are populated

- [ ] **Contact Update**
  - [ ] Create second order with same email
  - [ ] Check HubSpot CRM → Contact updated
  - [ ] Verify `last_order_total` and `last_order_status` updated

- [ ] **Error Handling**
  - [ ] Test with invalid API key → Should log error gracefully
  - [ ] Test with missing email → Should skip integration
  - [ ] Test with duplicate contact → Should update existing

---

## 🔍 Debugging Commands

### Browser Console Commands

```javascript
// Check HubSpot initialization
window.__hubspotInitialized  // Should be: true

// Check HubSpot queue
window._hsq  // Should be an array

// View all events in queue
window._hsq.forEach((event, index) => {
  console.log(`Event ${index}:`, event);
});

// Check HubSpot script loaded
document.getElementById('hs-script-loader')  // Should exist

// Manually trigger page view
window._hsq.push(['trackPageView']);

// Check for errors
window._hsq.filter(event => event[0] === 'error')
```

### Backend Console Commands

```javascript
// In backend, check if HubSpot client is initialized
// Look for: "✅ HubSpot client initialized" on server start

// Check environment variable
console.log(process.env.HUBSPOT_API_KEY ? 'Set' : 'Not set');
```

---

## 🐛 Troubleshooting

### Issue: HubSpot not initializing

**Symptoms:**
- No console message: `HubSpot: Initialized with portal ID ...`
- `window._hsq` is undefined

**Solutions:**
1. Check `VITE_HUBSPOT_PORTAL_ID` is set in `frontend/.env.local`
2. Restart development server
3. Clear browser cache and hard refresh (`Ctrl+Shift+R`)
4. Check browser console for errors
5. Verify Portal ID is correct (numbers only, no letters)

### Issue: Events not appearing in HubSpot

**Symptoms:**
- Console shows events tracked
- But events don't appear in HubSpot Events Manager

**Solutions:**
1. **Wait 2-5 minutes** - HubSpot can have delays
2. Use **Test Events** in HubSpot Events Manager for real-time testing
3. Check ad blockers are disabled
4. Verify Portal ID is correct
5. Check Network tab - requests should go to `track.hubspot.com`

### Issue: Backend CRM not working

**Symptoms:**
- No console logs: `✅ HubSpot: contact created`
- Contacts not appearing in HubSpot CRM

**Solutions:**
1. Check `HUBSPOT_API_KEY` is set in `backend/.env`
2. Verify API key is valid (not expired)
3. Check backend console for errors
4. Verify API key has correct permissions (Contacts - Read & Write)
5. Test API connection manually (see Method 3 above)

### Issue: Contact properties not updating

**Symptoms:**
- Contact created but properties are empty
- Contact updated but properties don't change

**Solutions:**
1. Check user object has required fields (email, name)
2. Verify order object has `totalAmount` and `status`
3. Check backend console for property errors
4. Verify custom properties exist in HubSpot (Settings → Properties)

---

## 📈 HubSpot Dashboard Verification

### 1. Traffic Analytics
1. Go to **Reports → Analytics Tools → Traffic analytics**
2. Filter by your domain
3. You should see page views and sessions

### 2. Behavioral Events (Enterprise)
1. Go to **Reports → Analytics Tools → Events**
2. Filter by custom events
3. You should see: `view_content`, `add_to_cart`, `purchase`, etc.

### 3. Contact Activity
1. Go to **Contacts → [Select Contact] → Activity**
2. You should see:
   - Page views
   - Custom events
   - Form submissions

### 4. Workflows (If Configured)
1. Go to **Automation → Workflows**
2. Check if workflows are triggering based on events
3. Verify contacts are being added to lists

---

## 🎯 Quick Test Script

Run this in your browser console to test everything:

```javascript
// Complete HubSpot Test
console.log('=== HubSpot Testing ===');

// 1. Check initialization
console.log('1. Initialization:', window.__hubspotInitialized ? '✅' : '❌');
console.log('   Portal ID:', window._hsq ? 'Loaded' : 'Not loaded');

// 2. Check queue
console.log('2. Event Queue:', window._hsq ? `✅ ${window._hsq.length} events` : '❌ Not found');

// 3. Test page view
window._hsq.push(['trackPageView']);
console.log('3. Page View:', '✅ Triggered');

// 4. Test custom event
window._hsq.push(['trackCustomBehavioralEvent', {
  name: 'test_event',
  properties: { test: 'value', timestamp: Date.now() }
}]);
console.log('4. Custom Event:', '✅ Triggered');

// 5. Check script
const script = document.getElementById('hs-script-loader');
console.log('5. Script Element:', script ? '✅ Found' : '❌ Not found');

// 6. View all events
console.log('6. All Events:');
window._hsq.forEach((event, i) => {
  console.log(`   Event ${i}:`, event);
});

console.log('=== Test Complete ===');
```

---

## ✅ Production Checklist

Before going live:

- [ ] `VITE_HUBSPOT_PORTAL_ID` set in production environment
- [ ] `HUBSPOT_API_KEY` set in production environment
- [ ] Test events in production environment
- [ ] Verify contacts are created in HubSpot CRM
- [ ] Check HubSpot Events Manager shows production events
- [ ] Test all key user flows (registration, purchase, booking)
- [ ] Monitor for 24-48 hours after launch
- [ ] Set up HubSpot workflows/alerts if needed

---

## 📚 Additional Resources

- [HubSpot Tracking Code Documentation](https://knowledge.hubspot.com/reports/install-the-hubspot-tracking-code)
- [HubSpot Custom Behavioral Events](https://developers.hubspot.com/docs/api/events/custom-behavioral-events)
- [HubSpot CRM API Documentation](https://developers.hubspot.com/docs/api/crm/contacts)
- [HubSpot Events Manager](https://app.hubspot.com/events/manager)
- [HubSpot Pixel Helper Extension](https://chrome.google.com/webstore/detail/hubspot-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)

---

## 🎉 Summary

**Frontend Tracking:**
1. ✅ Check console for initialization
2. ✅ Use HubSpot Events Manager Test Events for real-time verification
3. ✅ Use HubSpot Pixel Helper extension
4. ✅ Check Network tab for tracking requests
5. ✅ Navigate through app and watch console logs

**Backend CRM:**
1. ✅ Check backend console for initialization
2. ✅ Create test order and verify contact in HubSpot CRM
3. ✅ Check contact properties are populated correctly
4. ✅ Test contact updates with multiple orders

Both systems work independently and complement each other for complete HubSpot integration!

