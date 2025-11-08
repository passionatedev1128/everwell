# Facebook Pixel Setup Guide

## Overview

Facebook Pixel has been integrated into the EverWell application to track user behavior, conversions, and enable Facebook advertising campaigns.

## Setup Instructions

### 1. Get Your Facebook Pixel ID

1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager2)
2. Click **Connect Data Sources** → **Web**
3. Select **Facebook Pixel**
4. Click **Connect**
5. Name your pixel (e.g., "EverWell Pixel")
6. Copy your **Pixel ID** (format: 15-digit number like `123456789012345`)

### 2. Configure Environment Variable

Add the Facebook Pixel ID to your frontend environment:

**For local development:**
Create or update `frontend/.env.local`:
```env
VITE_FACEBOOK_PIXEL_ID=123456789012345
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
3. You should see: `Facebook Pixel: Initialized with Pixel ID 123456789012345`
4. Navigate through the app and check console for tracking logs

### 4. Test with Facebook Events Manager

1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager2)
2. Select your pixel
3. Click **Test Events** tab
4. Enter your website URL
5. Navigate through your app
6. You should see events appearing in real-time

## Tracked Events

### Standard Events

#### `PageView`
- **Triggered:** Automatically on all route changes
- **Purpose:** Track page views across the site

#### `ViewContent`
- **Triggered:** When user views a product detail page
- **Data:** Product name, ID, price, currency

#### `AddToCart`
- **Triggered:** When user adds a product to cart
- **Data:** Product name, ID, price, quantity, currency

#### `InitiateCheckout`
- **Triggered:** When user navigates to checkout page
- **Data:** Cart items, total amount, currency, item count

#### `Purchase`
- **Triggered:** When order is successfully created
- **Data:** Order items, total amount, currency, item count

#### `CompleteRegistration`
- **Triggered:** When user registers (email or Google OAuth)
- **Data:** Registration method ('email' or 'google')

### Custom Events

#### `ViewCategory`
- **Triggered:** When user views the products listing page
- **Data:** Product IDs, names, category

#### `Lead`
- **Triggered:** When user uploads a document
- **Data:** Document type (medicalPrescription, importAuthorization, proofOfResidence)

#### `Contact`
- **Triggered:** When user uploads payment proof
- **Data:** Order ID

## Event Parameters

All e-commerce events include:
- `content_ids`: Array of product IDs
- `content_name`: Product name(s)
- `content_type`: 'product'
- `value`: Monetary value
- `currency`: 'BRL' (Brazilian Real)
- `num_items`: Number of items (for cart/checkout/purchase)

## Testing

### Manual Testing

1. **Page Views:**
   - Navigate between pages
   - Check console for: `Facebook Pixel: Event tracked { eventName: 'PageView', ... }`

2. **View Content:**
   - Visit a product detail page
   - Check console for: `Facebook Pixel: Event tracked { eventName: 'ViewContent', ... }`

3. **Add to Cart:**
   - Add a product to cart
   - Check console for: `Facebook Pixel: Event tracked { eventName: 'AddToCart', ... }`

4. **Initiate Checkout:**
   - Go to checkout page
   - Check console for: `Facebook Pixel: Event tracked { eventName: 'InitiateCheckout', ... }`

5. **Purchase:**
   - Complete an order
   - Check console for: `Facebook Pixel: Event tracked { eventName: 'Purchase', ... }`

6. **Complete Registration:**
   - Register a new account
   - Check console for: `Facebook Pixel: Event tracked { eventName: 'CompleteRegistration', ... }`

### Using Facebook Events Manager

1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager2)
2. Select your pixel
3. Click **Test Events** tab
4. Enter your website URL: `http://localhost:5173` (for local) or your production URL
5. Navigate through your app
6. Events should appear in real-time in the Test Events tab

### Using Browser Network Tab

1. Open Developer Tools → Network tab
2. Filter by "facebook" or "fbevents"
3. Navigate through your app
4. You should see requests to `https://www.facebook.com/tr`

### Using Facebook Pixel Helper (Chrome Extension)

1. Install [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
2. Navigate to your website
3. Click the extension icon
4. You should see all tracked events

## Troubleshooting

### Facebook Pixel Not Initializing

**Problem:** Console shows "Facebook Pixel: Pixel ID not provided"

**Solution:**
1. Check that `VITE_FACEBOOK_PIXEL_ID` is set in `.env.local`
2. Restart the development server after adding the variable
3. Make sure the variable name starts with `VITE_` (required for Vite)

### Events Not Showing in Facebook Events Manager

**Problem:** Events tracked in console but not appearing in Events Manager

**Solutions:**
1. Wait a few minutes for events to appear (not always real-time)
2. Use Test Events tab for real-time verification
3. Check that Pixel ID is correct
4. Verify no ad blockers are interfering
5. Check browser console for errors
6. Make sure you're using the correct Facebook Business account

### Page Views Not Tracking

**Problem:** Page views not being tracked

**Solution:**
1. Check that `PageViewTracker` component is in `App.jsx`
2. Verify React Router is working correctly
3. Check console for tracking logs

### Events Blocked by Ad Blockers

**Problem:** Events not firing due to ad blockers

**Solution:**
1. Disable ad blockers for testing
2. Inform users that ad blockers may prevent tracking
3. Consider server-side tracking for production (advanced)

## Production Checklist

- [ ] Facebook Pixel ID added to production environment variables
- [ ] Tested all events in production environment
- [ ] Verified events in Facebook Events Manager Test Events
- [ ] Set up conversion events in Facebook Events Manager
- [ ] Configured custom conversions (if needed)
- [ ] Tested with real user data (if possible)
- [ ] Verified pixel is firing on all key pages
- [ ] Set up Facebook Ads campaigns (if applicable)

## Facebook Ads Integration

Once your pixel is set up and tracking events, you can:

1. **Create Custom Audiences:**
   - Go to Facebook Ads Manager → Audiences
   - Create audiences based on pixel events (e.g., "Added to Cart but Didn't Purchase")

2. **Set Up Conversions:**
   - Go to Facebook Events Manager → Aggregated Event Measurement
   - Configure conversion events (Purchase, CompleteRegistration, etc.)

3. **Create Retargeting Campaigns:**
   - Target users who viewed products but didn't purchase
   - Target users who added to cart but didn't checkout

4. **Optimize for Conversions:**
   - Use Facebook's machine learning to optimize ad delivery
   - Target users most likely to convert

## Additional Resources

- [Facebook Pixel Documentation](https://developers.facebook.com/docs/facebook-pixel)
- [Facebook Pixel Events Reference](https://developers.facebook.com/docs/facebook-pixel/reference)
- [Facebook Events Manager](https://business.facebook.com/events_manager2)
- [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)

## Notes

- Facebook Pixel only loads if `VITE_FACEBOOK_PIXEL_ID` is set
- All tracking is non-blocking (won't affect app performance)
- Console logs are only shown in development
- Events are sent asynchronously to Facebook
- Facebook Pixel works alongside Google Analytics 4
- Some events may take a few minutes to appear in Events Manager
- Test Events tab shows real-time events for verification

## Privacy Considerations

- Inform users about Facebook Pixel tracking in your privacy policy
- Consider implementing cookie consent banner
- Comply with GDPR, CCPA, and other privacy regulations
- Allow users to opt-out if required by law

