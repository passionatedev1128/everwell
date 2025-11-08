# SimplyBook Widget Setup Guide

## Overview

SimplyBook widget has been integrated into the EverWell application to allow users to book medical consultations directly from the website.

## Setup Instructions

### 1. Get Your SimplyBook Company ID

1. Go to [SimplyBook](https://simplybook.me/)
2. Sign up or log in to your account
3. Go to **Settings** → **Widgets** → **Booking Widget**
4. Copy your **Company ID** (format: `your-company-name` or `everwell`)
   - This is the subdomain before `.simplybook.me`
   - Example: If your booking URL is `https://everwell.simplybook.me`, your Company ID is `everwell`

### 2. Configure Environment Variable

Add the SimplyBook Company ID to your frontend environment:

**For local development:**
Create or update `frontend/.env.local`:
```env
VITE_SIMPLYBOOK_COMPANY_ID=everwell
```

**For production:**
Add the same variable to your hosting platform's environment variables.

### 3. Verify Installation

1. Start your development server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Navigate to: `http://localhost:5173/agendar`
3. You should see the SimplyBook booking widget
4. The widget should be styled with EverWell colors

## Widget Features

### Current Implementation

- **Widget Type**: iframe (embedded booking system)
- **Theme**: Minimal (matches EverWell design)
- **Colors**: 
  - Primary: `#4fb3a8` (EverWell primary color)
  - Dark Text: `#1a3d3a` (EverWell dark teal)
- **Layout**: Modern timeline with top calendar
- **Language**: Portuguese (Brazil)

### Customization Options

You can customize the widget by modifying `SimplyBookWidget.jsx`:

```javascript
theme_settings: {
  sb_base_color: '#4fb3a8', // Primary color
  dark_font_color: '#1a3d3a', // Text color
  // ... more settings
}
```

## Pages Using the Widget

The booking widget is accessible at:
- **Route**: `/agendar`
- **Direct Link**: `http://localhost:5173/agendar`

### Links Updated

The following pages now link to the booking page:
- ✅ Header: "AGENDAR CONSULTA" button
- ✅ Home page: "Agendar Consulta" buttons
- ✅ Product Detail page: "Agendar Consulta" button

## Testing

### Manual Testing

1. **Navigate to Booking Page:**
   - Go to `http://localhost:5173/agendar`
   - Widget should load within a few seconds

2. **Test Booking Flow:**
   - Select a service (if multiple available)
   - Choose a date
   - Select a time slot
   - Fill in booking details
   - Complete the booking

3. **Check Styling:**
   - Widget should match EverWell color scheme
   - Should be responsive on mobile devices
   - Should have proper spacing and padding

### Browser Console

1. Open Developer Tools (F12)
2. Check Console tab
3. You should see:
   - SimplyBook widget script loading
   - Widget initializing
   - No errors

### Network Tab

1. Open Developer Tools → Network tab
2. Filter by "simplybook"
3. You should see:
   - `widget.js` loading
   - API requests to SimplyBook servers

## Troubleshooting

### Widget Not Loading

**Problem:** Widget doesn't appear or shows loading spinner indefinitely

**Solutions:**
1. Check that `VITE_SIMPLYBOOK_COMPANY_ID` is set correctly
2. Verify your SimplyBook account is active
3. Check browser console for errors
4. Verify SimplyBook widget is enabled in your SimplyBook account
5. Check network tab for failed requests

### Widget Styling Issues

**Problem:** Widget doesn't match EverWell design

**Solutions:**
1. Check `theme_settings` in `SimplyBookWidget.jsx`
2. Verify colors match EverWell design system
3. Test in different browsers
4. Clear browser cache

### Company ID Not Working

**Problem:** Widget shows error or wrong company

**Solutions:**
1. Double-check Company ID format (no `.simplybook.me` suffix)
2. Verify Company ID in SimplyBook dashboard
3. Test with a different Company ID
4. Check environment variable is loaded (restart dev server)

## Advanced Configuration

### Service-Specific Booking

To link directly to a specific service:

```javascript
<SimplyBookWidget 
  companyId="everwell" 
  serviceId="12345" // Service ID from SimplyBook
/>
```

### Custom Theme Settings

Modify `theme_settings` in `SimplyBookWidget.jsx`:

```javascript
theme_settings: {
  sb_base_color: '#4fb3a8', // Primary color
  dark_font_color: '#1a3d3a', // Text color
  light_font_color: '#ffffff', // Light text
  body_bg_color: '#ffffff', // Background
  timeline_modern_theme_color: '#4fb3a8', // Timeline color
  // ... more settings
}
```

### Widget Events (Optional)

You can listen to SimplyBook widget events:

```javascript
// In SimplyBookWidget.jsx
useEffect(() => {
  // Listen for booking completion
  window.addEventListener('sb-booking-completed', (event) => {
    console.log('Booking completed:', event.detail);
    // Track analytics, show confirmation, etc.
  });
}, []);
```

## Integration with Analytics

### Track Booking Events

You can add analytics tracking when bookings are completed:

```javascript
// In SimplyBookWidget.jsx
useEffect(() => {
  window.addEventListener('sb-booking-completed', (event) => {
    // Track with GA4
    if (window.gtag) {
      window.gtag('event', 'booking_completed', {
        booking_id: event.detail.bookingId,
        service_name: event.detail.serviceName,
      });
    }
    
    // Track with Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'Schedule', {
        content_name: event.detail.serviceName,
      });
    }
    
    // Track with GTM
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'booking_completed',
        booking_id: event.detail.bookingId,
        service_name: event.detail.serviceName,
      });
    }
  });
}, []);
```

## Production Checklist

- [ ] SimplyBook Company ID added to production environment variables
- [ ] Tested booking flow end-to-end
- [ ] Verified widget loads correctly
- [ ] Checked styling matches EverWell design
- [ ] Tested on mobile devices
- [ ] Verified all booking links work
- [ ] Set up analytics tracking (if needed)
- [ ] Tested with real SimplyBook account

## Additional Resources

- [SimplyBook Documentation](https://simplybook.me/help/)
- [SimplyBook Widget Guide](https://simplybook.me/help/widget/)
- [SimplyBook API Documentation](https://simplybook.me/api-documentation/)

## Notes

- SimplyBook widget only loads if `VITE_SIMPLYBOOK_COMPANY_ID` is set
- Widget loads asynchronously (won't block page rendering)
- Widget is embedded in an iframe (isolated from main app)
- SimplyBook handles all booking logic and payment processing
- Bookings are stored in SimplyBook's system
- You can sync bookings to your database via SimplyBook API (optional)

## Optional: Booking Sync

If you want to store bookings in your MongoDB database:

1. **Set up SimplyBook Webhook:**
   - Go to SimplyBook → Settings → Integrations → Webhooks
   - Add webhook URL: `https://your-api.com/api/bookings/webhook`
   - Select events: `booking.created`, `booking.updated`

2. **Create Backend Endpoint:**
   ```javascript
   // backend/routes/bookings.js
   router.post('/webhook', async (req, res) => {
     // Verify webhook signature
     // Save booking to MongoDB
     // Send confirmation email
   });
   ```

3. **Display Bookings in Dashboard:**
   - Fetch bookings from MongoDB
   - Display in user dashboard
   - Show booking history

This is optional - SimplyBook already stores all bookings in their system.

