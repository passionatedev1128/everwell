# Google Tag Manager (GTM) Setup Guide

## Overview

Google Tag Manager has been integrated into the EverWell application to manage all marketing tags (GA4, HubSpot tracking, etc.) from a single interface without code changes.

## Setup Instructions

### 1. Get Your GTM Container ID

1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Sign in with your Google account
3. Click **Create Account** (if you don't have one)
4. Fill in:
   - **Account Name**: EverWell (or your preferred name)
   - **Country**: Brazil
   - **Container Name**: EverWell Website
   - **Target Platform**: Web
5. Click **Create**
6. Copy your **Container ID** (format: `GTM-XXXXXXX`)

### 2. Configure Environment Variable

Add the GTM Container ID to your frontend environment:

**For local development:**
Create or update `frontend/.env.local`:
```env
VITE_GTM_CONTAINER_ID=GTM-XXXXXXX
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
3. You should see: `GTM: DataLayer initialized for container GTM-XXXXXXX`
4. Check Network tab for requests to `googletagmanager.com`
5. Navigate through the app and check console for tracking logs

### 4. Test with GTM Preview Mode

1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Select your container
3. Click **Preview** button (top right)
4. Enter your website URL: `http://localhost:5173` (for local) or your production URL
5. Click **Connect**
6. Navigate through your app
7. You should see events firing in the GTM Preview window

## Tracked Events

All events are pushed to `dataLayer` and can be configured in GTM to fire tags.

### Page Views
- **Event**: `page_view`
- **Triggered:** Automatically on all route changes
- **Data**: `page_path`, `page_title`, `page_location`

### E-commerce Events

#### `view_item_list`
- **Triggered:** When user views the products page
- **Data**: Product list with items array

#### `view_item`
- **Triggered:** When user views a product detail page
- **Data**: Product information (ID, name, price, category)

#### `add_to_cart`
- **Triggered:** When user adds a product to cart
- **Data**: Product information and quantity

#### `remove_from_cart`
- **Triggered:** When user removes a product from cart
- **Data**: Product information and quantity removed

#### `begin_checkout`
- **Triggered:** When user navigates to checkout page
- **Data**: Cart items and total amount

#### `purchase`
- **Triggered:** When order is successfully created
- **Data**: Order ID, total amount, currency, items

### User Events

#### `sign_up`
- **Triggered:** When user registers (email or Google OAuth)
- **Data**: Sign-up method ('email' or 'google')

#### `login`
- **Triggered:** When user logs in (email or Google OAuth)
- **Data**: Login method ('email' or 'google')

### Document Events

#### `document_upload`
- **Triggered:** When user uploads a document
- **Data**: Document type (medicalPrescription, importAuthorization, proofOfResidence)

#### `payment_proof_upload`
- **Triggered:** When user uploads payment proof
- **Data**: Order ID

## GTM Configuration

### Setting Up Tags in GTM

1. **Go to Tags** in GTM
2. Click **New** to create a tag
3. Configure tags for:
   - Google Analytics 4 (if not already set up)
   - HubSpot tracking (if not already set up)
   - Other marketing tools

### Creating Triggers

1. **Go to Triggers** in GTM
2. Click **New** to create a trigger
3. Configure triggers based on dataLayer events:
   - **Page View Trigger**: Fires on `page_view` event
   - **Product View Trigger**: Fires on `view_item` event
   - **Add to Cart Trigger**: Fires on `add_to_cart` event
   - **Purchase Trigger**: Fires on `purchase` event
   - etc.

### Example: Setting Up GA4 via GTM

1. **Create a Tag:**
   - Tag Type: **Google Analytics: GA4 Configuration**
   - Measurement ID: Your GA4 Measurement ID
   - Trigger: **All Pages** (for page views)

2. **Create Event Tags:**
   - Tag Type: **Google Analytics: GA4 Event**
   - Configuration Tag: Select your GA4 Configuration tag
   - Event Name: Use dataLayer event name (e.g., `view_item`, `add_to_cart`)
   - Trigger: Create custom trigger for each event

### Example: Setting Up HubSpot Tracking via GTM

1. **Create a Tag:**
   - Tag Type: **Custom HTML**
   - HTML: HubSpot tracking base code
   - Trigger: **All Pages**

2. **Create Event Tags:**
   - Tag Type: **Custom HTML**
   - HTML: `fbq('track', '{{Event Name}}', {{Event Parameters}});`
   - Trigger: Create custom trigger for each event

## Testing

### Manual Testing

1. **Check dataLayer:**
   - Open Developer Console
   - Type: `window.dataLayer`
   - You should see an array with event objects

2. **Check GTM Script:**
   - Open Developer Tools → Network tab
   - Filter by "googletagmanager"
   - You should see requests to GTM

3. **Test Events:**
   - Navigate through your app
   - Check console for: `GTM: Event pushed to dataLayer`
   - Verify events in GTM Preview mode

### Using GTM Preview Mode

1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Click **Preview** button
3. Enter your website URL
4. Navigate through your app
5. Check the GTM Preview panel for:
   - Tags fired
   - Triggers activated
   - Variables populated
   - DataLayer events

### Using Browser Console

1. Open Developer Console
2. Type: `window.dataLayer`
3. You should see all events pushed to dataLayer
4. Navigate through your app and watch dataLayer grow

## Troubleshooting

### GTM Not Loading

**Problem:** Console shows "GTM: Container ID not provided"

**Solution:**
1. Check that `VITE_GTM_CONTAINER_ID` is set in `.env.local`
2. Restart the development server after adding the variable
3. Make sure the variable name starts with `VITE_` (required for Vite)

### Events Not Firing in GTM

**Problem:** Events tracked in console but not appearing in GTM

**Solutions:**
1. Check GTM Preview mode to see if events are reaching GTM
2. Verify triggers are set up correctly in GTM
3. Check that tags are configured and published
4. Make sure GTM container is published (not just in draft)

### dataLayer Not Initialized

**Problem:** Console shows "GTM: dataLayer not initialized"

**Solution:**
1. Check that GTM script is loading (Network tab)
2. Verify GTM container ID is correct
3. Check browser console for JavaScript errors
4. Make sure GTM script is loaded before other scripts

### Tags Not Firing

**Problem:** Tags configured but not firing

**Solution:**
1. Use GTM Preview mode to debug
2. Check trigger conditions match dataLayer events
3. Verify tag configuration is correct
4. Check that container is published
5. Clear browser cache and cookies

## Production Checklist

- [ ] GTM Container ID added to production environment variables
- [ ] Tested all events in production environment
- [ ] Verified events in GTM Preview mode
- [ ] Configured all tags in GTM
- [ ] Set up triggers for all events
- [ ] Published GTM container
- [ ] Tested with real user data (if possible)
- [ ] Verified tags are firing correctly
- [ ] Set up GA4 via GTM (if using)
- [ ] Set up HubSpot tracking via GTM (if using)

## Best Practices

1. **Use GTM for All Tags:**
   - Don't hardcode GA4 or HubSpot tracking scripts
   - Manage everything through GTM
   - Makes it easier to add/remove tags without code changes

2. **Use Variables:**
   - Create GTM variables for reusable values
   - Use dataLayer variables for event data
   - Makes tag configuration easier

3. **Use Triggers:**
   - Create specific triggers for each event
   - Use trigger conditions to filter events
   - Makes tag management more organized

4. **Test Before Publishing:**
   - Always use Preview mode before publishing
   - Test all events and tags
   - Verify data is being sent correctly

5. **Version Control:**
   - Use GTM's versioning system
   - Create versions before major changes
   - Makes it easy to roll back if needed

## Additional Resources

- [Google Tag Manager Documentation](https://developers.google.com/tag-manager)
- [GTM DataLayer Guide](https://developers.google.com/tag-manager/devguide)
- [GTM Preview Mode](https://support.google.com/tagmanager/answer/6107056)
- [GTM Best Practices](https://support.google.com/tagmanager/topic/3441640)

## Notes

- GTM only loads if `VITE_GTM_CONTAINER_ID` is set
- All tracking is non-blocking (won't affect app performance)
- Console logs are only shown in development
- Events are pushed to dataLayer asynchronously
- GTM works alongside direct GA4 and HubSpot tracking implementations
- You can use GTM to manage GA4 and HubSpot tracking instead of direct implementation
- GTM Preview mode is essential for debugging
- Always test in Preview mode before publishing

## Integration with Existing Analytics

The current implementation includes:
- Direct GA4 tracking (via `analytics.js`)
- Direct HubSpot tracking (via `hubspot.js`)
- GTM dataLayer tracking (via `gtm.js`)

You can:
1. **Keep all three** for redundancy and flexibility
2. **Use only GTM** and configure GA4/HubSpot tracking through GTM
3. **Use GTM for new tags** while keeping direct implementations

The choice depends on your needs and preferences.

