# Debug: document_upload Not Showing in GA4 Realtime

## 🔍 Step-by-Step Debugging

### Step 1: Verify Event is Being Triggered

**Check if the upload actually succeeds:**

1. **Try uploading a document** on your website
2. **Check browser console** (F12 → Console tab)
3. **Look for these messages:**

**If upload succeeds, you should see:**
```
GA4: Event tracked { eventName: 'document_upload', eventParams: {...} }
```

**If you DON'T see this message:**
- The upload might be failing
- The tracking code might not be reached
- Check for errors in console

---

### Step 2: Check if Upload is Successful

**The event only fires AFTER successful upload:**

1. **Upload a document**
2. **Check if you see success message:** "Documento enviado com sucesso!"
3. **If you see error instead:** The upload failed, so event won't fire

**Common upload failures:**
- Backend not running
- Authentication expired
- File type/size validation failed
- Network error

---

### Step 3: Verify GA4 is Initialized

**Check if GA4 is loaded:**

1. **Open browser console** (F12)
2. **Type this command:**
```javascript
window.gtag
```

**Expected result:**
- Should return a function (not `undefined`)
- If `undefined`, GA4 is not initialized

**If GA4 not initialized:**
- Check `VITE_GA4_MEASUREMENT_ID` in `.env`
- Check if GA4 script is loading in Network tab
- Check `main.jsx` for GA4 initialization

---

### Step 4: Check Network Tab for GA4 Requests

**Verify events are being sent to GA4:**

1. **Open DevTools** (F12)
2. **Go to Network tab**
3. **Filter for:** `collect` or `google-analytics`
4. **Upload a document**
5. **Look for requests to:** `google-analytics.com/g/collect`

**What to check:**
- **Request exists?** → Event is being sent
- **Request payload:** Click on request → Payload tab → Look for `en=document_upload`
- **Status:** Should be 200 (success)

**If no requests:**
- GA4 not initialized
- Event not being triggered
- Network blocked

---

### Step 5: Use GA4 DebugView (Best Method)

**DebugView shows events in real-time with all details:**

1. **Install GA4 Debugger Extension:**
   - Chrome: https://chrome.google.com/webstore/detail/google-analytics-debugger
   - Or: Your code already enables debug mode in development

2. **Enable Debug Mode:**
   - Click the extension icon to enable
   - OR: Your code should auto-enable in development

3. **Open GA4 DebugView:**
   - Go to GA4 → **Admin** → **DebugView**
   - OR: **Configure** → **DebugView**

4. **Upload a document**

5. **Check DebugView:**
   - Should see `document_upload` event appear
   - Click on it to see all parameters

**If you see it in DebugView but not Realtime:**
- Realtime can be delayed
- DebugView is more reliable for testing

---

### Step 6: Check Event Name Spelling

**Verify the exact event name:**

1. **Check code:** `frontend/src/utils/analytics.js` line 200
2. **Event name should be:** `document_upload` (with underscore, lowercase)
3. **In GA4 Realtime:** Search for `document_upload` (exact spelling)

**Common mistakes:**
- `documentUpload` (camelCase) ❌
- `document upload` (space) ❌
- `Document_Upload` (capital letters) ❌
- `document_upload` (correct) ✅

---

### Step 7: Verify Measurement ID

**Check if correct GA4 property is being used:**

1. **Check `.env` file:**
```env
VITE_GA4_MEASUREMENT_ID=G-05TH31T6CK
```

2. **Check browser console:**
   - Should see: `GA4: Initialized with measurement ID G-05TH31T6CK`

3. **Verify in GA4:**
   - Go to **Admin** → **Data Streams**
   - Check Measurement ID matches: `G-05TH31T6CK`

---

## 🎯 Quick Test Checklist

Use this checklist to verify everything:

- [ ] **Upload a document** (actually trigger the upload)
- [ ] **Check upload succeeds** (see success message)
- [ ] **Check browser console** for `GA4: Event tracked`
- [ ] **Check Network tab** for `collect` requests
- [ ] **Check DebugView** (most reliable)
- [ ] **Wait 30 seconds** (Realtime can be delayed)
- [ ] **Refresh Realtime page** (sometimes needs refresh)
- [ ] **Check event name spelling** (exact: `document_upload`)

---

## 🚨 Common Issues and Solutions

### Issue 1: Event Not Firing Because Upload Fails

**Symptom:** No `GA4: Event tracked` message in console

**Solution:**
- Fix the upload issue first
- Event only fires after successful upload
- Check backend is running
- Check authentication

---

### Issue 2: GA4 Not Initialized

**Symptom:** `window.gtag` is `undefined`

**Solution:**
1. Check `VITE_GA4_MEASUREMENT_ID` in `.env`
2. Check `main.jsx` initializes GA4
3. Restart frontend dev server
4. Check browser console for GA4 errors

---

### Issue 3: Event Sent But Not Showing in Realtime

**Symptom:** See `GA4: Event tracked` but not in Realtime

**Possible causes:**
- Realtime can take 30-60 seconds to update
- Wrong GA4 property (check Measurement ID)
- Event filtered out
- Browser/network blocking GA4

**Solution:**
- Use **DebugView** instead (more reliable)
- Wait 1-2 minutes
- Refresh Realtime page
- Check you're looking at correct GA4 property

---

### Issue 4: Wrong Event Name

**Symptom:** Looking for wrong name

**Solution:**
- Event name is: `document_upload` (lowercase, underscore)
- Search exactly: `document_upload`
- Check spelling in code matches

---

## ✅ Step-by-Step Test (Do This Now)

**Test right now:**

1. **Open browser console** (F12 → Console)
2. **Open GA4 DebugView** (Admin → DebugView)
3. **Upload a document** on your website
4. **Check console** for: `GA4: Event tracked { eventName: 'document_upload' ... }`
5. **Check DebugView** - should see event appear within seconds
6. **If you see it in DebugView:** ✅ It's working! (Realtime just delayed)
7. **If you DON'T see it:** Check console for errors

---

## 📊 What to Look For

### In Browser Console:
```javascript
// Good - Event is being sent
GA4: Event tracked { eventName: 'document_upload', eventParams: { document_type: 'medicalPrescription' } }

// Bad - No event
(no message)
```

### In Network Tab:
```
Request URL: https://www.google-analytics.com/g/collect?...
Payload: en=document_upload&ep.document_type=medicalPrescription&...
Status: 200
```

### In DebugView:
```
Event: document_upload
Parameters:
  - document_type: medicalPrescription
```

---

## 💡 Pro Tips

1. **Use DebugView for testing** - More reliable than Realtime
2. **Check console first** - See if event is actually being sent
3. **Verify upload succeeds** - Event only fires after success
4. **Wait a bit** - Realtime can take 30-60 seconds
5. **Check exact spelling** - `document_upload` (lowercase, underscore)

---

## 🎯 Most Likely Causes

Based on your issue, most likely:

1. **Upload not succeeding** → Event never fires
2. **GA4 not initialized** → Events not being sent
3. **Realtime delay** → Event sent but not showing yet (use DebugView)
4. **Wrong GA4 property** → Looking at wrong property

**Try DebugView first** - it's the most reliable way to see if events are working!

---

**Share what you see:**
- Do you see `GA4: Event tracked` in console?
- Do you see requests in Network tab?
- What happens when you check DebugView?

This will help identify the exact issue! 🔍

