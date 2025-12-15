# GA4 Setup: Step-by-Step Configuration Guide

## 🎯 Overview

This guide walks you through all the essential settings you need to configure in your Google Analytics 4 (GA4) account to get the most out of your EverWell e-commerce tracking.

**Your GA4 Measurement ID:** `G-05TH31T6CK`

---

## 📋 Step 1: Verify Your Property Setup

### 1.1 Access Your GA4 Property
1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property (should show your website name)
3. Verify the **Measurement ID** in the top-left: `G-05TH31T6CK`

### 1.2 Check Data Stream
1. Go to **Admin** (⚙️ icon, bottom left)
2. Under **Property**, click **Data Streams**
3. Click on your web stream
4. Verify:
   - ✅ Stream URL matches your website
   - ✅ Measurement ID is `G-05TH31T6CK`
   - ✅ Enhanced measurement is **enabled**

---

## 🎯 Step 2: Mark Key Events as Conversions

**Why:** Conversions are your business goals. Marking events as conversions helps you track success.

### 2.1 Navigate to Events
1. Go to **Admin** → **Events** (under Property column)
   - OR: **Configure** → **Events** (left sidebar)

### 2.2 Mark Critical Conversions

Find each event below and toggle **"Mark as conversion"** to ON:

#### ✅ **purchase** (MOST IMPORTANT)
- **What it is:** Completed orders
- **Why mark it:** This is your primary revenue goal
- **How to find:** Search for "purchase" in the events list
- **Action:** Toggle the switch to mark as conversion

#### ✅ **begin_checkout**
- **What it is:** Users starting checkout process
- **Why mark it:** Track how many users reach checkout
- **Action:** Toggle ON

#### ✅ **sign_up**
- **What it is:** New user registrations
- **Why mark it:** Track user acquisition
- **Action:** Toggle ON

#### ✅ **add_to_cart**
- **What it is:** Products added to shopping cart
- **Why mark it:** Measure shopping engagement
- **Action:** Toggle ON

### 2.3 Optional Conversions (Mark if relevant)

- **view_item** - Product detail views (engagement metric)
- **login** - User logins (engagement metric)

### 2.4 Verify Conversions
1. Go to **Reports** → **Engagement** → **Conversions**
2. You should see your marked events listed
3. Wait 24-48 hours for data to populate

---

## 💰 Step 3: Set Up E-commerce Reporting

### 3.1 Enable Enhanced E-commerce
1. Go to **Admin** → **Data Streams** → Click your stream
2. Scroll to **Enhanced measurement**
3. Ensure it's **enabled** (toggle should be ON)
4. Click **⚙️** to configure:
   - ✅ Page views
   - ✅ Scrolls
   - ✅ Outbound clicks
   - ✅ Site search (if you have search)
   - ✅ Video engagement (if you have videos)
   - ✅ File downloads (if you have downloadable files)

### 3.2 Verify E-commerce Data
1. Go to **Reports** → **Monetization** → **E-commerce purchases**
2. Check that:
   - Purchase events are showing
   - Revenue is being tracked
   - Items sold count is accurate
   - Average order value is calculated

### 3.3 Check Product Performance
1. Go to **Reports** → **Monetization** → **E-commerce purchases**
2. Scroll down to see:
   - Top products by revenue
   - Top products by quantity sold
   - Product performance metrics

---

## 📊 Step 4: Create Custom Reports

### 4.1 User Journey Report
1. Go to **Explore** (left sidebar) → **Blank** (or **Free form**)
2. Name it: "User Journey: Home → Product → Cart → Purchase"
3. Add dimensions:
   - Event name
   - Page title
   - Page path
4. Add metrics:
   - Event count
   - Users
   - Conversions
5. Add filters:
   - Event name: `page_view`, `view_item`, `add_to_cart`, `begin_checkout`, `purchase`

### 4.2 Product Performance Report
1. Go to **Explore** → **Blank**
2. Name it: "Product Performance Analysis"
3. Add dimensions:
   - Item name
   - Item category
4. Add metrics:
   - Item views
   - Items added to cart
   - Items purchased
   - Revenue
5. Sort by: Revenue (descending)

### 4.3 Conversion Funnel Report
1. Go to **Explore** → **Funnel exploration**
2. Name it: "E-commerce Conversion Funnel"
3. Add steps (in order):
   - Step 1: `view_item` (Product View)
   - Step 2: `add_to_cart` (Add to Cart)
   - Step 3: `begin_checkout` (Start Checkout)
   - Step 4: `purchase` (Complete Purchase)
4. This shows drop-off at each stage

---

## 👥 Step 5: Set Up Audiences

**Why:** Audiences help you segment users for remarketing and analysis.

### 5.1 Navigate to Audiences
1. Go to **Admin** → **Audiences** (under Property column)

### 5.2 Create Essential Audiences

#### Audience 1: Cart Abandoners
1. Click **New audience** → **Create a custom audience**
2. Name: "Cart Abandoners"
3. Add condition:
   - Event: `add_to_cart` (has occurred)
   - AND
   - Event: `purchase` (has NOT occurred)
4. Membership duration: 30 days
5. Click **Save**

#### Audience 2: High-Value Customers
1. Click **New audience** → **Create a custom audience**
2. Name: "High-Value Customers"
3. Add condition:
   - Event: `purchase` (has occurred 2+ times)
   - OR
   - Revenue: Total revenue > [your threshold, e.g., 500]
4. Click **Save**

#### Audience 3: Product Viewers (No Purchase)
1. Click **New audience** → **Create a custom audience**
2. Name: "Product Viewers - No Purchase"
3. Add condition:
   - Event: `view_item` (has occurred)
   - AND
   - Event: `purchase` (has NOT occurred)
4. Membership duration: 7 days
5. Click **Save**

#### Audience 4: New Users
1. Click **New audience** → **Create a custom audience**
2. Name: "New Users"
3. Add condition:
   - User type: New users
4. Click **Save**

---

## ⚙️ Step 6: Configure Data Settings

### 6.1 Data Retention
1. Go to **Admin** → **Data Settings** → **Data Retention**
2. Set retention to: **14 months** (or maximum available)
3. Click **Save**

**Why:** Keeps your historical data longer for analysis

### 6.2 Data Filters (Optional)
1. Go to **Admin** → **Data Settings** → **Data Filters**
2. Create filter to exclude:
   - Internal traffic (your office IP)
   - Developer traffic (localhost)
   - Bot traffic

**How to exclude internal traffic:**
1. Click **Create filter**
2. Name: "Exclude Internal Traffic"
3. Filter type: **Internal traffic**
4. Add IP addresses or IP ranges to exclude
5. Click **Save**

### 6.3 User Data Collection
1. Go to **Admin** → **Data Settings** → **Data Collection**
2. Enable:
   - ✅ Google signals data collection
   - ✅ Enhanced measurement (if not already enabled)

---

## 🔍 Step 7: Set Up Search Console Integration (Optional but Recommended)

### 7.1 Link Search Console
1. Go to **Admin** → **Search Console Links** (under Property column)
2. Click **Link** → Select your Search Console property
3. Click **Next** → **Submit**

**Why:** See which search queries bring users to your site

---

## 📈 Step 8: Configure Attribution Settings

### 8.1 Attribution Model
1. Go to **Admin** → **Attribution Settings** (under Property column)
2. Select attribution model: **Data-driven** (recommended)
   - OR: **Last click** (simpler, traditional)
3. Lookback window: **30 days** (default)
4. Click **Save**

**Why:** Determines how credit is given to marketing channels

---

## 🎨 Step 9: Customize Reports

### 9.1 Add Custom Dimensions (if needed)
1. Go to **Admin** → **Custom Definitions** → **Custom Dimensions**
2. Click **Create custom dimension**
3. Examples you might want:
   - User role (customer/admin)
   - Product category
   - Order status

### 9.2 Customize Home Dashboard
1. Go to **Reports** → **Home**
2. Click **Edit collection** (pencil icon)
3. Add cards for:
   - Total revenue
   - Purchases
   - Top products
   - Conversion rate
4. Click **Save**

---

## ✅ Step 10: Verification Checklist

### 10.1 Real-time Verification
1. Go to **Reports** → **Realtime**
2. Perform these actions on your website:
   - ✅ Visit a page → Should see `page_view`
   - ✅ View a product → Should see `view_item`
   - ✅ Add to cart → Should see `add_to_cart`
   - ✅ Go to checkout → Should see `begin_checkout`
   - ✅ Complete purchase → Should see `purchase`

### 10.2 DebugView (Development Only)
1. Install [GA4 Debugger Chrome Extension](https://chrome.google.com/webstore/detail/google-analytics-debugger)
2. Enable it on your site
3. Go to **Admin** → **DebugView** (under Property column)
4. See events in real-time with all parameters

### 10.3 Network Tab Verification
1. Open browser DevTools → **Network** tab
2. Filter for: `collect`
3. Perform actions on your site
4. Verify requests to `https://www.google-analytics.com/g/collect`

---

## 📊 Step 11: Set Up Goals and KPIs

### 11.1 Key Metrics to Monitor
Create a dashboard or document tracking:

**Daily Metrics:**
- Total users
- Sessions
- Revenue
- Purchases
- Conversion rate

**Weekly Metrics:**
- Top products by revenue
- Cart abandonment rate
- Checkout completion rate
- Traffic sources

**Monthly Metrics:**
- User acquisition trends
- Revenue growth
- Product performance
- User journey analysis

---

## 🔔 Step 12: Set Up Alerts (Optional)

### 12.1 Create Custom Alerts
1. Go to **Admin** → **Custom Alerts** (under Property column)
2. Click **Create alert**
3. Examples:
   - **Revenue Drop Alert**: If revenue drops 20% vs previous day
   - **Conversion Rate Alert**: If conversion rate drops below threshold
   - **Traffic Spike Alert**: If traffic increases 50% (could indicate issue)

---

## 📱 Step 13: Mobile App Setup (If Applicable)

If you have a mobile app:
1. Go to **Admin** → **Data Streams** → **Add stream** → **iOS app** or **Android app**
2. Follow setup instructions
3. Link to same property for unified reporting

---

## 🎯 Priority Order

**Do these FIRST (Critical):**
1. ✅ Step 2: Mark conversions (purchase, begin_checkout, sign_up, add_to_cart)
2. ✅ Step 3: Verify e-commerce data
3. ✅ Step 10: Verify events are firing

**Do these SECOND (Important):**
4. ✅ Step 5: Create audiences (Cart Abandoners, High-Value Customers)
5. ✅ Step 4: Create custom reports
6. ✅ Step 6: Configure data retention

**Do these THIRD (Nice to have):**
7. ✅ Step 7: Search Console integration
8. ✅ Step 8: Attribution settings
9. ✅ Step 12: Set up alerts

---

## 🚨 Common Issues & Solutions

### Issue: Events not showing in reports
**Solution:** 
- Wait 24-48 hours for data to process
- Check DebugView for real-time verification
- Verify Measurement ID is correct

### Issue: Revenue not tracking
**Solution:**
- Check that `purchase` events include `value` parameter
- Verify currency is set correctly
- Check e-commerce reports, not just standard reports

### Issue: Conversions showing 0
**Solution:**
- Ensure events are marked as conversions (Step 2)
- Wait 24-48 hours for data
- Check that events are actually firing (Step 10)

---

## 📚 Additional Resources

- [GA4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [GA4 E-commerce Guide](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)
- [GA4 Events Reference](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [GA4 DebugView Guide](https://support.google.com/analytics/answer/7201382)

---

## ✅ Final Checklist

Before considering setup complete:

- [ ] Measurement ID verified: `G-05TH31T6CK`
- [ ] Enhanced measurement enabled
- [ ] Key events marked as conversions (purchase, begin_checkout, sign_up, add_to_cart)
- [ ] E-commerce data verified in reports
- [ ] At least 2 custom audiences created
- [ ] Data retention set to maximum
- [ ] Real-time events verified
- [ ] Custom reports created (at least funnel report)
- [ ] Home dashboard customized

---

**Remember:** GA4 data can take 24-48 hours to appear in standard reports. Use **Realtime** reports and **DebugView** for immediate verification.

