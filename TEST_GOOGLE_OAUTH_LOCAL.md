# Testing Google OAuth Locally - Step by Step Guide

## 🎯 Quick Test Checklist

- [ ] Google OAuth credentials created
- [ ] Backend `.env` configured
- [ ] Backend server running
- [ ] Frontend server running
- [ ] OAuth flow tested

---

## Step 1: Create Google OAuth Credentials (If Not Done)

### 1.1 Go to Google Cloud Console

1. Open: https://console.cloud.google.com/
2. Select your project (or create a new one)

### 1.2 Enable Required APIs

1. Go to **APIs & Services** > **Library**
2. Search for **"People API"** or **"Google+ API"**
3. Click **Enable**

### 1.3 Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Select **External** (unless you have Google Workspace)
3. Fill in:
   - **App name**: EverWell
   - **User support email**: Your email
   - **Developer contact**: Your email
4. Click **Save and Continue**
5. On **Scopes** page:
   - Click **Add or Remove Scopes**
   - Add: `email`, `profile`, `openid`
   - Click **Update** then **Save and Continue**
6. On **Test users** page:
   - Click **Add Users**
   - Add **your own email address** (for testing)
   - Click **Save and Continue**
7. Review and go back to dashboard

### 1.4 Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Select **Web application**
4. Fill in:
   - **Name**: EverWell Local Dev
   - **Authorized JavaScript origins**:
     ```
     http://localhost:5000
     http://localhost:5173
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:5000/api/auth/google/callback
     ```
5. Click **Create**
6. **IMPORTANT**: Copy the **Client ID** and **Client Secret**

---

## Step 2: Configure Backend Environment

### 2.1 Open Backend `.env` File

Navigate to: `backend/.env`

### 2.2 Add Google OAuth Credentials

Add these lines to your `backend/.env`:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Session Secret (can use same as JWT_SECRET)
SESSION_SECRET=your-session-secret-here

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Example:**
```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
SESSION_SECRET=your-super-secret-key-change-this
FRONTEND_URL=http://localhost:5173
```

### 2.3 Verify Configuration

Make sure you have these in `.env`:
- ✅ `GOOGLE_CLIENT_ID` (starts with numbers, ends with `.apps.googleusercontent.com`)
- ✅ `GOOGLE_CLIENT_SECRET` (starts with `GOCSPX-`)
- ✅ `GOOGLE_CALLBACK_URL` (exactly: `http://localhost:5000/api/auth/google/callback`)
- ✅ `FRONTEND_URL` (exactly: `http://localhost:5173`)
- ✅ `SESSION_SECRET` (any secret string)

---

## Step 3: Start Servers

### 3.1 Start Backend Server

Open **Terminal 1**:

```bash
cd backend
npm run dev
```

**Expected output:**
```
🚀 Server running on port 5000
📡 Environment: development
✅ MongoDB Connected: ...
```

**Check for:**
- ✅ No errors about missing GOOGLE_CLIENT_ID
- ✅ Server listening on port 5000
- ✅ MongoDB connected

### 3.2 Start Frontend Server

Open **Terminal 2**:

```bash
cd frontend
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Check for:**
- ✅ Frontend running on `http://localhost:5173`
- ✅ No build errors

---

## Step 4: Test OAuth Flow

### 4.1 Open Login Page

1. Open browser: `http://localhost:5173/login`
2. You should see:
   - Email/password form
   - **"Continuar com Google"** button (below the form)

### 4.2 Click Google OAuth Button

1. Click **"Continuar com Google"** button
2. **Expected**: Browser redirects to Google login page

### 4.3 Authenticate with Google

1. Select your Google account (the one you added as test user)
2. Review permissions (email, profile)
3. Click **"Allow"** or **"Continue"**

### 4.4 Verify Redirect Back

**Expected flow:**
1. Google redirects to: `http://localhost:5000/api/auth/google/callback`
2. Backend processes authentication
3. Backend redirects to: `http://localhost:5173/auth/callback?token=...&success=true`
4. Frontend stores token
5. You're logged in and redirected to home page

---

## Step 5: Verify Success

### 5.1 Check You're Logged In

- ✅ Header shows your name/email (not "Login")
- ✅ You can access protected pages
- ✅ Cart icon is visible
- ✅ Dashboard link is visible

### 5.2 Check Backend Console

Look for:
- ✅ No errors
- ✅ User created/found message (if new user)
- ✅ Token generated successfully

### 5.3 Check Browser Console

Open browser DevTools (F12) > Console:
- ✅ No errors
- ✅ Token stored in localStorage
- ✅ User data stored

---

## Step 6: Test User Creation

### 6.1 Test New User

1. Logout (if logged in)
2. Use a **different Google account** (if you have one)
3. Click "Continuar com Google"
4. Authenticate with the new account
5. **Expected**: New user account created automatically

### 6.2 Test Existing User

1. Logout
2. Use the **same Google account** again
3. Click "Continuar com Google"
4. **Expected**: You're logged in (no new account created)

---

## 🐛 Troubleshooting

### Issue: "Cannot GET /api/auth/google"

**Solution:**
1. Check backend server is running
2. Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`
3. Restart backend server after adding credentials
4. Check backend console for errors

### Issue: "redirect_uri_mismatch"

**Solution:**
1. Go to Google Cloud Console > Credentials
2. Edit your OAuth 2.0 Client ID
3. Make sure **Authorized redirect URIs** includes:
   ```
   http://localhost:5000/api/auth/google/callback
   ```
4. **Important**: No trailing slash, exact match
5. Save and try again

### Issue: "access_denied"

**Solution:**
1. Go to OAuth consent screen
2. Make sure your email is in **Test users** list
3. Or publish your app (see below)

### Issue: Button doesn't redirect

**Solution:**
1. Check browser console for errors
2. Check `VITE_API_URL` in frontend (should be `http://localhost:5000/api`)
3. Verify backend is running on port 5000
4. Check network tab - what URL is being called?

### Issue: Stuck on Google login page

**Solution:**
1. Make sure you're using a test user email
2. Check OAuth consent screen is configured
3. Try clearing browser cache
4. Check backend console for errors

---

## 🔍 Debug Checklist

### Backend Checks

```bash
# Check if credentials are loaded
cd backend
node -e "require('dotenv').config(); console.log('CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'SET ✅' : 'NOT SET ❌');"
```

### Frontend Checks

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Click "Continuar com Google"
4. Check what request is made
5. Check response/redirect

### Google Console Checks

1. Go to Google Cloud Console
2. Check **APIs & Services** > **Credentials**
3. Verify OAuth 2.0 Client ID exists
4. Check redirect URIs match exactly
5. Check OAuth consent screen is configured

---

## ✅ Success Indicators

You'll know it's working when:

- ✅ Clicking button redirects to Google
- ✅ Google login page appears
- ✅ After login, you're redirected back
- ✅ You're automatically logged in
- ✅ User account created in database
- ✅ Token stored in localStorage
- ✅ Can access protected pages

---

## 📝 Test Scenarios

### Scenario 1: First Time User
1. Use Google account that's never logged in
2. **Expected**: New user created, logged in, email verified

### Scenario 2: Returning User
1. Use Google account that already logged in before
2. **Expected**: Logged in immediately, no new account

### Scenario 3: Email Already Exists
1. Create account with email/password first
2. Then use Google OAuth with same email
3. **Expected**: Accounts linked, can login with either method

### Scenario 4: Multiple Devices
1. Login on one browser
2. Try on different browser/device
3. **Expected**: Works on both (separate sessions)

---

## 🚀 Quick Test Commands

### Test Backend Route

```bash
# Test if route exists (should redirect to Google)
curl -L http://localhost:5000/api/auth/google
```

### Check Environment Variables

```bash
cd backend
node -e "require('dotenv').config(); console.log('CLIENT_ID:', process.env.GOOGLE_CLIENT_ID); console.log('CALLBACK:', process.env.GOOGLE_CALLBACK_URL);"
```

---

## 📞 Need Help?

If something doesn't work:

1. **Check backend console** - Look for errors
2. **Check browser console** - Look for JavaScript errors
3. **Check network tab** - See what requests are made
4. **Verify .env file** - Make sure all variables are set
5. **Restart servers** - Sometimes fixes issues

**Common fixes:**
- Restart backend after changing `.env`
- Clear browser cache
- Check redirect URI matches exactly
- Verify test user is added in Google Console

---

## 🎉 Once It Works

After successful test:
1. ✅ OAuth is working locally
2. ✅ Ready for production setup
3. ✅ Can publish app in Google Console (to work for everyone)
4. ✅ Can move to next features

**Next steps:**
- Publish app in Google Console (remove test user restriction)
- Test with production URLs
- Add more OAuth providers (optional)

---

Good luck testing! 🚀

