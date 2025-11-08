# Google Analytics 4 (GA4) Setup Guide

## Overview

Google Analytics 4 has been integrated into the EverWell application to track user behavior, e-commerce events, and conversions.

## Setup Instructions

### 1. Get Your GA4 Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property (or use an existing one)
3. Go to **Admin** → **Data Streams** → Select your web stream
4. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

### 2. Configure Environment Variable

Add the GA4 Measurement ID to your frontend environment:

**For local development:**
Create or update `frontend/.env.local`:
```env
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

**For production:**
Add the same variable to your hosting platform's environment variables.

### 3. Verify Installation

1. Start your development server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Open your browser's Developer Console (F12)
3. You should see: `GA4: Initialized with measurement ID G-XXXXXXXXXX`
4. Navigate through the app and check console for tracking logs

### 4. Test with GA4 DebugView

1. Install the [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) Chrome extension
2. Enable it
3. Navigate through your app
4. Go to GA4 → **Admin** → **DebugView** to see real-time events

## Tracked Events

### Page Views
- Automatically tracked on all route changes
- Includes page path and title

### E-commerce Events

#### `view_item_list`
- **Triggered:** When user views the products page
- **Data:** List of all products displayed

#### `view_item`
- **Triggered:** When user views a product detail page
- **Data:** Product information (ID, name, price, category)

#### `add_to_cart`
- **Triggered:** When user adds a product to cart
- **Data:** Product information and quantity

#### `remove_from_cart`
- **Triggered:** When user removes a product from cart
- **Data:** Product information and quantity removed

#### `begin_checkout`
- **Triggered:** When user navigates to checkout page
- **Data:** Cart items and total amount

#### `purchase`
- **Triggered:** When order is successfully created
- **Data:** Order ID, total amount, currency, items

### User Events

#### `sign_up`
- **Triggered:** When user registers (email or Google OAuth)
- **Data:** Sign-up method ('email' or 'google')

#### `login`
- **Triggered:** When user logs in (email or Google OAuth)
- **Data:** Login method ('email' or 'google')

### Document Events

#### `document_upload`
- **Triggered:** When user uploads a document
- **Data:** Document type (medicalPrescription, importAuthorization, proofOfResidence)

#### `payment_proof_upload`
- **Triggered:** When user uploads payment proof
- **Data:** Order ID

## Event Parameters

All e-commerce events include:
- `currency`: 'BRL' (Brazilian Real)
- `value`: Monetary value
- `items`: Array of item objects with:
  - `item_id`: Product ID
  - `item_name`: Product name
  - `item_category`: Product category
  - `price`: Product price
  - `quantity`: Quantity

## Testing

### Manual Testing

1. **Page Views:**
   - Navigate between pages
   - Check console for: `GA4: Page view tracked`

2. **Product View:**
   - Visit a product detail page
   - Check console for: `GA4: Event tracked { eventName: 'view_item', ... }`

3. **Add to Cart:**
   - Add a product to cart
   - Check console for: `GA4: Event tracked { eventName: 'add_to_cart', ... }`

4. **Checkout:**
   - Go to checkout page
   - Check console for: `GA4: Event tracked { eventName: 'begin_checkout', ... }`

5. **Purchase:**
   - Complete an order
   - Check console for: `GA4: Event tracked { eventName: 'purchase', ... }`

### Using GA4 DebugView

1. Enable Google Analytics Debugger extension
2. Navigate through your app
3. Open GA4 → DebugView
4. You should see all events in real-time

### Using Browser Network Tab

1. Open Developer Tools → Network tab
2. Filter by "collect" or "google-analytics"
3. Navigate through your app
4. You should see requests to `https://www.google-analytics.com/g/collect`

## Troubleshooting

### GA4 Not Initializing

**Problem:** Console shows "GA4: VITE_GA4_MEASUREMENT_ID not set"

**Solution:**
1. Check that `VITE_GA4_MEASUREMENT_ID` is set in `.env.local`
2. Restart the development server after adding the variable
3. Make sure the variable name starts with `VITE_` (required for Vite)

### Events Not Showing in GA4

**Problem:** Events tracked in console but not appearing in GA4

**Solutions:**
1. Wait 24-48 hours for data to appear in standard reports
2. Use DebugView for real-time verification
3. Check that Measurement ID is correct
4. Verify no ad blockers are interfering
5. Check browser console for errors

### Page Views Not Tracking

**Problem:** Page views not being tracked

**Solution:**
1. Check that `PageViewTracker` component is in `App.jsx`
2. Verify React Router is working correctly
3. Check console for tracking logs

## Production Checklist

- [ ] GA4 Measurement ID added to production environment variables
- [ ] Tested all events in production environment
- [ ] Verified events in GA4 DebugView
- [ ] Set up conversion goals in GA4
- [ ] Configured e-commerce reporting
- [ ] Tested with real user data (if possible)

## Additional Resources

- [GA4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [GA4 E-commerce Events](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)
- [GA4 DebugView](https://support.google.com/analytics/answer/7201382)

## Notes

- GA4 only loads if `VITE_GA4_MEASUREMENT_ID` is set
- All tracking is non-blocking (won't affect app performance)
- Console logs are only shown in development
- Events are sent asynchronously to Google Analytics

