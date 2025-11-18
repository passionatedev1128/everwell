# How to Set Up `document_upload` Event in GA4 - Step by Step

## ✅ Good News: Event is Already Tracked!

Your code already tracks `document_upload` events! The function is in:
- **File**: `frontend/src/utils/analytics.js` (line 199-203)
- **Called from**: `frontend/src/components/DocumentUpload.jsx`

**In GA4, you don't "create" events - they appear automatically when your code sends them.**

However, you need to:
1. ✅ Verify the event exists in GA4
2. ✅ Mark it as conversion (optional but recommended)
3. ✅ Create custom dimension for `document_type` (optional but useful)
4. ✅ View it in reports

---

## 📋 Step-by-Step Guide

### Step 1: Verify the Event Exists in GA4

#### Method 1: Check in Realtime Report (Fastest)

1. **Open Google Analytics 4**
   - Go to [analytics.google.com](https://analytics.google.com)
   - Select your property

2. **Go to Realtime Report**
   - Click **Reports** (left sidebar)
   - Click **Realtime**

3. **Test the Event**
   - Open your website in another tab
   - Upload a document (trigger the document upload)
   - Come back to GA4 Realtime
   - Scroll down to **"Event count by Event name"**
   - Look for **`document_upload`** in the list

4. **If you see it:** ✅ Event is working!
5. **If you don't see it:** Check browser console for errors

---

#### Method 2: Check in Events List (After 24-48 Hours)

1. **Navigate to Events**
   - Click **Admin** (⚙️ icon, bottom left)
   - Under **Property** column, click **Events**
   - OR: Click **Configure** (left sidebar) → **Events**

2. **Search for the Event**
   - In the events list, look for **`document_upload`**
   - Use the search box at the top to filter
   - Type: `document_upload`

3. **What You Should See:**
   - Event name: `document_upload`
   - Event count: Number of times it's been triggered
   - Status: Either "Marked as conversion" or not marked yet

**Note:** Events may take 24-48 hours to appear in the Events list. Use Realtime for immediate verification.

---

#### Method 3: Check in DebugView (Most Detailed)

1. **Enable Debug Mode**
   - Install [GA4 Debugger Chrome Extension](https://chrome.google.com/webstore/detail/google-analytics-debugger)
   - OR: Your code already enables debug mode in development

2. **Open DebugView**
   - Go to **Admin** → **DebugView** (under Property column)
   - OR: **Configure** → **DebugView**

3. **Test the Event**
   - Visit your website
   - Upload a document
   - You should see `document_upload` appear in real-time
   - Click on it to see all parameters (including `document_type`)

---

### Step 2: Mark `document_upload` as Conversion (Optional but Recommended)

**Why mark it?** Conversions are your business goals. Document uploads might be important milestones.

#### Steps:

1. **Go to Events**
   - Click **Admin** (⚙️ icon, bottom left)
   - Under **Property** column, click **Events**
   - OR: **Configure** → **Events**

2. **Find `document_upload`**
   - Search for `document_upload` in the events list
   - If it doesn't appear yet, wait 24-48 hours OR trigger it and check Realtime

3. **Mark as Conversion**
   - Find the toggle switch next to `document_upload`
   - Toggle it **ON** to mark as conversion
   - Click **Save** if prompted

4. **Verify**
   - Go to **Reports** → **Engagement** → **Conversions**
   - You should see `document_upload` listed (may take a few hours)

**Note:** Only mark as conversion if document uploads are an important business goal for you.

---

### Step 3: Create Custom Dimension for `document_type` (Recommended)

**Why?** This lets you analyze which types of documents are uploaded most (prescription, authorization, etc.)

#### Steps:

1. **Navigate to Custom Definitions**
   - Click **Admin** (⚙️ icon, bottom left)
   - Under **Property** column, click **Custom Definitions**
   - Click **Custom Dimensions**

2. **Create New Dimension**
   - Click **Create custom dimension** button (top right)

3. **Configure the Dimension**
   - **Dimension name:** `Document Type`
   - **Scope:** Select **Event** (since it's sent with events)
   - **Event parameter:** Type `document_type` (exactly as in your code)
   - **Description:** "Type of document uploaded (medicalPrescription, importAuthorization, proofOfResidence)"
   - **Units:** Leave blank (not applicable)

4. **Save**
   - Click **Save** button
   - You'll see a message: "This dimension will start collecting data going forward"

5. **Wait for Data**
   - Custom dimensions take 24-48 hours to start showing data
   - Historical data won't be available (only new data)

---

### Step 4: View `document_upload` in Reports

#### Method 1: View in Events Report

1. **Go to Events Report**
   - Click **Reports** → **Engagement** → **Events**

2. **Find `document_upload`**
   - Scroll through the events list
   - Click on `document_upload` to see details

3. **View Parameters**
   - You'll see event count
   - Click to expand and see `document_type` parameter values

---

#### Method 2: Create Custom Report with Document Type

1. **Go to Explore**
   - Click **Explore** (left sidebar)
   - Click **Blank** (or **Free form**)

2. **Name the Report**
   - Click the report name (top left)
   - Rename to: "Document Upload Analysis"

3. **Add Dimensions**
   - In the left panel, under **Dimensions**, click **+**
   - Search for "Document Type" (your custom dimension)
   - Add it to your report
   - Also add: **Event name**

4. **Add Metrics**
   - Under **Metrics**, click **+**
   - Add: **Event count**
   - Add: **Total users**

5. **Add Filter**
   - Click **Add filter** (top)
   - Filter: **Event name** = `document_upload`
   - Click **Apply**

6. **View Results**
   - You'll see document uploads broken down by document type
   - See which types are most common

7. **Save**
   - Click **Save** (top right)
   - Name: "Document Upload Analysis"

---

#### Method 3: View in Conversions Report (If Marked as Conversion)

1. **Go to Conversions Report**
   - Click **Reports** → **Engagement** → **Conversions**

2. **Find `document_upload`**
   - It should appear in the list if you marked it as conversion
   - See conversion count and rate

---

## 🔍 Verify Event is Being Sent

### Check Browser Console

1. **Open DevTools**
   - Press `F12` or right-click → **Inspect**
   - Go to **Console** tab

2. **Upload a Document**
   - On your website, upload a document
   - Look for console message: `GA4: Event tracked { eventName: 'document_upload', eventParams: {...} }`

3. **Check Network Tab**
   - Go to **Network** tab
   - Filter for: `collect`
   - Upload a document
   - Look for requests to `google-analytics.com/g/collect`
   - Click on a request → **Payload** tab
   - Search for `document_upload` in the data

---

## 📊 What Data Should `document_upload` Include?

When you view the event in GA4, it should show:

**Event Parameters:**
- `document_type`: Type of document (e.g., "medicalPrescription", "importAuthorization", "proofOfResidence")

**Example from your code:**
```javascript
trackDocumentUpload(documentType);
// Sends:
{
  document_type: 'medicalPrescription' // or 'importAuthorization', 'proofOfResidence'
}
```

---

## ✅ Complete Checklist

Use this checklist to verify everything is set up:

- [ ] Event appears in **Realtime** when document is uploaded
- [ ] Event appears in **Events** list (may take 24-48 hours)
- [ ] Event shows correct parameters (`document_type`)
- [ ] Event is marked as **conversion** (if desired)
- [ ] Custom dimension **Document Type** is created
- [ ] Custom dimension shows data in reports (after 24-48 hours)
- [ ] Console shows "GA4: Event tracked" message
- [ ] Network requests show event being sent to GA4

---

## 🚨 Troubleshooting

### Issue: Event doesn't appear in GA4

**Solutions:**
1. **Wait 24-48 hours** - Events take time to appear in standard reports
2. **Check Realtime** - Use Realtime report for immediate verification
3. **Verify code is running** - Check browser console for errors
4. **Check Measurement ID** - Verify `G-05TH31T6CK` is correct
5. **Test in development** - Use DebugView to see events in real-time

### Issue: `document_type` parameter not showing

**Solutions:**
1. **Create custom dimension** - Follow Step 3 above
2. **Wait 24-48 hours** - Custom dimensions take time to populate
3. **Verify parameter name** - Must be exactly `document_type` (case-sensitive)
4. **Check event payload** - Use Network tab to verify parameter is being sent

### Issue: Event count is 0

**Solutions:**
1. **Test the event** - Upload a document and check Realtime
2. **Check if code is called** - Verify `trackDocumentUpload()` is being called
3. **Check browser console** - Look for errors or warnings
4. **Verify user is authenticated** - Some document uploads might require login

---

## 🎯 Quick Test (2 Minutes)

**Test right now:**

1. Open your website
2. Upload a document (or trigger document upload)
3. Open GA4 → **Reports** → **Realtime**
4. Look for `document_upload` in events list
5. If you see it → ✅ It's working!
6. If you don't see it → Check browser console for errors

---

## 📝 Next Steps After Setup

Once `document_upload` is verified:

1. ✅ **Mark as conversion** (if document uploads are important)
2. ✅ **Create custom dimension** for `document_type` (to analyze types)
3. ✅ **Create custom report** to see document types breakdown
4. ✅ **Set up alerts** if document upload rate drops (optional)
5. ✅ **Add to dashboard** if you want it visible on home screen

---

## 💡 Pro Tips

1. **Use Realtime First:** Always check Realtime before waiting for standard reports

2. **Test in Development:** Use DebugView to see all event parameters in detail

3. **Create Custom Dimension Early:** If you want to analyze `document_type`, create the dimension now so it starts collecting data

4. **Mark Important Events:** Only mark as conversion if it's a key business goal

5. **Document Your Events:** Keep a list of all custom events and their purposes

---

**Remember:** In GA4, events are created automatically when your code sends them. You just need to verify they're working and optionally configure them (mark as conversion, create dimensions, etc.).

