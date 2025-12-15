# Custom Events & Dashboards Setup Guide for GA4 & HubSpot

## 🎯 Overview

This guide explains what custom configurations you need (or don't need) in GA4 and HubSpot, and whether you should create custom dashboards.

---

## 📊 Part 1: Custom Events - Do You Need Them?

### ✅ Good News: Most Events Are Already Standard!

Your code uses **standard GA4 e-commerce events** that work automatically. You typically **don't need to create** these:

#### Standard GA4 Events (No Setup Needed):
- ✅ `page_view` - Automatic
- ✅ `view_item` - Standard e-commerce event
- ✅ `view_item_list` - Standard e-commerce event
- ✅ `add_to_cart` - Standard e-commerce event
- ✅ `remove_from_cart` - Standard e-commerce event
- ✅ `begin_checkout` - Standard e-commerce event
- ✅ `purchase` - Standard e-commerce event
- ✅ `sign_up` - Standard event
- ✅ `login` - Standard event
- ✅ `search` - Standard event

**Action:** Just mark them as conversions in GA4 (Admin → Events → Toggle ON)

---

### 🔧 Custom Events You Might Need to Configure

#### 1. Custom Events in GA4

**These are custom events in your code that you may want to configure:**

##### A. `document_upload` (Custom Event)
- **Status:** Already tracked in code
- **Action Needed:** 
  - ✅ **Optional:** Mark as conversion if document uploads are important
  - ✅ **Optional:** Create custom dimension for `document_type` (medicalPrescription, importAuthorization, etc.)

**How to Configure:**
1. Go to **Admin** → **Custom Definitions** → **Custom Dimensions**
2. Click **Create custom dimension**
3. Name: `Document Type`
4. Scope: **Event**
5. Event parameter: `document_type`
6. Click **Save**

##### B. `payment_proof_upload` (Custom Event)
- **Status:** Already tracked in code
- **Action Needed:**
  - ✅ **Optional:** Mark as conversion (if payment proof upload is a key milestone)
  - ✅ **Optional:** Create custom dimension for `order_id`

**How to Configure:**
1. Go to **Admin** → **Custom Definitions** → **Custom Dimensions**
2. Click **Create custom dimension**
3. Name: `Order ID`
4. Scope: **Event**
5. Event parameter: `order_id`
6. Click **Save**

##### C. `lead` (Custom Event)
- **Status:** Already tracked in code
- **Action Needed:**
  - ✅ **Recommended:** Mark as conversion (lead generation is important!)
  - ✅ **Optional:** Create custom dimension for `lead_source`

**How to Configure:**
1. Go to **Admin** → **Events** → Find `lead` → Toggle "Mark as conversion" ON
2. Go to **Admin** → **Custom Definitions** → **Custom Dimensions**
3. Create dimension: `Lead Source` (scope: Event, parameter: `lead_source`)

---

#### 2. Custom Events in HubSpot

**HubSpot uses custom behavioral events. You need to configure these:**

##### A. `goal_form` (Custom Event)
- **Status:** Already tracked in code
- **Action Needed:** ✅ **REQUIRED** - Create in HubSpot Events Manager

**How to Create:**
1. Go to **HubSpot** → **Settings** → **Tracking Code** → **Events**
2. Click **Create event**
3. Event name: `goal_form`
4. Description: "User submitted goal form on homepage"
5. Click **Save**
6. Use in workflows: **Marketing** → **Automation** → **Workflows**

##### B. `cta_click` (Custom Event)
- **Status:** May be tracked in code
- **Action Needed:** ✅ **REQUIRED** - Create in HubSpot if you track CTA clicks

**How to Create:**
1. Go to **HubSpot** → **Settings** → **Tracking Code** → **Events**
2. Click **Create event**
3. Event name: `cta_click`
4. Description: "User clicked CTA button"
5. Click **Save**

##### C. `document_upload` (Custom Event)
- **Status:** Already tracked in code
- **Action Needed:** ✅ **REQUIRED** - Create in HubSpot

**How to Create:**
1. Go to **HubSpot** → **Settings** → **Tracking Code** → **Events**
2. Click **Create event**
3. Event name: `document_upload`
4. Description: "User uploaded document (prescription, authorization, etc.)"
5. Click **Save**

##### D. `payment_proof_upload` (Custom Event)
- **Status:** Already tracked in code
- **Action Needed:** ✅ **REQUIRED** - Create in HubSpot

**How to Create:**
1. Go to **HubSpot** → **Settings** → **Tracking Code** → **Events**
2. Click **Create event**
3. Event name: `payment_proof_upload`
4. Description: "User uploaded payment proof for order"
5. Click **Save**

##### E. `view_content` (Custom Event)
- **Status:** Already tracked in code
- **Action Needed:** ✅ **REQUIRED** - Create in HubSpot (if not already exists)

**How to Create:**
1. Go to **HubSpot** → **Settings** → **Tracking Code** → **Events**
2. Click **Create event**
3. Event name: `view_content`
4. Description: "User viewed product content"
5. Click **Save**

---

## 📋 Summary: What You Need to Create

### GA4: Mostly Just Mark as Conversions
- ✅ **No custom events needed** (all are standard)
- ✅ **Optional:** Create custom dimensions for:
  - `document_type` (if you want to analyze document types)
  - `order_id` (if you want to track specific orders)
  - `lead_source` (if you want to analyze lead sources)
- ✅ **Required:** Mark these as conversions:
  - `purchase` ⭐ (MOST IMPORTANT)
  - `begin_checkout`
  - `sign_up`
  - `add_to_cart`
  - `lead` (if you track leads)

### HubSpot: Create Custom Events
- ✅ **Required:** Create these custom events:
  - `goal_form`
  - `document_upload`
  - `payment_proof_upload`
  - `view_content` (if not already exists)
  - `cta_click` (if you track CTA clicks)
- ✅ **Standard events** (already work):
  - `page_view`
  - `begin_checkout`
  - `purchase`
  - `complete_registration`

---

## 📊 Part 2: Custom Dashboards - Should You Create Them?

### ✅ YES - Create Custom Dashboards!

Custom dashboards help you see the most important metrics at a glance. Here's what to create:

---

## 🎯 GA4 Custom Dashboards

### Dashboard 1: E-commerce Overview (Recommended)

**Purpose:** Quick view of sales and conversion metrics

**How to Create:**
1. Go to **Reports** → **Home**
2. Click **Edit collection** (pencil icon)
3. Add these cards:

**Cards to Add:**
- **Total Revenue** (Monetization → Revenue)
- **Purchases** (Engagement → Conversions)
- **E-commerce Conversion Rate** (Calculated: Purchases / Sessions)
- **Average Order Value** (Monetization → Average purchase revenue)
- **Top Products by Revenue** (Monetization → Top selling items)
- **Checkout Abandonment Rate** (Calculated metric)

**Save as:** "E-commerce Overview"

---

### Dashboard 2: User Journey Funnel (Recommended)

**Purpose:** Track users from visit to purchase

**How to Create:**
1. Go to **Explore** → **Funnel exploration**
2. Name: "E-commerce Conversion Funnel"
3. Add steps:
   - Step 1: `view_item_list` (Browse Products)
   - Step 2: `view_item` (View Product)
   - Step 3: `add_to_cart` (Add to Cart)
   - Step 4: `begin_checkout` (Start Checkout)
   - Step 5: `purchase` (Complete Purchase)
4. Click **Save**

**Use this to:**
- See drop-off at each stage
- Identify where users abandon
- Optimize conversion funnel

---

### Dashboard 3: Product Performance (Optional but Useful)

**Purpose:** See which products perform best

**How to Create:**
1. Go to **Explore** → **Free form**
2. Name: "Product Performance"
3. Add dimensions:
   - Item name
   - Item category
4. Add metrics:
   - Item views
   - Items added to cart
   - Items purchased
   - Revenue
5. Sort by: Revenue (descending)
6. Click **Save**

---

### Dashboard 4: Traffic Sources (Optional)

**Purpose:** See where your traffic comes from

**How to Create:**
1. Go to **Reports** → **Acquisition** → **Traffic acquisition**
2. Customize the report
3. Add cards for:
   - Top traffic sources
   - Conversion rate by source
   - Revenue by source
4. Save as custom report

---

## 🎯 HubSpot Custom Dashboards

### Dashboard 1: CRM Overview (Recommended)

**Purpose:** Quick view of leads, deals, and customers

**How to Create:**
1. Go to **Reports** → **Dashboards**
2. Click **Create dashboard**
3. Name: "CRM Overview"
4. Add these reports:

**Reports to Add:**
- **Deals Created** (Sales → Deals created)
- **Deals Closed** (Sales → Deals closed)
- **Revenue** (Sales → Revenue)
- **Contacts Created** (Marketing → Contacts created)
- **Leads by Source** (Marketing → Leads by source)
- **Email Open Rate** (Marketing → Email performance)

**Save and share** with your team

---

### Dashboard 2: Lead Generation (Recommended)

**Purpose:** Track lead generation activities

**How to Create:**
1. Go to **Reports** → **Dashboards**
2. Click **Create dashboard**
3. Name: "Lead Generation"
4. Add reports:

**Reports to Add:**
- **Goal Form Submissions** (Custom report: Event = `goal_form`)
- **Document Uploads** (Custom report: Event = `document_upload`)
- **CTA Clicks** (Custom report: Event = `cta_click`)
- **New Contacts** (Marketing → Contacts created)
- **Lead Conversion Rate** (Calculated: Leads / Visitors)

---

### Dashboard 3: Sales Pipeline (Recommended)

**Purpose:** Track sales progress

**How to Create:**
1. Go to **Sales** → **Deals**
2. Create a pipeline view
3. Add stages:
   - Lead
   - Qualified
   - Proposal
   - Negotiation
   - Closed Won
   - Closed Lost
4. Add filters for:
   - Deal value
   - Deal stage
   - Owner
5. Save as dashboard widget

---

## 📋 Dashboard Priority Checklist

### GA4 Dashboards (Do These First):
- [ ] **E-commerce Overview** - Most important for sales tracking
- [ ] **Conversion Funnel** - Critical for optimization
- [ ] **Product Performance** - Useful for inventory decisions

### HubSpot Dashboards (Do These First):
- [ ] **CRM Overview** - Essential for sales team
- [ ] **Lead Generation** - Important for marketing
- [ ] **Sales Pipeline** - Critical for sales management

---

## 🔧 Step-by-Step: Creating Custom Events in HubSpot

### Example: Creating `goal_form` Event

1. **Navigate to Events:**
   - Go to **HubSpot** → **Settings** (⚙️ icon, top right)
   - Click **Tracking Code** (under Website)
   - Click **Events** tab

2. **Create New Event:**
   - Click **Create event** button
   - Event name: `goal_form`
   - Description: "User submitted goal form on homepage"
   - Category: **Custom** (or choose appropriate category)

3. **Configure Event Properties (Optional):**
   - Add property: `source` (to track where form was submitted)
   - Add property: `form_name` (if you have multiple forms)

4. **Save:**
   - Click **Save**
   - Event is now available for workflows and reports

5. **Use in Workflows:**
   - Go to **Marketing** → **Automation** → **Workflows**
   - Create workflow: "When `goal_form` event fires, send welcome email"

---

## 🔧 Step-by-Step: Creating Custom Dimensions in GA4

### Example: Creating `document_type` Dimension

1. **Navigate to Custom Definitions:**
   - Go to **Admin** → **Custom Definitions** → **Custom Dimensions**
   - Click **Create custom dimension**

2. **Configure Dimension:**
   - Dimension name: `Document Type`
   - Scope: **Event** (since it's sent with events)
   - Event parameter: `document_type`
   - Description: "Type of document uploaded (prescription, authorization, etc.)"

3. **Save:**
   - Click **Save**
   - Wait 24-48 hours for data to populate

4. **Use in Reports:**
   - Go to **Explore** → **Free form**
   - Add "Document Type" as dimension
   - Analyze which document types are most common

---

## 📊 Recommended Dashboard Layout

### GA4 Home Dashboard:
```
┌─────────────────────────────────────────┐
│  E-commerce Overview                    │
├─────────────────────────────────────────┤
│  Revenue: R$ X,XXX    |  Purchases: XXX │
│  AOV: R$ XXX          |  Conv Rate: X%  │
├─────────────────────────────────────────┤
│  Top Products by Revenue                │
│  [Chart: Product names and revenue]     │
├─────────────────────────────────────────┤
│  Conversion Funnel                      │
│  [Funnel: view → cart → checkout → buy]│
└─────────────────────────────────────────┘
```

### HubSpot CRM Dashboard:
```
┌─────────────────────────────────────────┐
│  CRM Overview                           │
├─────────────────────────────────────────┤
│  Deals: XX    |  Revenue: R$ X,XXX     │
│  Contacts: XX |  Leads: XX              │
├─────────────────────────────────────────┤
│  Lead Generation                        │
│  [Chart: Goal forms, document uploads]   │
├─────────────────────────────────────────┤
│  Sales Pipeline                         │
│  [Pipeline: Lead → Qualified → Won]     │
└─────────────────────────────────────────┘
```

---

## ✅ Final Checklist

### GA4 Setup:
- [ ] Mark standard events as conversions (purchase, begin_checkout, sign_up, add_to_cart)
- [ ] Create custom dimensions (optional: document_type, order_id, lead_source)
- [ ] Create E-commerce Overview dashboard
- [ ] Create Conversion Funnel report
- [ ] Create Product Performance report

### HubSpot Setup:
- [ ] Create custom event: `goal_form`
- [ ] Create custom event: `document_upload`
- [ ] Create custom event: `payment_proof_upload`
- [ ] Create custom event: `view_content` (if needed)
- [ ] Create custom event: `cta_click` (if needed)
- [ ] Create CRM Overview dashboard
- [ ] Create Lead Generation dashboard
- [ ] Create Sales Pipeline dashboard

---

## 🚀 Quick Start (Do This First)

**Priority 1 (Today):**
1. ✅ Mark `purchase` as conversion in GA4
2. ✅ Create `goal_form` event in HubSpot
3. ✅ Create E-commerce Overview dashboard in GA4
4. ✅ Create CRM Overview dashboard in HubSpot

**Priority 2 (This Week):**
5. ✅ Create Conversion Funnel in GA4
6. ✅ Create remaining HubSpot custom events
7. ✅ Create Lead Generation dashboard in HubSpot

**Priority 3 (Later):**
8. ✅ Create custom dimensions in GA4 (if needed)
9. ✅ Create additional dashboards as needed

---

## 💡 Pro Tips

1. **Start Simple:** Don't create everything at once. Start with the most important dashboards.

2. **Test Events:** After creating events in HubSpot, test them using the Events Manager → Test Events feature.

3. **Share Dashboards:** Share your dashboards with team members who need them.

4. **Update Regularly:** Review and update dashboards monthly to ensure they show relevant metrics.

5. **Use Filters:** Add date range filters to dashboards for better analysis.

---

**Remember:** Most GA4 events are standard and work automatically. Focus on marking conversions and creating dashboards. HubSpot requires you to create custom events before they can be used in workflows.

