# Fix: ERR_NAME_NOT_RESOLVED Error

## 🔍 What This Error Means

`ERR_NAME_NOT_RESOLVED` means the browser **cannot resolve the hostname** in your API URL. This happens when:

1. ❌ The API URL is set to an invalid hostname (doesn't exist)
2. ❌ The backend server is not running
3. ❌ There's a typo in the `VITE_API_URL` environment variable
4. ❌ The URL is pointing to a domain that doesn't exist

---

## ✅ Quick Fix Steps

### Step 1: Check What API URL is Being Used

1. **Open browser console** (F12)
2. **Look for:** `API URL: ...` message
3. **Note the URL** - This is what your frontend is trying to connect to

**Expected:** `http://localhost:5000/api`  
**If different:** That's your problem!

---

### Step 2: Verify Backend is Running

1. **Check backend terminal/console**
2. **Look for:** Server running message
3. **Should see:** `Server running on port 5000` (or your port)

**If backend is not running:**
```bash
# Navigate to backend directory
cd backend

# Start the server
npm start
# OR
npm run dev
```

---

### Step 3: Check Frontend `.env` File

1. **Navigate to:** `frontend/.env`
2. **Check `VITE_API_URL` value**

**Correct format:**
```env
VITE_API_URL=http://localhost:5000/api
```

**Common mistakes:**
```env
# ❌ WRONG - Missing http://
VITE_API_URL=localhost:5000/api

# ❌ WRONG - Invalid hostname
VITE_API_URL=http://invalid-hostname.com/api

# ❌ WRONG - Wrong port
VITE_API_URL=http://localhost:3000/api

# ✅ CORRECT
VITE_API_URL=http://localhost:5000/api
```

---

### Step 4: Create/Update `.env` File

**If `.env` doesn't exist:**

1. **Create file:** `frontend/.env`
2. **Add this line:**
```env
VITE_API_URL=http://localhost:5000/api
```

3. **Restart frontend dev server:**
   - Stop the server (Ctrl+C)
   - Start again: `npm run dev`

**Important:** Vite requires server restart to pick up new environment variables!

---

### Step 5: Verify Backend Port

**Check what port your backend is running on:**

1. **Look at backend console** when starting
2. **Should see:** `Server running on port 5000`
3. **If different port:** Update `VITE_API_URL` to match

**Example if backend is on port 3000:**
```env
VITE_API_URL=http://localhost:3000/api
```

---

## 🔧 Detailed Troubleshooting

### Issue 1: `.env` File Doesn't Exist

**Solution:**
1. Create `frontend/.env` file
2. Add: `VITE_API_URL=http://localhost:5000/api`
3. Restart frontend server

---

### Issue 2: `.env` File Has Wrong URL

**Solution:**
1. Open `frontend/.env`
2. Check `VITE_API_URL` value
3. Fix if wrong
4. Restart frontend server

---

### Issue 3: Backend Not Running

**Solution:**
1. Navigate to `backend/` directory
2. Start backend:
```bash
npm start
# OR
npm run dev
```

3. Wait for: `Server running on port 5000`
4. Try uploading document again

---

### Issue 4: Wrong Port in API URL

**Solution:**
1. Check backend console for actual port
2. Update `frontend/.env`:
```env
VITE_API_URL=http://localhost:[ACTUAL_PORT]/api
```

3. Restart frontend server

---

### Issue 5: Environment Variable Not Loading

**Solution:**
1. **Restart frontend server** (Vite requires restart for env changes)
2. **Check browser console** for `API URL: ...` message
3. **Verify** it shows the correct URL

---

## 📋 Step-by-Step Fix Checklist

Follow these steps in order:

- [ ] **Step 1:** Check browser console for `API URL: ...` message
- [ ] **Step 2:** Verify backend server is running
- [ ] **Step 3:** Check if `frontend/.env` file exists
- [ ] **Step 4:** Verify `VITE_API_URL` in `.env` file
- [ ] **Step 5:** Ensure URL format is correct: `http://localhost:5000/api`
- [ ] **Step 6:** Restart frontend dev server
- [ ] **Step 7:** Try uploading document again
- [ ] **Step 8:** Check browser console for new errors

---

## 🎯 Common Scenarios

### Scenario 1: First Time Setup

**Problem:** No `.env` file exists

**Solution:**
1. Create `frontend/.env`
2. Add: `VITE_API_URL=http://localhost:5000/api`
3. Restart frontend server

---

### Scenario 2: Backend Changed Port

**Problem:** Backend is on different port (e.g., 3000)

**Solution:**
1. Update `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000/api
```
2. Restart frontend server

---

### Scenario 3: Production/Staging URL

**Problem:** Using production/staging URL that doesn't exist

**Solution:**
1. Check `frontend/.env` for production URL
2. Verify the URL is correct and accessible
3. If testing locally, use: `http://localhost:5000/api`

---

### Scenario 4: Typo in URL

**Problem:** URL has typo (e.g., `loclahost` instead of `localhost`)

**Solution:**
1. Check `frontend/.env` carefully
2. Fix typo
3. Restart frontend server

---

## ✅ Verification Steps

After fixing, verify it works:

1. **Check browser console:**
   - Should see: `API URL: http://localhost:5000/api`
   - Should NOT see: `ERR_NAME_NOT_RESOLVED`

2. **Try uploading document:**
   - Should NOT see: "Error sending document"
   - Should see: Success message

3. **Check Network tab:**
   - Request should go to: `http://localhost:5000/api/users/documents/...`
   - Status should be: `200` (success) or `401` (auth issue, not URL issue)

---

## 🚨 Still Not Working?

If you've tried everything and still get the error:

1. **Share the exact API URL** from browser console
2. **Share your `frontend/.env` file** (remove sensitive data)
3. **Share backend console output** (is server running?)
4. **Share browser console errors** (full error message)

---

## 💡 Pro Tips

1. **Always check browser console first** - It shows the actual URL being used
2. **Restart frontend after changing `.env`** - Vite needs restart
3. **Verify backend is running** - Can't connect if it's not running
4. **Use `localhost` not `127.0.0.1`** - More reliable
5. **Check for typos** - One character wrong breaks everything

---

## 📝 Quick Reference

**Default API URL:** `http://localhost:5000/api`

**File to create/edit:** `frontend/.env`

**Content:**
```env
VITE_API_URL=http://localhost:5000/api
```

**After changing:** Restart frontend server!

