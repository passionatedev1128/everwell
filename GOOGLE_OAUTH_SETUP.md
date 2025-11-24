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

## Step 4: Production Setup

When deploying to production:

### 4.1 Update Google OAuth Credentials

1. Go to Google Cloud Console > **Credentials**
2. Edit your OAuth 2.0 Client ID
3. Add production URLs:
   - **Authorized JavaScript origins**:
     - `https://your-backend-domain.com`
     - `https://your-frontend-domain.com`
   - **Authorized redirect URIs**:
     - `https://your-backend-domain.com/api/auth/google/callback`

### 4.2 Update Environment Variables

Update your production `.env`:

```env
GOOGLE_CLIENT_ID=your-production-client-id
GOOGLE_CLIENT_SECRET=your-production-client-secret
GOOGLE_CALLBACK_URL=/api/auth/google/callback
FRONTEND_URL=https://your-frontend-domain.com
```

---

## Troubleshooting

### Issue: "redirect_uri_mismatch"

**Solution:**
- Make sure the redirect URI in Google Console exactly matches:
  - `http://localhost:5000/api/auth/google/callback` (development)
  - Or your production callback URL
- Check for trailing slashes or http vs https

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

