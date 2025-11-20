# Frontend Environment Variables Configuration Guide

## 📋 Quick Setup

1. **Create a `.env` file** in the `frontend/` directory
2. **Copy the variables below** and fill in your actual values
3. **Restart the frontend server** after making changes

---

## 🔧 Required Environment Variables

### API Configuration

```env
# Backend API URL (defaults to http://localhost:5000/api if not set)
VITE_API_URL=http://localhost:5000/api
```

**For Production:**
```env
VITE_API_URL=https://your-backend-domain.com/api
```

---

### Analytics & Tracking (REQUIRED for tracking to work)

#### Google Analytics 4

```env
# Google Analytics 4 Measurement ID
# Get from: Google Analytics 4 → Admin → Data Streams → Your Stream
# Format: G-XXXXXXXXXX
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

**How to get it:**
1. Go to [Google Analytics](https://analytics.google.com)
2. Select your property
3. Click **Admin** (⚙️ icon, bottom left)
4. Under **Property**, click **Data Streams**
5. Click on your stream
6. Copy the **Measurement ID** (starts with `G-`)

---

#### HubSpot Portal ID

```env
# HubSpot Portal ID (8 digits)
# Get from: HubSpot → Settings (⚙️) → Tracking Code
# Format: 12345678
VITE_HUBSPOT_PORTAL_ID=12345678
```

**How to get it:**
1. Go to [HubSpot](https://app.hubspot.com)
2. Click **Settings** (⚙️ icon, top right)
3. Under **Website**, click **Tracking Code**
4. Your Portal ID is in the URL or tracking code (8 digits)
5. Example URL: `https://js.hs-scripts.com/12345678.js` → Portal ID is `12345678`

---

#### Google Tag Manager (Optional)

```env
# Google Tag Manager Container ID (Optional)
# Get from: Google Tag Manager → Container Settings
# Format: GTM-XXXXXXX
VITE_GTM_CONTAINER_ID=GTM-XXXXXXX
```

**How to get it:**
1. Go to [Google Tag Manager](https://tagmanager.google.com)
2. Select your container
3. Click **Admin** → **Container Settings**
4. Copy the **Container ID** (starts with `GTM-`)

---

### Booking Integration (Optional)

```env
# SimplyBook Company ID
# Get from: SimplyBook → Settings → Company ID
# Format: your-company-name (without .simplybook.me)
# Defaults to 'everwell' if not set
VITE_SIMPLYBOOK_COMPANY_ID=your-company-name
```

**How to get it:**
1. Log in to SimplyBook
2. Go to **Settings** → **Company Settings**
3. Find your **Company ID** (the part before `.simplybook.me`)

---

## 📝 Complete `.env` File Example

Create `frontend/.env` with:

```env
# ============================================
# API Configuration
# ============================================
VITE_API_URL=http://localhost:5000/api

# ============================================
# Analytics & Tracking (REQUIRED)
# ============================================
VITE_GA4_MEASUREMENT_ID=G-05TH31T6CK
VITE_HUBSPOT_PORTAL_ID=12345678
VITE_GTM_CONTAINER_ID=GTM-XXXXXXX

# ============================================
# Booking Integration (Optional)
# ============================================
VITE_SIMPLYBOOK_COMPANY_ID=everwell
```

---

## ✅ Verification Steps

After setting up your `.env` file:

1. **Restart the frontend server:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Check browser console** (F12 → Console):
   - Should see: `GA4: Initialized with measurement ID G-...`
   - Should see: `HubSpot: Initialized with portal ID ...`
   - Should see: `GTM: Initialized with container ID GTM-...` (if GTM is set)

3. **Test tracking:**
   - Navigate to a product page → Check GA4 DebugView for `view_item` event
   - Register/Login → Check HubSpot Contacts for new contact
   - Add to cart → Check GA4 DebugView for `add_to_cart` event
   - Complete checkout → Check GA4 DebugView for `purchase` event

---

## 🚨 Troubleshooting

### Issue: "GA4: VITE_GA4_MEASUREMENT_ID not set"
- ✅ Make sure `.env` file exists in `frontend/` directory
- ✅ Check variable name is exactly `VITE_GA4_MEASUREMENT_ID` (case-sensitive)
- ✅ Restart the dev server after adding variables
- ✅ No quotes around the value: `VITE_GA4_MEASUREMENT_ID=G-123456` (not `"G-123456"`)

### Issue: "HubSpot: VITE_HUBSPOT_PORTAL_ID not set"
- ✅ Check variable name is exactly `VITE_HUBSPOT_PORTAL_ID`
- ✅ Portal ID should be 8 digits only (no dashes, no letters)
- ✅ Restart the dev server

### Issue: Tracking not working
- ✅ Check browser console for errors
- ✅ Verify IDs are correct (no typos)
- ✅ Check that scripts are loading in Network tab
- ✅ For GA4: Use DebugView to see events in real-time
- ✅ For HubSpot: Check Contacts → All contacts to see if contacts are created

### Issue: Events not showing in GA4
- ✅ Wait 24-48 hours for standard reports
- ✅ Use **DebugView** for immediate testing (GA4 → Admin → DebugView)
- ✅ Check browser console for tracking errors
- ✅ Verify Measurement ID is correct

### Issue: Contacts not creating in HubSpot
- ✅ Check `identifyContact()` is being called (check Login.jsx)
- ✅ Verify Portal ID is correct
- ✅ Check browser console for HubSpot errors
- ✅ Make sure user has an email address

---

## 📊 Integration Points Summary

### Where Tracking is Integrated:

1. **Page Views** → `App.jsx` (all pages)
2. **Product Views** → `ProductDetail.jsx`
3. **Add to Cart** → `CartContext.jsx`
4. **Checkout** → `Checkout.jsx` (begin_checkout + purchase)
5. **User Registration** → `Login.jsx` (sign_up + identifyContact)
6. **User Login** → `Login.jsx` (login + identifyContact)
7. **OAuth Login** → `OAuthCallback.jsx` (identifyContact)
8. **Document Upload** → `DocumentUpload.jsx` (document_upload)

---

## 🎯 Next Steps

After configuring environment variables:

1. ✅ Restart frontend server
2. ✅ Test all tracking events
3. ✅ Verify in GA4 DebugView
4. ✅ Verify in HubSpot Contacts
5. ✅ Mark key events as conversions in GA4 (see `GA4_MARK_PURCHASE_AS_CONVERSION.md`)

---

**Need help?** Check the detailed guides:
- `GA4_SETUP_GUIDE.md` - GA4 configuration
- `HUBSPOT_CONFIGURATION_GUIDE.md` - HubSpot setup
- `STEP_BY_STEP_CONFIGURATION_GUIDE.md` - Complete walkthrough

