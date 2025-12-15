# Default vs Custom Dashboards: When to Use Each

## 🎯 Quick Answer

**Short answer:** You **don't need** to create custom dashboards immediately. Start with the **default dashboards** and create custom ones only when you need specific views that defaults don't provide.

---

## 📊 Part 1: GA4 Default Dashboards

### ✅ What GA4 Already Provides (Default Reports)

GA4 comes with built-in reports that work automatically:

#### 1. **Home Dashboard** (Default)
- **Location:** Reports → Home
- **What it shows:**
  - Users, Sessions, Revenue (last 7 days)
  - Top pages, top sources
  - Recent conversions
- **Should you use it?** ✅ **YES** - Start here!

#### 2. **Realtime Report** (Default)
- **Location:** Reports → Realtime
- **What it shows:**
  - Active users right now
  - Events happening in real-time
  - Top pages, sources, events
- **Should you use it?** ✅ **YES** - Great for testing

#### 3. **Engagement Reports** (Default)
- **Location:** Reports → Engagement
- **What it shows:**
  - Events, Conversions, Pages
  - User engagement metrics
- **Should you use it?** ✅ **YES** - Shows all your events

#### 4. **Monetization Reports** (Default)
- **Location:** Reports → Monetization
- **What it shows:**
  - E-commerce purchases
  - Revenue, Average order value
  - Top products by revenue
  - Product performance
- **Should you use it?** ✅ **YES** - Perfect for e-commerce!

#### 5. **Acquisition Reports** (Default)
- **Location:** Reports → Acquisition
- **What it shows:**
  - Traffic sources
  - User acquisition channels
  - Campaign performance
- **Should you use it?** ✅ **YES** - See where traffic comes from

#### 6. **Explore Section** (Default Templates)
- **Location:** Explore (left sidebar)
- **What it provides:**
  - Funnel exploration (template)
  - Path exploration (template)
  - Free form (blank template)
  - Cohort exploration (template)
- **Should you use it?** ✅ **YES** - Use templates, customize as needed

---

### 🤔 Do You Need Custom GA4 Dashboards?

#### ✅ **NO - Use Defaults If:**
- You're just starting out
- Default reports show what you need
- You want to see standard metrics (revenue, conversions, traffic)
- You don't have specific business questions

#### ✅ **YES - Create Custom If:**
- You need a **specific view** that combines multiple reports
- You want to track **custom metrics** not in defaults
- You need to **share specific views** with team members
- Default reports are **too cluttered** and you want a focused view
- You want to track **custom events** in a specific way

---

### 📋 GA4 Custom Dashboard Examples (When Needed)

#### Example 1: Custom E-commerce Overview
**When to create:** If you want a single view with:
- Revenue + Purchases + Conversion Rate + Top Products
- All in one place without clicking between reports

**Default alternative:** Use **Reports → Monetization → E-commerce purchases** (works great!)

#### Example 2: Custom Conversion Funnel
**When to create:** If you want a specific funnel:
- view_item_list → view_item → add_to_cart → begin_checkout → purchase

**Default alternative:** Use **Explore → Funnel exploration** (template exists!)

#### Example 3: Custom Product Performance
**When to create:** If you want specific product metrics combined

**Default alternative:** Use **Reports → Monetization → E-commerce purchases** → Scroll to "Top selling items"

---

## 📊 Part 2: HubSpot Default Dashboards

### ✅ What HubSpot Already Provides (Default Dashboards)

HubSpot comes with built-in dashboards:

#### 1. **CRM Dashboard** (Default)
- **Location:** Reports → Dashboards → CRM Dashboard
- **What it shows:**
  - Deals created, closed
  - Revenue
  - Contacts created
  - Pipeline overview
- **Should you use it?** ✅ **YES** - Perfect for sales team!

#### 2. **Marketing Dashboard** (Default)
- **Location:** Reports → Dashboards → Marketing Dashboard
- **What it shows:**
  - Email performance
  - Landing page performance
  - Blog performance
  - Contact growth
- **Should you use it?** ✅ **YES** - Great for marketing!

#### 3. **Sales Dashboard** (Default)
- **Location:** Reports → Dashboards → Sales Dashboard
- **What it shows:**
  - Deals by stage
  - Revenue by rep
  - Sales activity
  - Win/loss rates
- **Should you use it?** ✅ **YES** - If you have Sales Hub

#### 4. **Service Dashboard** (Default)
- **Location:** Reports → Dashboards → Service Dashboard
- **What it shows:**
  - Tickets, satisfaction
  - Response times
  - Resolution rates
- **Should you use it?** ✅ **YES** - If you have Service Hub

---

### 🤔 Do You Need Custom HubSpot Dashboards?

#### ✅ **NO - Use Defaults If:**
- Default CRM/Marketing dashboards show what you need
- You're tracking standard metrics (deals, contacts, revenue)
- You don't have specific custom events to track
- You're just getting started

#### ✅ **YES - Create Custom If:**
- You need to track **custom events** (goal_form, document_upload, etc.)
- You want a **combined view** of custom events + standard metrics
- Default dashboards don't show your **specific business metrics**
- You need to **share specific views** with different team members
- You want to track **custom properties** in a dashboard

---

### 📋 HubSpot Custom Dashboard Examples (When Needed)

#### Example 1: Custom Lead Generation Dashboard
**When to create:** If you want to track:
- `goal_form` submissions
- `document_upload` events
- `cta_click` events
- All in one place

**Default alternative:** Use **Marketing Dashboard** (but it won't show custom events)

**Verdict:** ✅ **Create custom** - Default doesn't show custom events

#### Example 2: Custom E-commerce Dashboard
**When to create:** If you want to track:
- Purchase events from HubSpot
- Deal creation from purchases
- Revenue from custom events

**Default alternative:** Use **CRM Dashboard** (shows deals/revenue)

**Verdict:** ⚠️ **Maybe** - Default might be enough, but custom gives more detail

---

## 🎯 Decision Matrix: Default vs Custom

### Use Default Dashboards When:
```
✅ You're just starting out
✅ Default reports show what you need
✅ You want standard metrics (revenue, conversions, traffic)
✅ You don't have time to customize
✅ You're learning the platform
```

### Create Custom Dashboards When:
```
✅ You need to track custom events (goal_form, document_upload)
✅ Default dashboards are too cluttered
✅ You need specific business metrics combined
✅ You want to share focused views with team
✅ Default reports don't answer your specific questions
```

---

## 📋 Recommended Approach: Start Simple

### Phase 1: Use Defaults (Week 1-2)
1. ✅ Use **GA4 Home** dashboard for overview
2. ✅ Use **GA4 Monetization** reports for e-commerce
3. ✅ Use **HubSpot CRM Dashboard** for sales
4. ✅ Use **HubSpot Marketing Dashboard** for marketing

**Action:** Just explore the defaults first!

### Phase 2: Customize Home Dashboards (Week 3-4)
1. ✅ **GA4:** Edit Home dashboard → Add/remove cards you need
2. ✅ **HubSpot:** Edit default dashboards → Add custom event reports

**Action:** Customize existing dashboards (easier than creating new ones)

### Phase 3: Create Custom Dashboards (Month 2+)
1. ✅ Create custom dashboards only if defaults don't meet your needs
2. ✅ Focus on custom events that aren't in defaults

**Action:** Create new dashboards only when needed

---

## ✅ What You Should Do Right Now

### GA4: Start with Defaults
1. ✅ Go to **Reports → Home** - Use this as your main dashboard
2. ✅ Go to **Reports → Monetization → E-commerce purchases** - See revenue/products
3. ✅ Go to **Reports → Engagement → Events** - See all events
4. ✅ **Optional:** Edit Home dashboard to add/remove cards

**Don't create custom dashboards yet** - Defaults are great!

### HubSpot: Start with Defaults
1. ✅ Go to **Reports → Dashboards → CRM Dashboard** - Use for sales
2. ✅ Go to **Reports → Dashboards → Marketing Dashboard** - Use for marketing
3. ✅ **Optional:** Add custom event reports to existing dashboards

**Don't create custom dashboards yet** - Unless you need to track custom events

---

## 🔧 When You DO Need Custom Dashboards

### GA4 Custom Dashboard: Only If You Need:

1. **Custom Funnel** - Specific funnel not in Explore templates
   - Example: Your exact user journey with custom events

2. **Combined View** - Multiple reports in one place
   - Example: Revenue + Product Performance + Traffic Sources together

3. **Custom Metrics** - Metrics not in defaults
   - Example: Custom calculated metrics specific to your business

### HubSpot Custom Dashboard: Only If You Need:

1. **Custom Events Dashboard** - Track custom events together
   - Example: `goal_form` + `document_upload` + `payment_proof_upload` in one view
   - **This is the main reason to create custom in HubSpot!**

2. **Team-Specific Views** - Different views for different teams
   - Example: Sales team sees deals, Marketing sees leads

3. **Combined Metrics** - Standard + Custom metrics together
   - Example: Deals + Custom Events + Revenue in one dashboard

---

## 📊 Summary Table

| Dashboard Type | Default Available? | Should You Create Custom? | When? |
|----------------|-------------------|---------------------------|-------|
| **GA4 E-commerce** | ✅ Yes (Monetization reports) | ⚠️ Maybe | Only if you need specific combined view |
| **GA4 Conversion Funnel** | ✅ Yes (Explore → Funnel) | ⚠️ Maybe | Only if default template doesn't fit |
| **GA4 Product Performance** | ✅ Yes (Monetization → Top items) | ❌ No | Default is sufficient |
| **HubSpot CRM** | ✅ Yes (CRM Dashboard) | ❌ No | Default is perfect |
| **HubSpot Marketing** | ✅ Yes (Marketing Dashboard) | ⚠️ Maybe | Only if you need custom events |
| **HubSpot Lead Generation** | ❌ No | ✅ **YES** | **Create this!** (tracks custom events) |

---

## 🎯 Final Recommendation

### For GA4:
**Start with defaults** → Customize Home dashboard → Create custom only if needed

**Priority:**
1. ✅ Use default **Home** and **Monetization** reports
2. ✅ Edit **Home** dashboard to add/remove cards
3. ⚠️ Create custom funnel in **Explore** (use template, customize)
4. ❌ Don't create custom dashboards unless you have specific needs

### For HubSpot:
**Start with defaults** → Add custom event reports → Create custom dashboard for custom events

**Priority:**
1. ✅ Use default **CRM Dashboard** and **Marketing Dashboard**
2. ✅ Add custom event reports to existing dashboards
3. ✅ **Create custom "Lead Generation" dashboard** (if you track goal_form, document_upload)
4. ❌ Don't create other custom dashboards unless needed

---

## 💡 Pro Tips

1. **Edit Before Creating:** Try editing default dashboards first (easier than creating new ones)

2. **Use Templates:** GA4 Explore has templates - use them instead of creating from scratch

3. **Start Simple:** Don't overcomplicate - defaults are usually enough

4. **Iterate:** Start with defaults, then customize as you learn what you need

5. **Share Defaults:** Default dashboards can be shared with team members too

---

## ✅ Action Plan

### This Week:
- [ ] Explore GA4 default reports (Home, Monetization, Engagement)
- [ ] Explore HubSpot default dashboards (CRM, Marketing)
- [ ] Edit GA4 Home dashboard to show metrics you care about
- [ ] Add custom event reports to HubSpot Marketing dashboard

### Next Week:
- [ ] Create custom funnel in GA4 Explore (if needed)
- [ ] Create "Lead Generation" dashboard in HubSpot (if tracking custom events)
- [ ] Share dashboards with team members

### Later:
- [ ] Create additional custom dashboards only if defaults don't meet your needs

---

**Bottom Line:** Default dashboards are excellent! Start there, customize as needed, and only create custom dashboards when you have specific needs that defaults don't cover.

