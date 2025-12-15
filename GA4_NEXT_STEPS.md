# GA4 Next Steps Guide

## ✅ Current Status

GA4 is now successfully tracking events! You can see them in:
- **Network tab**: Requests to `https://www.google-analytics.com/g/collect`
- **DebugView**: Events appearing in real-time (development mode only)

## 🎯 Next Steps

### 1. Mark Key Events as Conversions

In GA4, mark important events as conversions to track business goals:

1. Go to **GA4 Admin** → **Events** (or **Configure** → **Events**)
2. Find these events and toggle **"Mark as conversion"**:

   **Critical Conversions:**
   - ✅ `purchase` - Completed orders
   - ✅ `begin_checkout` - Users starting checkout
   - ✅ `sign_up` - New user registrations
   - ✅ `add_to_cart` - Products added to cart

   **Optional Conversions:**
   - `view_item` - Product detail views (engagement metric)
   - `login` - User logins (engagement metric)
   - `lead` - Lead form submissions (if implemented)

### 2. Set Up Enhanced E-commerce Reporting

GA4 automatically tracks e-commerce events, but you can enhance reporting:

1. Go to **Admin** → **Data Streams** → Select your stream
2. Enable **Enhanced measurement** (if not already enabled)
3. Go to **Reports** → **Monetization** → **E-commerce purchases**
   - Verify purchase events are showing correctly
   - Check revenue, items sold, average order value

### 3. Create Custom Reports

Create custom reports for your business metrics:

1. Go to **Explore** → **Blank** (or use a template)
2. Create reports for:
   - **Product Performance**: Which products are viewed/purchased most
   - **User Journey**: Path from homepage → product → cart → checkout → purchase
   - **Conversion Funnel**: Track drop-off at each step

### 4. Set Up Audiences

Create audiences for remarketing and analysis:

1. Go to **Admin** → **Audiences**
2. Create audiences like:
   - **Cart Abandoners**: Users who added to cart but didn't purchase
   - **High-Value Customers**: Users with multiple purchases
   - **Product Viewers**: Users who viewed specific products

### 5. Verify All Events Are Firing

Test each user action to ensure events are tracked:

#### ✅ Page Views
- Navigate between pages
- Check DebugView for `page_view` events

#### ✅ Product Views
- Visit `/produtos/:slug` pages
- Check for `view_item` events

#### ✅ Add to Cart
- Add products to cart
- Check for `add_to_cart` events with product details

#### ✅ Checkout
- Go to `/checkout` page
- Check for `begin_checkout` events with cart total

#### ✅ Purchase
- Complete an order
- Check for `purchase` events with order ID and total

#### ✅ User Actions
- Register new account → `sign_up` event
- Login → `login` event

### 6. Production Checklist

Before going live:

- [ ] **Remove debug_mode** (already done - it's now conditional)
- [ ] **Verify Measurement ID** is correct: `G-05TH31T6CK`
- [ ] **Test in production environment** to ensure events fire
- [ ] **Set up data retention** (Admin → Data Settings → Data Retention)
- [ ] **Configure data filters** if needed (Admin → Data Settings → Data Filters)

### 7. Monitor and Optimize

After launch:

1. **Daily**: Check Realtime reports for immediate issues
2. **Weekly**: Review conversion rates and top events
3. **Monthly**: Analyze user journeys and optimize conversion funnels

## 📊 Current Event Tracking

Your site currently tracks:

### E-commerce Events
- `page_view` - All page navigations
- `view_item` - Product detail page views
- `view_item_list` - Product listing page views (if implemented)
- `add_to_cart` - Products added to cart
- `remove_from_cart` - Products removed from cart
- `begin_checkout` - Checkout page visits
- `purchase` - Completed orders

### User Events
- `sign_up` - New user registrations
- `login` - User logins

### Custom Events (Available but may need implementation)
- `search` - Product searches
- `document_upload` - Document uploads
- `payment_proof_upload` - Payment proof uploads
- `lead` - Lead form submissions

## 🔍 Debugging Tips

If events aren't showing:

1. **Check Console**: Look for `GA4: Event tracked` messages
2. **Network Tab**: Filter for `collect` to see GA4 requests
3. **DebugView**: Use in development (automatically enabled)
4. **GA4 Debugger Extension**: Install Chrome extension for production debugging

## 📚 Resources

- [GA4 Event Reference](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [GA4 E-commerce Guide](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)
- [GA4 DebugView Guide](https://support.google.com/analytics/answer/7201382)

---

**Note**: Debug mode is now automatically enabled only in development. In production, events will still be tracked but won't appear in DebugView (unless you use the GA4 Debugger extension).

