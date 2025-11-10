# HubSpot Tracking Setup Guide

## Overview

HubSpot tracking is now integrated into the EverWell frontend to capture behavioral events, page views, and conversions for CRM automation and marketing workflows.

## Setup Instructions

### 1. Get Your HubSpot Tracking (Portal) ID

1. Sign in to [HubSpot](https://app.hubspot.com/login)
2. Navigate to **Settings → Tracking & Analytics → Tracking code**
3. Locate your Hub ID (portal ID). Example: `1234567`

### 2. Configure Environment Variable

Add the Hub ID to your frontend environment:

**For local development:**
Create or update `frontend/.env.local`:
```env
VITE_HUBSPOT_PORTAL_ID=1234567
```

**For production:**
Add the same variable to your hosting platform's environment variables.

### 3. Verify Installation

1. Start your development server:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Open your browser's Developer Console (F12)
3. You should see: `HubSpot: Initialized with portal ID 1234567`
4. Navigate through the app and check for HubSpot tracking logs

### 4. Check HubSpot Analytics

1. Go to **Reports → Analytics Tools → Traffic analytics**
2. Filter by your environment (domain or stage) to verify page views and events
3. For custom events, open **Reports → Behavioral Events** (Enterprise) or use **Lists/Workflows** to build segments leveraging tracked metadata

## Tracked Events

HubSpot automatically captures page views. The app also fires custom behavioral events through `window._hsq` for richer analytics.

### Page Views
- **Triggered:** On every route change
- **Data:** Path and document title (when available)

### Custom Behavioral Events

| Event Name                | Trigger                                                                              | Properties                                                                 |
|---------------------------|--------------------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| `view_content`            | User views a product detail page                                                    | `product_name`, `product_id`, `category`, `price`                          |
| `add_to_cart`             | User adds an item to the cart                                                        | `product_name`, `product_id`, `category`, `price`, `quantity`              |
| `begin_checkout`          | User proceeds to checkout                                                            | `total_value`, `items` (array of `{ product_id, name, quantity, price }`)  |
| `purchase`                | Order successfully created                                                           | `order_id`, `total_value`, `items`                                         |
| `complete_registration`   | Registration completed (email or OAuth)                                             | `method`                                                                   |
| `search`                  | Product search performed                                                             | `query`                                                                    |
| `document_upload`         | User uploads compliance documentation                                               | `document_type`                                                            |
| `payment_proof_upload`    | User uploads payment proof                                                           | `order_id`                                                                 |
| `view_category`           | Product listing viewed                                                              | `category`, `items` (array of `{ product_id, name, price }`)               |

> HubSpot custom events (Behavioural Events) require Marketing Hub Enterprise to view the event stream out-of-the-box. Even without enterprise, the events populate `_hsq` allowing you to trigger workflows via custom code or HubSpot APIs.

## Testing

### Manual Testing

1. Navigate between pages and check the console for `HubSpot: Page view tracked ...`
2. Perform key user flows (product view, add to cart, checkout, upload documents)
3. Confirm events log to the console (only in development)
4. After a few minutes, verify in HubSpot traffic analytics or event reporting

### Network Inspection

1. Open Developer Tools → Network tab
2. Filter by `hs-analytics` or `hs-scripts`
3. Confirm requests to `https://js.hs-scripts.com/<portalId>.js`
4. Additional requests (e.g., to `track.hubspot.com`) indicate events being sent

### HubSpot Debugging Tips

- Install the [HubSpot Chrome Extension](https://chrome.google.com/webstore/detail/hubspot-sales/nhfjnlgeljbhcgdmggemkfojbdgccffj) to confirm tracking on the page
- Use HubSpot's browser console helper to inspect `_hsq` events:
  ```js
  window._hsq
  ```
- For enterprise portals, use **Reports → Analytics Tools → Events** to verify custom events

## Troubleshooting

### Script Not Loading
- Ensure `VITE_HUBSPOT_PORTAL_ID` is set and server restarted
- Confirm no Content Security Policy (CSP) blocks `https://js.hs-scripts.com`
- Disable strict ad blockers during testing

### Events Missing in HubSpot
- HubSpot dashboards can take a few minutes to refresh
- Custom behavioral events require Marketing Hub Enterprise for native reporting
- Verify that the event names match exactly when building workflows or lists

### Duplication or Multiple Loads
- The loader guards against double initialization using `window.__hubspotInitialized`
- If embedding the standard HubSpot snippet elsewhere (e.g., via CMS), ensure only one loader runs

## Production Checklist

- [ ] `VITE_HUBSPOT_PORTAL_ID` configured in all environments
- [ ] QA verified key flows with HubSpot tracking enabled
- [ ] Privacy policy updated to reflect HubSpot usage
- [ ] Cookie consent or tracking opt-in aligned with regulatory requirements (GDPR/LGPD/CCPA)
- [ ] Marketing team informed about new events for workflows and segmentation

## Additional Resources

- [HubSpot Tracking Code Documentation](https://knowledge.hubspot.com/reports/install-the-hubspot-tracking-code)
- [Custom Behavioral Events Guide](https://developers.hubspot.com/docs/api/events/custom-behavioral-events)
- [HubSpot Privacy & Consent Tools](https://knowledge.hubspot.com/privacy-and-consent)

## Privacy Considerations

- Inform users about HubSpot tracking in your privacy/cookie policy
- Configure cookie consent banners if required in your jurisdiction
- HubSpot honors the `__hs_opt_out` cookie; consider exposing opt-out mechanisms if mandated

