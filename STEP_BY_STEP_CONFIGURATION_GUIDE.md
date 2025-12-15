# Step-by-Step Configuration Guide: GA4 + HubSpot Free Tier

## 🎯 Overview

This guide will walk you through configuring GA4 and HubSpot Free tier step by step. Follow each section in order.

---

## 📋 Part 1: GA4 Configuration

### Step 1: Verify GA4 is Set Up

#### 1.1 Check Your GA4 Measurement ID

1. **Open your frontend `.env` file**
   - Location: `frontend/.env`
   - Look for: `VITE_GA4_MEASUREMENT_ID`

2. **Verify it's set:**
```env
VITE_GA4_MEASUREMENT_ID=G-05TH31T6CK
```

3. **If not set:**
   - Get your Measurement ID from GA4
   - Add it to `.env` file
   - Restart frontend server

---

#### 1.2 Test GA4 is Working

1. **Open your website** in browser
2. **Open browser console** (F12 → Console tab)
3. **Look for:** `GA4: Initialized with measurement ID G-05TH31T6CK`
4. **If you see it:** ✅ GA4 is working!
5. **If not:** Check `.env` file and restart server

---

### Step 2: Mark Events as Conversions in GA4

#### 2.1 Go to GA4 Events

1. **Open Google Analytics 4**
   - Go to: https://analytics.google.com
   - Select your property

2. **Navigate to Events:**
   - Click **Admin** (⚙️ icon, bottom left)
   - Under **Property**, click **Events**
   - OR: Click **Configure** → **Events**

---

#### 2.2 Mark Key Events as Conversions

**Find each event and toggle "Mark as conversion" ON:**

1. **`purchase`** ⭐ (MOST IMPORTANT)
   - Search for "purchase"
   - Toggle switch ON
   - Click Save if prompted

2. **`begin_checkout`**
   - Search for "begin_checkout"
   - Toggle switch ON

3. **`sign_up`**
   - Search for "sign_up"
   - Toggle switch ON

4. **`add_to_cart`**
   - Search for "add_to_cart"
   - Toggle switch ON

5. **`document_upload`** (if you track this)
   - Search for "document_upload"
   - Toggle switch ON

6. **`lead`** (if you track this)
   - Search for "lead"
   - Toggle switch ON

**Note:** Events may take 24-48 hours to appear. Use Realtime or DebugView to verify they're working.

---

### Step 3: Create Custom Dimensions in GA4

#### 3.1 Create Document Type Dimension

1. **Go to Custom Definitions:**
   - Click **Admin** → **Custom Definitions** → **Custom Dimensions**
   - Click **Create custom dimension**

2. **Configure:**
   - **Dimension name:** `Document Type`
   - **Scope:** Select **Event**
   - **Event parameter:** Type `document_type` (exactly as in code)
   - **Description:** "Type of document uploaded"
   - Click **Save**

---

#### 3.2 Create Lead Source Dimension (Optional)

1. **Click Create custom dimension again**

2. **Configure:**
   - **Dimension name:** `Lead Source`
   - **Scope:** Select **Event**
   - **Event parameter:** Type `lead_source`
   - **Description:** "Source of lead generation"
   - Click **Save**

---

### Step 4: Create Audiences in GA4

#### 4.1 Create Cart Abandoners Audience

1. **Go to Audiences:**
   - Click **Admin** → **Audiences**
   - Click **New audience** → **Create a custom audience**

2. **Configure:**
   - **Name:** "Cart Abandoners"
   - **Add condition:**
     - Event: `begin_checkout` (has occurred)
     - AND
     - Event: `purchase` (has NOT occurred)
   - **Membership duration:** 30 days
   - Click **Save**

---

#### 4.2 Create Document Uploaders Audience

1. **Click New audience** again

2. **Configure:**
   - **Name:** "Document Uploaders"
   - **Add condition:**
     - Event: `document_upload` (has occurred)
   - **Membership duration:** 90 days
   - Click **Save**

---

#### 4.3 Create Goal Form Submitters Audience

1. **Click New audience** again

2. **Configure:**
   - **Name:** "Goal Form Submitters"
   - **Add condition:**
     - Event: `lead` (has occurred)
     - AND
     - Event parameter: `lead_source` = `goal_form`
   - **Membership duration:** 90 days
   - Click **Save**

---

### Step 5: Create Custom Reports in GA4

#### 5.1 Create E-commerce Overview Report

1. **Go to Explore:**
   - Click **Explore** (left sidebar)
   - Click **Blank** (or **Free form**)

2. **Configure:**
   - **Name:** "E-commerce Overview"
   - **Add Metrics:**
     - Total revenue
     - Purchases
     - Average order value
   - **Add Dimensions:**
     - Event name
   - **Add Filter:**
     - Event name = `purchase`
   - Click **Save**

---

#### 5.2 Create Conversion Funnel Report

1. **Go to Explore:**
   - Click **Explore** → **Funnel exploration**

2. **Configure:**
   - **Name:** "E-commerce Conversion Funnel"
   - **Add Steps:**
     1. `view_item_list` (Browse Products)
     2. `view_item` (View Product)
     3. `add_to_cart` (Add to Cart)
     4. `begin_checkout` (Start Checkout)
     5. `purchase` (Complete Purchase)
   - Click **Save**

---

## 📋 Part 2: HubSpot Free Tier Configuration

### Step 6: Verify HubSpot Portal ID

#### 6.1 Check Your HubSpot Portal ID

1. **Open your frontend `.env` file**
   - Location: `frontend/.env`
   - Look for: `VITE_HUBSPOT_PORTAL_ID`

2. **Get Portal ID from HubSpot:**
   - Go to HubSpot → **Settings** (⚙️ icon)
   - Click **Tracking Code** (under Website)
   - Your Portal ID is in the URL or tracking code
   - Format: `12345678` (8 digits)

3. **Add to `.env`:**
```env
VITE_HUBSPOT_PORTAL_ID=12345678
```

4. **Restart frontend server**

---

#### 6.2 Test HubSpot is Working

1. **Open your website** in browser
2. **Open browser console** (F12 → Console tab)
3. **Look for:** `HubSpot: Initialized with portal ID 12345678`
4. **If you see it:** ✅ HubSpot is working!
5. **If not:** Check `.env` file and restart server

---

### Step 7: Verify Contact Identification

#### 7.1 Check `identifyContact()` is Called

**This is the ONLY HubSpot function you need for free tier!**

1. **Open:** `frontend/src/pages/Login.jsx`
2. **Look for:** `identifyContact(user)` function call
3. **Should be called:**
   - After user logs in
   - After user registers

4. **If not found:**
   - Add it after successful login/registration
   - Example:
   ```javascript
   import { identifyContact } from '../utils/hubspot';
   
   // After login/registration success
   identifyContact(user);
   ```

---

#### 7.2 Test Contact Creation

1. **Register a new user** on your website
2. **Go to HubSpot:**
   - HubSpot → **Contacts** → **Contacts**
3. **Search for the email** you used
4. **If contact appears:** ✅ Contact identification is working!
5. **If not:** Check browser console for errors

---

### Step 8: Remove HubSpot Custom Events (Important!)

**For HubSpot Free tier, you should NOT use custom events. Use GA4 instead.**

#### 8.1 Check What HubSpot Events Are Being Used

**Open:** `frontend/src/utils/hubspot.js`

**Functions to REMOVE or DISABLE:**
- `trackViewContent()` - Use GA4 `view_item` instead
- `trackAddToCart()` - Use GA4 `add_to_cart` instead
- `trackInitiateCheckout()` - Use GA4 `begin_checkout` instead
- `trackLead()` - Use GA4 `lead` event instead
- `trackContact()` - Use GA4 `payment_proof_upload` instead

**Functions to KEEP:**
- ✅ `identifyContact()` - Essential for CRM
- ✅ `trackPageView()` - Automatic, but keep for consistency
- ⚠️ `trackPurchase()` - Optional (only if you need basic deal tracking)

---

#### 8.2 Update Components to Remove HubSpot Custom Events

**File: `frontend/src/components/DocumentUpload.jsx`**

**Find this code:**
```javascript
trackLead(documentType);
```

**Remove it or comment it out:**
```javascript
// trackLead(documentType); // Removed - using GA4 instead
```

**Keep GA4 tracking:**
```javascript
trackDocumentUpload(documentType); // Keep this - GA4
```

---

**File: `frontend/src/components/GoalForm.jsx`**

**Find HubSpot tracking:**
```javascript
trackLead('goal_form');
```

**Remove it:**
```javascript
// trackLead('goal_form'); // Removed - using GA4 instead
```

**Make sure GA4 tracking exists:**
```javascript
trackEvent('lead', { lead_source: 'goal_form' }); // Keep this - GA4
```

---

**File: `frontend/src/pages/ProductDetail.jsx`**

**Find HubSpot tracking:**
```javascript
trackViewContent(product);
```

**Remove it:**
```javascript
// trackViewContent(product); // Removed - using GA4 instead
```

**Keep GA4 tracking:**
```javascript
trackProductView(product); // Keep this - GA4
```

---

**File: `frontend/src/pages/Checkout.jsx`**

**Find HubSpot tracking:**
```javascript
trackInitiateCheckout(cartItems, totalAmount);
```

**Remove it:**
```javascript
// trackInitiateCheckout(cartItems, totalAmount); // Removed - using GA4 instead
```

**Keep GA4 tracking:**
```javascript
trackBeginCheckout(cartItems, totalAmount); // Keep this - GA4
```

---

## 📋 Part 3: Verification & Testing

### Step 9: Test GA4 Events

#### 9.1 Test Page Views

1. **Open GA4 DebugView:**
   - GA4 → **Admin** → **DebugView**
   - OR: Install GA4 Debugger Chrome extension

2. **Navigate your website**
3. **Check DebugView:**
   - Should see `page_view` events appearing
   - ✅ If yes: Page views working!

---

#### 9.2 Test Product Views

1. **Visit a product page** on your website
2. **Check DebugView:**
   - Should see `view_item` event
   - Should show product details
   - ✅ If yes: Product tracking working!

---

#### 9.3 Test Add to Cart

1. **Add a product to cart**
2. **Check DebugView:**
   - Should see `add_to_cart` event
   - Should show product details
   - ✅ If yes: Cart tracking working!

---

#### 9.4 Test Checkout

1. **Go to checkout page**
2. **Check DebugView:**
   - Should see `begin_checkout` event
   - Should show cart total
   - ✅ If yes: Checkout tracking working!

---

#### 9.5 Test Purchase

1. **Complete a purchase** (test order)
2. **Check DebugView:**
   - Should see `purchase` event
   - Should show order ID and total
   - ✅ If yes: Purchase tracking working!

---

#### 9.6 Test Document Upload

1. **Upload a document** on your website
2. **Check DebugView:**
   - Should see `document_upload` event
   - Should show `document_type` parameter
   - ✅ If yes: Document tracking working!

---

### Step 10: Test HubSpot Contact Creation

#### 10.1 Test User Registration

1. **Register a new user** on your website
2. **Check browser console:**
   - Should see: `HubSpot: Event tracked` (for identify)
3. **Go to HubSpot:**
   - **Contacts** → **Contacts**
   - Search for the email you used
4. **If contact appears:** ✅ Contact creation working!
5. **If not:** Check console for errors

---

#### 10.2 Test User Login

1. **Log in** with existing user
2. **Check browser console:**
   - Should see: `HubSpot: Event tracked` (for identify)
3. **Go to HubSpot:**
   - Find the contact
   - Check if properties are updated
4. **If updated:** ✅ Contact update working!

---

## 📋 Part 4: Final Checklist

### GA4 Checklist:

- [ ] Measurement ID set in `.env`
- [ ] GA4 initialized (check console)
- [ ] `purchase` marked as conversion
- [ ] `begin_checkout` marked as conversion
- [ ] `sign_up` marked as conversion
- [ ] `add_to_cart` marked as conversion
- [ ] Custom dimension `Document Type` created
- [ ] Audience "Cart Abandoners" created
- [ ] Audience "Document Uploaders" created
- [ ] Custom report "E-commerce Overview" created
- [ ] Funnel report created
- [ ] All events showing in DebugView

---

### HubSpot Free Checklist:

- [ ] Portal ID set in `.env`
- [ ] HubSpot initialized (check console)
- [ ] `identifyContact()` called on login/registration
- [ ] Contacts being created in HubSpot
- [ ] Removed `trackViewContent()` from components
- [ ] Removed `trackAddToCart()` from components
- [ ] Removed `trackInitiateCheckout()` from components
- [ ] Removed `trackLead()` from components
- [ ] Only using `identifyContact()` for HubSpot

---

## 🎯 Quick Reference

### GA4 Events to Track (All in GA4):

```javascript
// E-commerce
trackPageView(path, title);
trackProductView(product); // view_item
trackViewItemList(products); // view_item_list
trackAddToCart(product, quantity); // add_to_cart
trackBeginCheckout(cartItems, total); // begin_checkout
trackPurchase(order); // purchase

// User Events
trackSignUp(method); // sign_up
trackLogin(method); // login

// Custom Events
trackDocumentUpload(documentType); // document_upload
trackEvent('lead', { lead_source: 'goal_form' }); // lead
trackEvent('cta_click', { cta_name: '...' }); // cta_click
```

---

### HubSpot Functions to Use (Minimal):

```javascript
// ONLY this for HubSpot Free tier:
identifyContact(user); // Creates/updates contact record

// Optional (automatic):
trackPageView(path, title); // Automatic, but keep for consistency
```

---

## 🚨 Common Issues

### Issue 1: Events Not Showing in GA4

**Solution:**
- Wait 24-48 hours for standard reports
- Use DebugView for immediate testing
- Check browser console for errors
- Verify Measurement ID is correct

---

### Issue 2: Contacts Not Creating in HubSpot

**Solution:**
- Check `identifyContact()` is being called
- Check browser console for errors
- Verify Portal ID is correct
- Make sure user has email address

---

### Issue 3: Too Many HubSpot Events

**Solution:**
- Remove all custom event tracking from HubSpot
- Keep only `identifyContact()`
- Use GA4 for all event tracking

---

## ✅ Success Criteria

**You're done when:**

1. ✅ All events tracked in GA4 (visible in DebugView)
2. ✅ Key events marked as conversions
3. ✅ Contacts created in HubSpot when users register
4. ✅ No HubSpot custom events being used
5. ✅ GA4 shows all analytics data
6. ✅ HubSpot shows contact records only

---

## 📞 Need Help?

If you get stuck at any step:

1. **Check browser console** for errors
2. **Check GA4 DebugView** for events
3. **Check HubSpot Contacts** for contact records
4. **Share the specific error** you're seeing

---

**Remember:** 
- GA4 = All analytics and events
- HubSpot Free = Basic contact management only
- Keep it simple!

