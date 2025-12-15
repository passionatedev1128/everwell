# Frontend Setup & Troubleshooting Guide

## 🚀 Quick Start

### Step 1: Navigate to Frontend Directory
```powershell
cd frontend
```

### Step 2: Install Dependencies (if not already installed)
```powershell
npm install
```

### Step 3: Start Development Server
```powershell
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 4: Open Browser
Open: http://localhost:5173

---

## ❌ Common Issues

### Issue 1: "Cannot GET /" or Blank Page

**Cause:** Frontend dev server is not running

**Solution:**
1. Make sure you're in the `frontend` directory
2. Run `npm run dev`
3. Wait for "ready" message
4. Open http://localhost:5173

---

### Issue 2: "Port 5173 is already in use"

**Cause:** Another process is using port 5173

**Solutions:**

**Option A: Kill the process using port 5173**
```powershell
# Find process using port 5173
netstat -ano | findstr :5173

# Kill the process (replace PID with the number from above)
taskkill /PID <PID> /F
```

**Option B: Change the port**
Edit `frontend/vite.config.js`:
```javascript
server: {
  port: 5174,  // Change to different port
}
```

Then access: http://localhost:5174

---

### Issue 3: "Module not found" or Build Errors

**Cause:** Dependencies not installed or corrupted

**Solution:**
```powershell
cd frontend
rm -r node_modules  # Remove node_modules
rm package-lock.json  # Remove lock file
npm install  # Reinstall dependencies
npm run dev  # Start again
```

---

### Issue 4: "Cannot connect to backend API"

**Cause:** Backend server is not running

**Solution:**
1. Make sure backend is running on http://localhost:5000
2. Check `backend/.env` has correct configuration
3. Start backend: `cd backend && npm start`
4. Then start frontend: `cd frontend && npm run dev`

---

### Issue 5: Blank/White Screen

**Possible Causes:**
1. JavaScript errors in browser console
2. Missing dependencies
3. React app not rendering

**Solution:**
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Try:
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

---

## 🔧 Development Setup

### Running Both Servers

**Terminal 1 - Backend:**
```powershell
cd backend
npm start
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

### Environment Variables (Optional)

Create `frontend/.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📋 Checklist

- [ ] Node.js installed (v18+)
- [ ] Dependencies installed (`npm install` in frontend)
- [ ] Backend server running on port 5000
- [ ] Frontend dev server running on port 5173
- [ ] Browser opened to http://localhost:5173
- [ ] No errors in browser console
- [ ] No errors in terminal

---

## 🐛 Debug Steps

1. **Check if server is running:**
   ```powershell
   # Check if port 5173 is in use
   netstat -ano | findstr :5173
   ```

2. **Check browser console:**
   - Open DevTools (F12)
   - Check Console for errors
   - Check Network for failed requests

3. **Check terminal output:**
   - Look for error messages
   - Check if Vite started successfully

4. **Clear browser cache:**
   - Hard refresh: Ctrl + Shift + R
   - Or clear cache in browser settings

5. **Reinstall dependencies:**
   ```powershell
   cd frontend
   rm -r node_modules
   npm install
   ```

---

## ✅ Success Indicators

When everything is working, you should see:

1. **Terminal:**
   ```
   VITE v5.0.8  ready in XXX ms
   ➜  Local:   http://localhost:5173/
   ```

2. **Browser:**
   - EverWell homepage loads
   - No console errors
   - Navigation works
   - Pages render correctly

---

**Need help?** Check the browser console (F12) for specific error messages!

