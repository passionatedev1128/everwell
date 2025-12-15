# HubSpot Configuration Guide

This guide covers all the settings and configurations you need to set up in your HubSpot account for the EverWell integration.

---

## 📋 Required Setup in HubSpot

### 1. Get Your Portal ID (Already Done ✅)

**Location**: Settings → Tracking & Analytics → Tracking code

- Your Portal ID: `50689111`
- This is already configured in your `.env.local` file

---

## 2. Create Custom Contact Properties

Your app sends custom properties that need to be created in HubSpot to store user data properly.

### Step 1: Create Custom Property Group (Recommended)

Creating a custom group helps organize all EverWell properties together.

**Step-by-Step:**

1. Go to **Settings** → **Properties** → **Contact properties**
2. Look for the **Groups** section (usually at the top or in a dropdown)
3. Click **Create a group** or **Add group**
4. Fill in the form:
   - **Group name**: `EverWell`
   - **Group label** (display name): `EverWell`
   - **Description** (optional): `Properties for EverWell system integration`
5. Click **Create** or **Save**
6. The new "EverWell" group will now appear in the group dropdown

**Alternative Method:**
- When creating your first property, you'll see a "Group" dropdown
- Click **Create a new group** at the bottom of the dropdown
- Enter the group name: `EverWell`
- Click **Create**

### Step 2: Create Individual Properties

Now create each property and assign them to the "EverWell" group:

1. Go to **Settings** → **Properties** → **Contact properties**
2. Click **Create property** for each of the following:

#### Property 1: User ID
- **Type of object**: `Contact`
- **Group**: `EverWell` (select the group you just created)
- **Internal name**: `user_id`
- **Label**: `User ID`
- **Type**: Single-line text
- **Field type**: Text
- **Description**: "Unique user ID from EverWell system"
- **Visibility**: Visible to all users

#### Property 2: Role
- **Type of object**: `Contact`
- **Group**: `EverWell`
- **Internal name**: `role`
- **Label**: `Role`
- **Type**: Single-line text
- **Field type**: Text
- **Description**: "User role (user/admin)"
- **Visibility**: Visible to all users

#### Property 3: Is Authorized
- **Type of object**: `Contact`
- **Group**: `EverWell`
- **Internal name**: `is_authorized`
- **Label**: `Is Authorized`
- **Type**: Checkbox
- **Field type**: Boolean
- **Description**: "Whether user is authorized to purchase products"
- **Visibility**: Visible to all users

#### Property 4: Last Order ID
- **Type of object**: `Contact`
- **Group**: `EverWell`
- **Internal name**: `last_order_id`
- **Label**: `Last Order ID`
- **Type**: Single-line text
- **Field type**: Text
- **Description**: "Most recent order ID"
- **Visibility**: Visible to all users

#### Property 5: Last Order Total
- **Type of object**: `Contact`
- **Group**: `EverWell`
- **Internal name**: `last_order_total`
- **Label**: `Last Order Total`
- **Type**: Number
- **Field type**: Number
- **Description**: "Total amount of last order"
- **Visibility**: Visible to all users

#### Property 6: Last Order Status
- **Type of object**: `Contact`
- **Group**: `EverWell`
- **Internal name**: `last_order_status`
- **Label**: `Last Order Status`
- **Type**: Single-line text
- **Field type**: Text
- **Description**: "Status of last order (pending/paid/delivered)"
- **Visibility**: Visible to all users

---

## 3. Configure Behavioral Events

Your app tracks custom behavioral events. These should appear automatically, but you can verify and configure them.

### Step-by-Step:

1. Go to **Settings** → **Tracking & Analytics** → **Events**
2. Verify these events are being tracked:

#### Standard Events (Auto-tracked):
- ✅ `page_view` - Page views
- ✅ `view_content` - Product views
- ✅ `add_to_cart` - Add to cart
- ✅ `begin_checkout` - Checkout initiation
- ✅ `purchase` - Completed purchases
- ✅ `complete_registration` - User registration
- ✅ `search` - Product searches

#### Custom Events (Your app tracks):
- ✅ `cta_click` - CTA button clicks
- ✅ `goal_form` - Goal form submissions
- ✅ `view_category` - Product category views
- ✅ `document_upload` - Document uploads
- ✅ `payment_proof_upload` - Payment proof uploads

### Mark Important Events as Conversions:

1. Go to **Settings** → **Tracking & Analytics** → **Events**
2. Find each event and toggle **"Mark as conversion"** for:
   - `purchase` ⭐
   - `begin_checkout` ⭐
   - `complete_registration` ⭐
   - `goal_form` ⭐

---

## 4. Set Up Contact Lifecycle Stages (Optional but Recommended)

Create lifecycle stages to track user journey:

1. Go to **Settings** → **Properties** → **Contact properties**
2. Find **Lifecycle Stage** property
3. Ensure these stages exist:
   - **Lead** - New visitor/registered user
   - **Marketing Qualified Lead (MQL)** - User who submitted goal form
   - **Sales Qualified Lead (SQL)** - User who started checkout
   - **Customer** - User who completed purchase
   - **Evangelist** - Repeat customer

---

## 5. Create Workflows (Optional but Recommended)

### Workflow 1: Welcome New User

**Trigger**: Contact property `complete_registration` event fired

**Actions**:
1. Send welcome email
2. Add to "New Users" list
3. Set lifecycle stage to "Lead"

### Workflow 2: Cart Abandonment

**Trigger**: Contact has `begin_checkout` event but no `purchase` within 24 hours

**Actions**:
1. Send reminder email
2. Add to "Cart Abandoners" list
3. Set lifecycle stage to "MQL"

### Workflow 3: First Purchase

**Trigger**: Contact has `purchase` event for first time

**Actions**:
1. Send thank you email
2. Add to "Customers" list
3. Set lifecycle stage to "Customer"
4. Create deal (if using Sales Hub)

---

## 6. Create Lists for Segmentation

### Recommended Lists:

1. **New Users** - Users who registered in last 7 days
2. **Authorized Users** - Users where `is_authorized` = true
3. **Cart Abandoners** - Users with `begin_checkout` but no `purchase`
4. **Customers** - Users with at least one `purchase` event
5. **High-Value Customers** - Users with `last_order_total` > 500
6. **Product Viewers** - Users with `view_content` event

### How to Create:

1. Go to **Contacts** → **Lists**
2. Click **Create list**
3. Set criteria based on properties or events
4. Save and use in workflows/emails

---

## 7. Configure Email Templates (Optional)

If you set up workflows, create email templates:

1. Go to **Marketing** → **Email** → **Templates**
2. Create templates for:
   - Welcome email
   - Cart abandonment reminder
   - Purchase confirmation
   - Order status updates

---

## 8. Set Up Deals (If Using Sales Hub)

If you have Sales Hub, create deals for purchases:

1. Go to **Settings** → **Properties** → **Deal properties**
2. Create custom properties:
   - `order_id` (Text)
   - `product_names` (Text)
   - `order_items` (Text)

3. Create workflow to create deal on `purchase` event

---

## 9. Configure Reports and Dashboards

### Recommended Reports:

1. **User Registration Funnel**
   - `page_view` → `complete_registration` → `view_content` → `add_to_cart` → `purchase`

2. **E-commerce Performance**
   - Total purchases
   - Average order value
   - Cart abandonment rate
   - Product views vs purchases

3. **User Engagement**
   - Page views per user
   - Time on site
   - Most viewed products
   - CTA click rates

### How to Create:

1. Go to **Reports** → **Analytics Tools** → **Custom Reports**
2. Create report based on behavioral events
3. Add to dashboard for easy monitoring

---

## 10. Test Events in Real-Time

### Use Test Events Tab:

1. Go to **Settings** → **Tracking & Analytics** → **Events Manager**
2. Click **Test Events** tab
3. Enter your site URL: `http://localhost:5173` (or production URL)
4. Navigate through your site
5. Events should appear in real-time

---

## 11. Verify Contact Creation

### Test Contact Sync:

1. Register a new user in your app
2. Go to **Contacts** in HubSpot
3. Search for the user's email
4. Verify these properties are populated:
   - ✅ Email
   - ✅ Name
   - ✅ User ID
   - ✅ Role
   - ✅ Is Authorized

---

## 12. API Key Setup (For Backend Integration)

If you want backend to sync orders to HubSpot:

1. Go to **Settings** → **Integrations** → **Private Apps**
2. Click **Create a private app**
3. Name it: "EverWell Backend Integration"
4. Grant these scopes:
   - ✅ `crm.objects.contacts.write`
   - ✅ `crm.objects.contacts.read`
   - ✅ `crm.objects.deals.write` (if using Sales Hub)
5. Copy the API key
6. Add to backend `.env`: `HUBSPOT_API_KEY=pat-na1-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

---

## ✅ Configuration Checklist

Use this checklist to ensure everything is set up:

### Required:
- [ ] Portal ID configured in frontend (✅ Done: `50689111`)
- [ ] Custom contact properties created:
  - [ ] `user_id`
  - [ ] `role`
  - [ ] `is_authorized`
  - [ ] `last_order_id`
  - [ ] `last_order_total`
  - [ ] `last_order_status`
- [ ] Events are being tracked (verify in Events Manager)
- [ ] Test Events tab shows real-time events

### Recommended:
- [ ] Lifecycle stages configured
- [ ] Workflows created for automation
- [ ] Lists created for segmentation
- [ ] Reports and dashboards set up
- [ ] API key created for backend integration (if needed)

---

## 🔍 Verification Steps

After configuration, verify everything works:

1. **Test Page Views**:
   - Navigate your site
   - Check Events Manager → Test Events
   - Should see `page_view` events

2. **Test Contact Creation**:
   - Register a new user
   - Check Contacts in HubSpot
   - Verify all custom properties are populated

3. **Test E-commerce Events**:
   - View a product → `view_content`
   - Add to cart → `add_to_cart`
   - Go to checkout → `begin_checkout`
   - Complete order → `purchase`

4. **Test Custom Events**:
   - Click CTA buttons → `cta_click`
   - Submit goal form → `goal_form`
   - View product category → `view_category`

---

## 📚 Additional Resources

- [HubSpot Events Documentation](https://developers.hubspot.com/docs/api/events/tracking-code)
- [HubSpot Custom Properties Guide](https://knowledge.hubspot.com/settings/create-and-edit-properties)
- [HubSpot Workflows Guide](https://knowledge.hubspot.com/workflows/create-workflows)

---

## 🆘 Troubleshooting

### Events Not Appearing:
- Check browser console for errors
- Verify Portal ID is correct
- Check Network tab for HubSpot requests
- Ensure no ad blockers are active

### Properties Not Populating:
- Verify property internal names match exactly
- Check property visibility settings
- Ensure properties are not archived
- Verify `identifyContact()` is being called

### Contacts Not Creating:
- Check backend logs for API errors
- Verify API key has correct scopes
- Check API rate limits
- Ensure email is provided in user object

---

**Need Help?** Check the `HUBSPOT_TESTING_GUIDE.md` for detailed testing instructions.

