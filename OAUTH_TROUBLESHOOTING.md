# OAuth Troubleshooting Guide

## Error: "Cannot GET /api/auth/google"

This error typically occurs when:

### 1. Google OAuth Credentials Not Configured

**Solution:**
- Add Google OAuth credentials to `backend/.env`:
  ```env
  GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
  GOOGLE_CLIENT_SECRET=your-client-secret
  GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
  FRONTEND_URL=http://localhost:5173
  ```

### 2. Backend Server Not Running

**Solution:**
- Make sure the backend server is running:
  ```bash
  cd backend
  npm run dev
  ```
- Check that the server is listening on port 5000 (or your configured port)

### 3. Route Not Registered

**Solution:**
- Restart the backend server after adding OAuth routes
- Check backend console for any errors during startup
- Verify that `backend/routes/auth.js` includes the OAuth routes

### 4. Passport Strategy Not Initialized

**Solution:**
- Check backend console for warning: "⚠️ Google OAuth not configured"
- Make sure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in `.env`
- Restart the server after adding credentials

### 5. Incorrect Callback URL

**Solution:**
- The callback URL in Google Console must match exactly:
  - Development: `http://localhost:5000/api/auth/google/callback`
  - Production: `https://your-domain.com/api/auth/google/callback`
- Check for trailing slashes or http vs https mismatches

---

## Quick Fix Checklist

- [ ] Backend server is running (`npm run dev` in backend folder)
- [ ] `GOOGLE_CLIENT_ID` is set in `backend/.env`
- [ ] `GOOGLE_CLIENT_SECRET` is set in `backend/.env`
- [ ] `GOOGLE_CALLBACK_URL` matches Google Console settings
- [ ] Backend server was restarted after adding credentials
- [ ] No errors in backend console
- [ ] Frontend is pointing to correct backend URL

---

## Testing the Route

### Test 1: Check if route exists

Open in browser or use curl:
```bash
curl http://localhost:5000/api/auth/google
```

**Expected:**
- If configured: Redirects to Google OAuth page
- If not configured: Returns JSON error message

### Test 2: Check backend logs

Look for:
- ✅ "🚀 Server running on port 5000"
- ✅ No passport initialization errors
- ⚠️ "Google OAuth not configured" (if credentials missing)

### Test 3: Verify environment variables

```bash
cd backend
node -e "require('dotenv').config(); console.log('CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET');"
```

---

## Common Issues

### Issue: Route returns 404

**Cause:** Route not registered or server not running

**Fix:**
1. Restart backend server
2. Check `backend/server.js` includes `app.use('/api/auth', authRoutes)`
3. Verify `backend/routes/auth.js` exports the router

### Issue: "Passport strategy not found"

**Cause:** Passport strategy not initialized

**Fix:**
1. Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to `.env`
2. Restart server
3. Check backend console for initialization message

### Issue: Redirect loop or wrong redirect

**Cause:** Callback URL mismatch

**Fix:**
1. Check `GOOGLE_CALLBACK_URL` in `.env`
2. Verify it matches Google Console settings exactly
3. Include full URL: `http://localhost:5000/api/auth/google/callback`

---

## Still Not Working?

1. **Check browser console** for frontend errors
2. **Check backend console** for server errors
3. **Verify network tab** - see what URL is being called
4. **Test backend directly** - try accessing `/api/auth/google` in browser
5. **Check Google Console** - verify OAuth credentials are correct

---

## Need Help?

If the issue persists:
1. Share backend console output
2. Share browser console errors
3. Verify all environment variables are set
4. Check that Google OAuth is properly configured in Google Cloud Console

