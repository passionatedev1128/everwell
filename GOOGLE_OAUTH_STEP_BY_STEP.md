# Google OAuth Setup - Step by Step Guide

This is a complete step-by-step guide to set up Google OAuth authentication for your EverWell site.

---

## 📋 Prerequisites

- A Google account
- Access to Google Cloud Console
- Your backend and frontend servers running

---

## Step 1: Create Google Cloud Project

### 1.1 Go to Google Cloud Console

1. Open your browser and go to: **https://console.cloud.google.com/**
2. Sign in with your Google account

### 1.2 Create a New Project

1. Click on the **project dropdown** at the top (next to "Google Cloud")
2. Click **"New Project"**
3. Enter project name: **EverWell** (or any name you prefer)
4. Click **"Create"**
5. Wait a few seconds for the project to be created
6. Select the newly created project from the dropdown

---

## Step 2: Enable Google+ API / People API

### 2.1 Navigate to APIs & Services

1. In the left sidebar, click **"APIs & Services"**
2. Click **"Library"**

### 2.2 Enable People API

1. In the search bar, type: **"People API"**
2. Click on **"Google People API"**
3. Click the **"Enable"** button
4. Wait for it to enable (usually takes a few seconds)

**Note:** The People API is needed to get user profile information (name, email, etc.)

---

## Step 3: Configure OAuth Consent Screen

### 3.1 Open OAuth Consent Screen

1. In the left sidebar, go to **"APIs & Services"** > **"OAuth consent screen"**
2. You'll see a form to configure your app

### 3.2 Fill in App Information

1. **User Type**: Select **"External"** (unless you have Google Workspace)
   - Click **"Create"**

2. **App Information**:
   - **App name**: `EverWell` (or your app name)
   - **User support email**: Select your email from dropdown
   - **App logo**: (Optional) Upload a logo if you have one
   - **App domain**: (Optional) Leave blank for now
   - **Developer contact information**: Enter your email
   
3. Click **"Save and Continue"**

### 3.3 Configure Scopes

1. On the **"Scopes"** page, click **"Add or Remove Scopes"**
2. In the filter/search box, search for and select:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
3. Click **"Update"**
4. Click **"Save and Continue"**

### 3.4 Add Test Users (For Development)

**⚠️ IMPORTANT**: If your app is in "Testing" mode, only test users can sign in.

1. On the **"Test users"** page, click **"Add Users"**
2. Enter your email address (the one you'll use to test)
3. Click **"Add"**
4. Click **"Save and Continue"**

### 3.5 Review and Complete

1. Review all the information
2. Click **"Back to Dashboard"**

### 3.6 Publish Your App (IMPORTANT!)

**For Production/Public Use:**

1. You'll see your app status is **"Testing"**
2. Click the **"PUBLISH APP"** button at the top
3. Confirm by clicking **"Confirm"**
4. Your app status will change to **"In production"**

**Note**: 
- In Testing mode: Only test users can sign in
- In Production mode: Anyone with a Google account can sign in
- For basic scopes (email, profile), no Google verification is needed

---

## Step 4: Create OAuth 2.0 Credentials

### 4.1 Navigate to Credentials

1. In the left sidebar, go to **"APIs & Services"** > **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"OAuth client ID"**

### 4.2 Configure OAuth Client

1. **Application type**: Select **"Web application"**

2. **Name**: Enter `EverWell Web Client` (or any name)

3. **Authorized JavaScript origins**:
   Click **"+ ADD URI"** and add:
   - `http://localhost:5000` (Backend - development)
   - `http://localhost:5173` (Frontend - development)
   
   **For production, also add:**
   - `https://your-backend-domain.com`
   - `https://your-frontend-domain.com`

4. **Authorized redirect URIs**:
   Click **"+ ADD URI"** and add:
   - `http://localhost:5000/api/auth/google/callback` (Development)
   
   **For production, also add:**
   - `https://your-backend-domain.com/api/auth/google/callback`

5. Click **"CREATE"**

### 4.3 Copy Your Credentials

**⚠️ IMPORTANT**: Copy these values immediately - you won't be able to see the secret again!

1. A popup will appear with your credentials:
   - **Your Client ID**: `123456789-abcdefghijklmnop.apps.googleusercontent.com`
   - **Your Client Secret**: `GOCSPX-abcdefghijklmnopqrstuvwxyz`

2. **Copy both values** and save them securely (you'll need them in the next step)

3. Click **"OK"**

---

## Step 5: Configure Backend Environment Variables

### 5.1 Locate Your Backend .env File

1. Navigate to your project: `backend/.env`
2. Open it in a text editor

### 5.2 Add Google OAuth Variables

Add these lines to your `backend/.env` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
GOOGLE_CALLBACK_URL=/api/auth/google/callback

# Session Secret (can be same as JWT_SECRET if you have one)
SESSION_SECRET=your-session-secret-here

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 5.3 Replace with Your Actual Values

Replace the placeholders with your actual credentials:

**Example:**
```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
GOOGLE_CALLBACK_URL=/api/auth/google/callback
SESSION_SECRET=my-super-secret-session-key-12345
FRONTEND_URL=http://localhost:5173
```

**Important Notes:**
- No quotes needed around the values
- No spaces before or after the `=` sign
- Make sure there are no trailing spaces

---

## Step 6: Verify Backend Dependencies

### 6.1 Check if Passport is Installed

1. Open terminal in your `backend` folder
2. Run: `npm list passport passport-google-oauth20`

If not installed, run:
```bash
cd backend
npm install passport passport-google-oauth20
```

---

## Step 7: Test Google OAuth

### 7.1 Start Backend Server

1. Open terminal in `backend` folder
2. Run:
```bash
npm run dev
```
3. Wait for: `🚀 Server running on port 5000`

### 7.2 Start Frontend Server

1. Open a **new terminal** in `frontend` folder
2. Run:
```bash
npm run dev
```
3. Wait for: `Local: http://localhost:5173`

### 7.3 Test the Login

1. Open your browser and go to: **http://localhost:5173/login**
2. You should see a **"Continuar com Google"** button
3. Click the button
4. You should be redirected to Google's login page
5. Select your Google account (make sure it's a test user if app is in Testing mode)
6. Click **"Allow"** to grant permissions
7. You should be redirected back to your site and logged in!

---

## Step 8: Troubleshooting

### Issue: "redirect_uri_mismatch" Error

**Problem**: The redirect URI doesn't match what's configured in Google Console.

**Solution**:
1. Go to Google Cloud Console > Credentials
2. Click on your OAuth 2.0 Client ID
3. Check **"Authorized redirect URIs"**
4. Make sure it exactly matches: `http://localhost:5000/api/auth/google/callback`
5. No trailing slashes!
6. Save and wait 1-2 minutes for changes to propagate

### Issue: "access_denied" Error

**Problem**: Your email is not in the test users list (if app is in Testing mode).

**Solution**:
1. Go to OAuth consent screen
2. Click **"Test users"** tab
3. Click **"Add Users"**
4. Add your email address
5. Save

**OR** publish your app (Step 3.6) so anyone can use it.

### Issue: OAuth Button Doesn't Work

**Problem**: Backend not running or environment variables not set.

**Solution**:
1. Check if backend is running: `http://localhost:5000/api/health`
2. Check backend console for errors
3. Verify `.env` file has correct values
4. Restart backend server after changing `.env`

### Issue: "Invalid client" Error

**Problem**: Wrong Client ID or Secret.

**Solution**:
1. Double-check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`
2. Make sure there are no extra spaces or quotes
3. Copy credentials again from Google Console
4. Restart backend server

---

## Step 9: Production Setup

When you're ready to deploy:

### 9.1 Update Google Console

1. Go to Google Cloud Console > Credentials
2. Edit your OAuth 2.0 Client ID
3. Add production URLs:

   **Authorized JavaScript origins:**
   - `https://your-backend-domain.com`
   - `https://your-frontend-domain.com`

   **Authorized redirect URIs:**
   - `https://your-backend-domain.com/api/auth/google/callback`

4. Save

### 9.2 Update Production Environment Variables

Update your production `.env` file:

```env
GOOGLE_CLIENT_ID=your-production-client-id
GOOGLE_CLIENT_SECRET=your-production-client-secret
GOOGLE_CALLBACK_URL=/api/auth/google/callback
FRONTEND_URL=https://your-frontend-domain.com
```

### 9.3 Publish Your App

Make sure your app is published (Step 3.6) so all users can authenticate.

---

## ✅ Verification Checklist

Before testing, make sure:

- [ ] Google Cloud project created
- [ ] People API enabled
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 credentials created
- [ ] Client ID and Secret copied
- [ ] Backend `.env` file updated with credentials
- [ ] Backend server restarted
- [ ] Frontend server running
- [ ] Test user added (if app is in Testing mode)
- [ ] OR app is published (for production)

---

## 🎉 Success!

If everything is set up correctly:

1. Click "Continuar com Google" button
2. You'll be redirected to Google
3. Sign in with your Google account
4. Grant permissions
5. You'll be redirected back and logged in!

---

## 📚 Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport.js Google Strategy](http://www.passportjs.org/packages/passport-google-oauth20/)

---

## 🔒 Security Reminders

1. **Never commit** `.env` file to Git
2. Use different credentials for development and production
3. Keep `GOOGLE_CLIENT_SECRET` secure
4. Use HTTPS in production
5. Regularly review OAuth consent screen settings

---

## Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Check backend terminal for error messages
3. Verify all environment variables are set correctly
4. Make sure redirect URIs match exactly
5. Wait 1-2 minutes after making changes in Google Console

