# HubSpot Integration Testing Guide

## 📋 Prerequisites

1. **HubSpot Portal ID** set in `.env.local`: `VITE_HUBSPOT_PORTAL_ID=50689111`
2. **Frontend server running** (usually `http://localhost:5173`)
3. **Browser DevTools open** (F12)

---

## ✅ Step 1: Verify Initialization (2 minutes)

### 1.1 Check Console
1. Open your site in the browser
2. Open DevTools Console (F12)
3. Look for: `✅ HubSpot: Initialized with portal ID 50689111`

### 1.2 Verify Script Loading
1. Go to **Network tab** in DevTools
2. Filter by: `hs-scripts`
3. You should see: `https://js.hs-scripts.com/50689111.js` (Status: 200)

### 1.3 Check Queue Object
In the console, type:
```javascript
window._hsq
```
**Expected**: Should show an array (may be empty initially, that's normal)

### 1.4 Verify Script in DOM
In the console, type:
```javascript
document.getElementById('hs-script-loader')
```
**Expected**: Should return a `<script>` element

---

## ✅ Step 2: Test Page View Tracking (3 minutes)

### 2.1 Navigate Between Pages
1. Navigate to: `/` (Home)
2. Navigate to: `/produtos` (Products)
3. Navigate to: `/duvidas` (FAQs)
4. Navigate to: `/blog` (Blog)

### 2.2 Check Console Logs
For each navigation, you should see:
```
HubSpot: Page view tracked { path: '/produtos', title: 'Produtos - EverWell' }
```

### 2.3 Check Network Requests
1. In **Network tab**, filter by: `track`
2. You should see requests to: `https://track.hubspot.com/v1/event`
3. Check the request payload - it should contain page path and title

### 2.4 Verify in HubSpot (Real-time)
1. Go to [HubSpot Events Manager](https://app.hubspot.com/events/manager)
2. Click **Test Events** tab
3. Enter your site URL: `http://localhost:5173` (or your domain)
4. Navigate through your site
5. **Expected**: Page view events should appear in real-time

---

## ✅ Step 3: Test User Identification (3 minutes)

### 3.1 Register/Login
1. Go to `/login`
2. Register a new account OR login with existing account
3. Check console for: `HubSpot: Event tracked { eventName: 'complete_registration', ... }` (if new user)

### 3.2 Verify Contact Identification
After login, in the console, type:
```javascript
window._hsq
```
Look for an `identify` call in the queue with user email.

### 3.3 Check HubSpot CRM
1. Go to [HubSpot Contacts](https://app.hubspot.com/contacts)
2. Search for the email you used to register/login
3. **Expected**: Contact should exist with:
   - Email
   - User ID
   - Role (user/admin)
   - Authorization status

---

## ✅ Step 4: Test E-commerce Events (10 minutes)

### 4.1 Product View
1. Navigate to `/produtos/:slug` (any product detail page)
2. Check console: `HubSpot: Event tracked { eventName: 'view_content', ... }`
3. Verify properties include:
   - `product_name`
   - `product_id`
   - `category`
   - `price`

### 4.2 Add to Cart
1. On product detail page, click **"Adicionar"** button
2. Check console: `HubSpot: Event tracked { eventName: 'add_to_cart', ... }`
3. Verify properties include:
   - `product_name`
   - `product_id`
   - `quantity`
   - `price`

### 4.3 Begin Checkout
1. Go to `/checkout` page
2. Check console: `HubSpot: Event tracked { eventName: 'begin_checkout', ... }`
3. Verify properties include:
   - `total_value`
   - `items` array with product details

### 4.4 Purchase
1. Complete an order (fill checkout form and submit)
2. Check console: `HubSpot: Event tracked { eventName: 'purchase', ... }`
3. Verify properties include:
   - `order_id`
   - `total_value`
   - `items` array

### 4.5 Verify in HubSpot Events Manager
1. Go to [HubSpot Events Manager](https://app.hubspot.com/events/manager)
2. Click **Behavioral Events** tab
3. Filter by event name (e.g., `add_to_cart`, `purchase`)
4. **Expected**: Events should appear with all properties

---

## ✅ Step 5: Test Custom Events (5 minutes)

### 5.1 CTA Clicks (Homepage)
1. Go to `/` (Home page)
2. Click **"Agendar consulta"** button
3. Check console: `HubSpot: Event tracked { eventName: 'cta_click', properties: { cta_name: 'Agendar Consulta' } }`

4. Click **"Catálogo exclusivo"** button
5. Check console: `HubSpot: Event tracked { eventName: 'cta_click', properties: { cta_name: 'Catalogo Exclusivo' } }`

### 5.2 Goal Form Submission
1. Scroll to goal form on homepage
2. Fill and submit the form
3. Check console: `HubSpot: Event tracked { eventName: 'goal_form', ... }`

### 5.3 Product Category View
1. Go to `/produtos` page
2. Check console: `HubSpot: Event tracked { eventName: 'view_category', ... }`

---

## ✅ Step 6: Test Manual Event (2 minutes)

### 6.1 Test Custom Event via Console
In the browser console, type:
```javascript
window._hsq.push(['trackCustomBehavioralEvent', {
  name: 'test_event',
  properties: {
    test_property: 'test_value',
    timestamp: new Date().toISOString()
  }
}]);
```

### 6.2 Verify
1. Check console: `HubSpot: Event tracked { eventName: 'test_event', ... }`
2. Check Network tab: Should see request to `track.hubspot.com/v1/event`
3. Check HubSpot Events Manager: Event should appear in Test Events

---

## ✅ Step 7: Verify Contact Properties (5 minutes)

### 7.1 After Login/Registration
1. Login or register a new account
2. Go to [HubSpot Contacts](https://app.hubspot.com/contacts)
3. Find your contact by email
4. **Expected Properties**:
   - ✅ Email
   - ✅ User ID (custom property)
   - ✅ Role (custom property: user/admin)
   - ✅ Is Authorized (custom property: true/false)
   - ✅ Name

### 7.2 After Purchase
1. Complete an order
2. Go back to HubSpot Contacts
3. Find your contact
4. **Expected**: Contact should have:
   - Order ID in activity timeline
   - Purchase event in behavioral events
   - Total order value (if custom property set up)

---

## ✅ Step 8: Test Backend CRM Integration (Optional - 5 minutes)

If backend HubSpot integration is configured:

### 8.1 Create Order
1. Complete an order through the checkout
2. Check backend console/logs
3. **Expected**: Should see:
   ```
   ✅ HubSpot: Contact created/updated
   ✅ HubSpot: Deal created
   ✅ HubSpot: Order synced
   ```

### 8.2 Verify in HubSpot
1. Go to [HubSpot Contacts](https://app.hubspot.com/contacts)
2. Find the contact
3. **Expected**: Should see:
   - Deal associated with contact
   - Order details in timeline
   - Custom properties populated

---

## 🔍 Troubleshooting

### Issue: "HubSpot: Initialized" but no events
**Solution**:
1. Check `window._hsq` exists
2. Verify script loaded: `document.getElementById('hs-script-loader')`
3. Check Network tab for `hs-scripts.com` requests
4. Verify portal ID is correct: `50689111`

### Issue: Events not appearing in HubSpot
**Solution**:
1. Wait 1-2 minutes (events can be delayed)
2. Check you're in the correct HubSpot account
3. Verify portal ID matches your HubSpot account
4. Check browser console for errors
5. Disable ad blockers

### Issue: Contact not created
**Solution**:
1. Verify `identifyContact()` is called after login
2. Check console for `identify` call in `window._hsq`
3. Verify email is provided in user object
4. Check HubSpot custom properties are set up

### Issue: Network requests failing
**Solution**:
1. Check CORS settings
2. Verify no ad blockers are active
3. Check browser console for specific errors
4. Try incognito mode

---

## 📊 Expected Results Summary

After completing all tests, you should see:

### Console Logs
- ✅ `HubSpot: Initialized with portal ID 50689111`
- ✅ `HubSpot: Page view tracked` (on each navigation)
- ✅ `HubSpot: Event tracked` (for all user actions)

### Network Requests
- ✅ `https://js.hs-scripts.com/50689111.js` (Status: 200)
- ✅ `https://track.hubspot.com/v1/event` (Status: 200) - for events
- ✅ `https://track.hubspot.com/v1/identify` (Status: 200) - for contact identification

### HubSpot Dashboard
- ✅ Events in **Events Manager → Test Events** (real-time)
- ✅ Events in **Events Manager → Behavioral Events** (historical)
- ✅ Contacts in **Contacts** with all properties
- ✅ Deals (if backend integration configured)

---

## 🎯 Quick Test Checklist

Use this checklist for a quick 5-minute test:

- [ ] Console shows: `HubSpot: Initialized with portal ID 50689111`
- [ ] `window._hsq` exists and is an array
- [ ] Navigate pages → See `HubSpot: Page view tracked` in console
- [ ] Login/Register → See `identify` in `window._hsq`
- [ ] View product → See `view_content` event
- [ ] Add to cart → See `add_to_cart` event
- [ ] Go to checkout → See `begin_checkout` event
- [ ] Complete order → See `purchase` event
- [ ] HubSpot Events Manager shows events in real-time
- [ ] HubSpot Contacts shows your contact with properties

**All checked? → HubSpot integration is working perfectly! 🎉**

---

## 📚 Additional Resources

- [HubSpot Events Manager](https://app.hubspot.com/events/manager)
- [HubSpot Contacts](https://app.hubspot.com/contacts)
- [HubSpot Tracking Code Documentation](https://developers.hubspot.com/docs/api/events/tracking-code)

---

**Note**: Events may take 1-2 minutes to appear in HubSpot dashboard. Real-time testing is available in the "Test Events" tab of Events Manager.
