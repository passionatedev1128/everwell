# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for the EverWell application.

## Prerequisites

1. Google Cloud Console account
2. Access to Google Cloud Console: https://console.cloud.google.com/

---

## Step 1: Create Google OAuth Credentials

### 1.1 Create a New Project (or use existing)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter project name: **EverWell**
5. Click "Create"

### 1.2 Enable Google+ API

1. In the Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for " " or "People API"
3. Click on it and click **Enable**

### 1.3 Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Select **External** (unless you have Google Workspace)
3. Click **Create**
4. Fill in the required information:
   - **App name**: EverWell
   - **User support email**: Your email
   - **Developer contact information**: Your email
5. Click **Save and Continue**
6. On **Scopes** page, click **Add or Remove Scopes**
   - Add: `email`, `profile`, `openid`
7. Click **Save and Continue**
8. On **Test users** page (for development only):
   - **Important**: This is ONLY for testing during development
   - Click **Add Users** and add your own email for testing
   - **Note**: Once you publish the app (see Step 1.5), anyone can use it without being added here
9. Click **Save and Continue**
10. Review and click **Back to Dashboard**

### 1.4 Publish Your App (IMPORTANT - Makes it work for everyone!)

**⚠️ By default, OAuth apps are in "Testing" mode and only work for test users. To make it work for everyone:**

1. Go back to **OAuth consent screen**
2. You'll see your app status is "Testing"
3. Click **PUBLISH APP** button at the top
4. Confirm the publishing
5. **That's it!** Now anyone can use Google OAuth to sign in, not just test users

**Note**: 
- During development, you can keep it in "Testing" mode and add test users
- For production, you MUST publish the app so all users can authenticate
- Publishing doesn't require Google verification for basic scopes (email, profile)

### 1.4 Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Select **Web application**
4. Fill in:
   - **Name**: EverWell Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:5000` (for development)
     - `http://localhost:5173` (for frontend)
     - Your production backend URL (when deployed)
   - **Authorized redirect URIs**:
     - `http://localhost:5000/api/auth/google/callback` (for development)
     - Your production callback URL (when deployed)
5. Click **Create**
6. **IMPORTANT**: Copy the **Client ID** and **Client Secret**

---

## Step 2: Configure Backend Environment Variables

Add these to your `backend/.env` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
GOOGLE_CALLBACK_URL=/api/auth/google/callback

# Session Secret (for OAuth sessions)
SESSION_SECRET=your-session-secret-here (can be same as JWT_SECRET)

# Frontend URL (for OAuth redirects)
FRONTEND_URL=http://localhost:5173
```

**Example:**
```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
GOOGLE_CALLBACK_URL=/api/auth/google/callback
SESSION_SECRET=your-super-secret-key-here
FRONTEND_URL=http://localhost:5173
```

---

## Step 3: Test OAuth Flow

### 3.1 Start Backend Server

```bash
cd backend
npm run dev
```

### 3.2 Start Frontend Server

```bash
cd frontend
npm run dev
```

### 3.3 Test Login

1. Go to `http://localhost:5173/login`
2. Click **"Continuar com Google"** button
3. You should be redirected to Google login
4. Select your Google account
5. Grant permissions
6. You should be redirected back and logged in

---

## Step 4: Production Setup (Railway + Vercel)

When deploying to production with **Railway (backend)** and **Vercel (frontend)**:

### 4.1 Get Your Production URLs

1. **Railway Backend URL:**
   - Go to your Railway project dashboard
   - Your backend URL will be something like: `https://your-app.up.railway.app`
   - Or if you have a custom domain: `https://api.yourdomain.com`
   - **Copy this URL** - you'll need it for the next steps

2. **Vercel Frontend URL:**
   - Go to your Vercel project dashboard
   - Your frontend URL will be something like: `https://your-app.vercel.app`
   - Or if you have a custom domain: `https://yourdomain.com`
   - **Copy this URL** - you'll need it for environment variables

### 4.2 Update Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/) > **APIs & Services** > **Credentials**
2. Click on your OAuth 2.0 Client ID (or create a new one for production)
3. Add production URLs:
   
   **Authorized JavaScript origins:**
   ```
   https://your-railway-app.up.railway.app
   https://your-vercel-app.vercel.app
   ```
   (Replace with your actual Railway and Vercel URLs)
   
   **Authorized redirect URIs:**
   ```
   https://your-railway-app.up.railway.app/api/auth/google/callback
   ```
   ⚠️ **Important**: Only add the Railway backend URL here, NOT the Vercel URL

4. Click **Save**

### 4.3 Configure Railway (Backend) Environment Variables

In your Railway project dashboard:

1. Go to your service → **Variables** tab
2. Add these environment variables:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-production-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-production-client-secret

# Backend URL (Railway will auto-set RAILWAY_PUBLIC_DOMAIN, or set your custom domain)
BACKEND_URL=https://your-railway-app.up.railway.app
# OR use Railway's auto-generated variable:
# BACKEND_URL=https://${RAILWAY_PUBLIC_DOMAIN}

# Callback URL (relative path - code will build full URL automatically)
GOOGLE_CALLBACK_URL=/api/auth/google/callback

# Frontend URL (Vercel)
FRONTEND_URL=https://your-vercel-app.vercel.app

# Other required variables
MONGO_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
SESSION_SECRET=your-production-session-secret
NODE_ENV=production
```

**Important Notes:**
- `BACKEND_URL` should be your Railway backend URL (the code will use this to build the callback URL)
- `GOOGLE_CALLBACK_URL` can be a relative path (`/api/auth/google/callback`) - the code will automatically prepend `BACKEND_URL`
- If Railway provides `RAILWAY_PUBLIC_DOMAIN`, you can use: `BACKEND_URL=https://${RAILWAY_PUBLIC_DOMAIN}`
- Make sure `FRONTEND_URL` matches your Vercel deployment URL

### 4.4 Configure Vercel (Frontend) Environment Variables

In your Vercel project dashboard:

1. Go to your project → **Settings** → **Environment Variables**
2. Add:

```env
VITE_API_URL=https://your-railway-app.up.railway.app/api
```

(Replace with your actual Railway backend URL)

### 4.5 Verify the Configuration

1. **Deploy your backend to Railway** with the updated environment variables
2. Check Railway logs - you should see:
   ```
   🔗 Google OAuth callback URL: https://your-railway-app.up.railway.app/api/auth/google/callback
   ```
3. **Verify this exact URL is in Google Cloud Console** under Authorized redirect URIs
4. **Deploy your frontend to Vercel** with the updated environment variables
5. Test the Google OAuth login in production

### 4.6 Using Custom Domains

If you're using custom domains:

**For Railway:**
```env
BACKEND_URL=https://api.yourdomain.com
GOOGLE_CALLBACK_URL=/api/auth/google/callback
```

**For Vercel:**
```env
VITE_API_URL=https://api.yourdomain.com/api
```

**In Google Cloud Console, use:**
- Authorized JavaScript origins: `https://api.yourdomain.com`, `https://yourdomain.com`
- Authorized redirect URIs: `https://api.yourdomain.com/api/auth/google/callback`

---

## Troubleshooting

### Issue: "redirect_uri_mismatch"

**Solution:**
1. **Check what callback URL your backend is using:**
   - Look at the backend console when the server starts
   - You should see: `🔗 Google OAuth callback URL: http://localhost:5000/api/auth/google/callback`
   - This is the EXACT URL you need in Google Console

2. **Update Google Cloud Console:**
   - Go to **APIs & Services** > **Credentials**
   - Click on your OAuth 2.0 Client ID
   - Under **Authorized redirect URIs**, make sure you have:
     - `http://localhost:5000/api/auth/google/callback` (development)
     - Your production backend callback URL (check Railway logs for the exact URL)
   - The URL must match EXACTLY (including http vs https, port number, no trailing slash)
   - **For Railway deployments:** The URL will be `https://your-railway-app.up.railway.app/api/auth/google/callback`

3. **Common mistakes:**
   - ❌ Missing `http://` or `https://`
   - ❌ Wrong port number (5000 vs 5173)
   - ❌ Trailing slash at the end
   - ❌ Using `localhost:5173` instead of `localhost:5000` (backend port)

4. **If using GOOGLE_CALLBACK_URL in .env:**
   - You can set it as a relative path: `/api/auth/google/callback` (recommended)
   - The code will automatically build the full URL using `BACKEND_URL`
   - Or set it as a full URL: `http://localhost:5000/api/auth/google/callback` (works too)
   - Either way, check the backend logs to see what callback URL is actually being used

5. **For Railway/Vercel deployments:**
   - See `GOOGLE_OAUTH_RAILWAY_VERCEL.md` for detailed production setup instructions
   - Make sure `BACKEND_URL` is set to your Railway backend URL in Railway environment variables
   - Check Railway deployment logs to see the exact callback URL being used

### Issue: "access_denied"

**Solution:**
- Make sure you added your email as a test user in OAuth consent screen
- For production, publish your app or add users to test users list

### Issue: OAuth button doesn't redirect

**Solution:**
- Check browser console for errors
- Verify `VITE_API_URL` in frontend `.env` matches backend URL
- Check backend logs for OAuth route errors

### Issue: "Invalid client"

**Solution:**
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`
- Make sure there are no extra spaces or quotes
- Regenerate credentials if needed

---

## Security Notes

1. **Never commit** `.env` file with credentials to Git
2. Use different OAuth credentials for development and production
3. Keep `GOOGLE_CLIENT_SECRET` secure
4. Regularly rotate credentials
5. Use HTTPS in production

---

## How It Works

1. User clicks "Continuar com Google" button
2. Frontend redirects to: `/api/auth/google`
3. Backend redirects to Google OAuth page
4. User authenticates with Google
5. Google redirects to: `/api/auth/google/callback`
6. Backend creates/finds user and generates JWT token
7. Backend redirects to frontend: `/auth/callback?token=...`
8. Frontend stores token and redirects to home page

---

## Additional Providers

To add more OAuth providers (Facebook, GitHub, etc.):

1. Install provider-specific passport strategy
2. Add strategy configuration in `backend/config/passport.js`
3. Add routes in `backend/routes/auth.js`
4. Add buttons in `frontend/src/components/OAuthButtons.jsx`

---

## Support

If you encounter issues:
1. Check Google Cloud Console for errors
2. Review backend logs
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly

