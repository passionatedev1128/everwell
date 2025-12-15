# How to Mark "purchase" as Conversion in GA4

## 🔍 Why You Can't Find "purchase"

**The event must be triggered at least once before it appears in the Events list.**

If you haven't completed a purchase yet, the event won't show up. Here's how to fix this:

---

## ✅ Solution 1: Trigger the Event First (Recommended)

### Step 1: Complete a Test Purchase

1. **Go to your website**
2. **Add a product to cart**
3. **Go to checkout**
4. **Complete a test purchase** (use test data)

**Important:** The purchase must actually complete successfully for the event to fire.

---

### Step 2: Verify Event is Being Sent

1. **Open browser console** (F12 → Console tab)
2. **Complete the purchase**
3. **Look for:** `GA4: Event tracked { eventName: 'purchase', ... }`

**If you see this:** ✅ Event is being sent!

**If you don't see this:** The purchase might not be completing successfully.

---

### Step 3: Check DebugView (Best Method)

1. **Go to GA4:**
   - Click **Admin** → **DebugView** (under Property column)
   - OR: **Configure** → **DebugView**

2. **Complete a purchase** on your website

3. **Watch DebugView:**
   - You should see `purchase` event appear within seconds
   - Click on it to see all details

**If you see it in DebugView:** ✅ Event is working! Now wait for it to appear in Events list.

---

### Step 4: Wait for Event to Appear in Events List

**After triggering the event:**

1. **Go to GA4:**
   - Click **Admin** → **Events**
   - OR: **Configure** → **Events**

2. **Wait 24-48 hours** for the event to appear in the list

3. **OR check Realtime:**
   - Go to **Reports** → **Realtime**
   - Look for `purchase` in "Event count by Event name"
   - If you see it here, it's working (just needs time to appear in Events list)

---

## ✅ Solution 2: Create Event Manually (If Needed)

If the event still doesn't appear after 48 hours, you can create it manually:

### Step 1: Go to Events

1. **Go to GA4:**
   - Click **Admin** → **Events**
   - OR: **Configure** → **Events**

2. **Click "Create event"** button (top right)

---

### Step 2: Configure the Event

1. **Event name:** `purchase`
2. **Matching conditions:** Leave empty (or add if you want)
3. **Parameters:** Leave default
4. **Click "Create"**

**Note:** This creates the event definition. The actual event data will appear once purchases are made.

---

### Step 3: Mark as Conversion

1. **Find `purchase` in the Events list**
2. **Toggle "Mark as conversion"** ON
3. **Click Save** if prompted

---

## ✅ Solution 3: Mark via Realtime (Quick Method)

If you see the event in Realtime but not in Events list:

1. **Go to Realtime:**
   - **Reports** → **Realtime**

2. **Find `purchase`** in "Event count by Event name"

3. **Click on it** to see details

4. **Note:** You can't mark as conversion from Realtime, but this confirms it's working

5. **Wait for it to appear in Events list** (24-48 hours), then mark as conversion

---

## 🔍 Troubleshooting: Event Not Firing

### Check 1: Verify Code is Correct

**Check:** `frontend/src/pages/Checkout.jsx`

**Should have:**
```javascript
import { trackPurchase } from '../utils/analytics';

// After successful order
trackPurchase(order);
```

**If missing:** Add it after order creation.

---

### Check 2: Verify Purchase Completes Successfully

1. **Complete a purchase**
2. **Check if you see success message:** "Pedido criado com sucesso!"
3. **If you see error:** Purchase didn't complete, so event won't fire

---

### Check 3: Check Browser Console

1. **Open console** (F12)
2. **Complete purchase**
3. **Look for errors:**
   - `GA4: Event tracked` → ✅ Working
   - `Error: ...` → ❌ Problem

---

### Check 4: Check Network Tab

1. **Open DevTools** (F12) → **Network** tab
2. **Filter for:** `collect`
3. **Complete purchase**
4. **Look for requests to:** `google-analytics.com/g/collect`
5. **Click on request** → **Payload** tab
6. **Search for:** `en=purchase`

**If you see it:** ✅ Event is being sent!

---

## 📋 Quick Test Checklist

Use this to verify everything:

- [ ] **Complete a test purchase** on your website
- [ ] **Check browser console** for `GA4: Event tracked { eventName: 'purchase' }`
- [ ] **Check DebugView** - should see `purchase` event
- [ ] **Check Realtime** - should see `purchase` in events list
- [ ] **Wait 24-48 hours** for Events list
- [ ] **Mark as conversion** once it appears

---

## 🎯 Alternative: Use E-commerce Reports

Even if you can't mark it in Events list yet, you can still see purchase data:

1. **Go to GA4:**
   - **Reports** → **Monetization** → **E-commerce purchases**

2. **This shows:**
   - Purchase events
   - Revenue
   - Items sold
   - Average order value

**If you see data here:** ✅ Purchases are being tracked! Just need to wait for Events list.

---

## 💡 Pro Tips

1. **Use DebugView first** - Most reliable way to see if event is working
2. **Complete actual purchase** - Event only fires on successful purchase
3. **Wait 24-48 hours** - Events list takes time to populate
4. **Check Realtime** - Shows events immediately (but can't mark as conversion)
5. **Use E-commerce reports** - Shows purchase data even if Events list is empty

---

## 🚨 Still Can't Find It?

If you've tried everything and still can't find `purchase`:

1. **Share what you see:**
   - Do you see `GA4: Event tracked` in console?
   - Do you see it in DebugView?
   - Do you see it in Realtime?
   - Do you see it in E-commerce reports?

2. **Check the code:**
   - Is `trackPurchase()` being called?
   - Is the purchase actually completing?

3. **Test with a real purchase:**
   - Sometimes test purchases don't trigger events properly

---

## ✅ Success Criteria

You'll know it's working when:

1. ✅ You see `purchase` in DebugView after completing purchase
2. ✅ You see `purchase` in Realtime reports
3. ✅ You see purchase data in E-commerce reports
4. ✅ After 24-48 hours, `purchase` appears in Events list
5. ✅ You can toggle "Mark as conversion" ON

---

**Remember:** The event must be triggered at least once before it appears in the Events list. Complete a test purchase first, then check DebugView to verify it's working!

