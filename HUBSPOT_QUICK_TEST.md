# HubSpot Quick Test - 5 Minutes

## 🚀 Quick Setup

1. **Get Portal ID**: HubSpot Settings → Tracking & Analytics → Tracking code
2. **Get API Key**: HubSpot Settings → Integrations → Private Apps
3. **Add to `.env` files:**
   ```env
   # frontend/.env.local
   VITE_HUBSPOT_PORTAL_ID=12345678
   
   # backend/.env
   HUBSPOT_API_KEY=pat-na1-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```
4. **Restart servers**

---

## ✅ 5-Minute Test

### Step 1: Check Initialization (30 seconds)
1. Open browser console (`F12`)
2. Look for: `✅ HubSpot: Initialized with portal ID 12345678`
3. Type: `window._hsq` → Should show an array

### Step 2: Test Page View (30 seconds)
1. Navigate to any page
2. Console should show: `HubSpot: Page view tracked`
3. Check Network tab → Filter `hs-scripts` → Should see requests

### Step 3: Test Event (1 minute)
1. In console, type:
   ```javascript
   window._hsq.push(['trackCustomBehavioralEvent', {
     name: 'test_event',
     properties: { test: 'value' }
   }]);
   ```
2. Should see: `HubSpot: Event tracked`

### Step 4: Test Real-time (2 minutes)
1. Go to [HubSpot Events Manager](https://app.hubspot.com/events/manager)
2. Click **Test Events** tab
3. Enter your URL: `http://localhost:5173`
4. Navigate through your app
5. Events should appear in real-time!

### Step 5: Test CRM (1 minute)
1. Create a test order in your app
2. Check backend console: `✅ HubSpot: contact created`
3. Go to [HubSpot Contacts](https://app.hubspot.com/contacts)
4. Search for the test email
5. Contact should appear with order details!

---

## 🎯 All Tests Passed?

- ✅ Console shows initialization
- ✅ Page views tracked
- ✅ Custom events work
- ✅ HubSpot Events Manager shows events
- ✅ Contacts created in CRM

**If all ✅ → HubSpot is working perfectly!**

For detailed testing, see `HUBSPOT_TESTING_GUIDE.md`

