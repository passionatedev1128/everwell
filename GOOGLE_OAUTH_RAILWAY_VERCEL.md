# Google OAuth Setup for Railway + Vercel Production

Quick guide for configuring Google OAuth when deploying to Railway (backend) and Vercel (frontend).

---

## 🎯 Quick Steps

### Step 1: Get Your Production URLs

1. **Railway Backend URL:**
   - Railway dashboard → Your service → Settings → Networking
   - URL format: `https://your-app-name.up.railway.app`
   - Or check your service's "Public Domain" section

2. **Vercel Frontend URL:**
   - Vercel dashboard → Your project → Deployments
   - URL format: `https://your-app-name.vercel.app`
   - Or check your custom domain if configured

---

## Step 2: Configure Google Cloud Console

1. Go to: https://console.cloud.google.com/ → **APIs & Services** → **Credentials**
2. Click your OAuth 2.0 Client ID (or create one)
3. Add these URLs:

### Authorized JavaScript origins:
```
https://your-railway-app.up.railway.app
https://your-vercel-app.vercel.app
```

### Authorized redirect URIs:
```
https://your-railway-app.up.railway.app/api/auth/google/callback
```

⚠️ **Important:** Only add the Railway backend URL to redirect URIs, NOT the Vercel URL.

4. Click **Save**

---

## Step 3: Configure Railway Environment Variables

In Railway dashboard → Your service → **Variables** tab:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Backend URL (use your Railway public domain)
BACKEND_URL=https://your-railway-app.up.railway.app

# Callback URL (relative - code will build full URL)
GOOGLE_CALLBACK_URL=/api/auth/google/callback

# Frontend URL (your Vercel URL)
FRONTEND_URL=https://your-vercel-app.vercel.app

# Other required
MONGO_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
SESSION_SECRET=your-production-session-secret
NODE_ENV=production
```

### Option: Using Railway's Auto Domain

If Railway provides `RAILWAY_PUBLIC_DOMAIN` automatically, you can use:

```env
BACKEND_URL=https://${RAILWAY_PUBLIC_DOMAIN}
```

But you need to verify Railway actually sets this variable. If not, use the explicit URL.

---

## Step 4: Configure Vercel Environment Variables

In Vercel dashboard → Your project → **Settings** → **Environment Variables**:

```env
VITE_API_URL=https://your-railway-app.up.railway.app/api
```

---

## Step 5: Verify Configuration

1. **Deploy backend to Railway** with the new variables
2. **Check Railway logs** - you should see:
   ```
   🔗 Google OAuth callback URL: https://your-railway-app.up.railway.app/api/auth/google/callback
   ```
3. **Verify this exact URL is in Google Cloud Console** redirect URIs
4. **Deploy frontend to Vercel**
5. **Test Google OAuth login** on your production site

---

## 🔍 Troubleshooting

### Error: "redirect_uri_mismatch"

**Solution:**
1. Check Railway logs to see what callback URL is being used
2. Copy that EXACT URL
3. Go to Google Cloud Console → Credentials → Your OAuth Client
4. Add that EXACT URL to "Authorized redirect URIs"
5. Make sure there are no trailing slashes, correct protocol (https), correct port (none for https)

### The callback URL in logs doesn't match what I expect

**Check:**
- Is `BACKEND_URL` set correctly in Railway?
- Does it include `https://` at the beginning?
- Is there a trailing slash? (should NOT have one)

**Fix:**
- Set `BACKEND_URL=https://your-railway-app.up.railway.app` (no trailing slash)
- Set `GOOGLE_CALLBACK_URL=/api/auth/google/callback` (starts with /)

The code will automatically combine them: `${BACKEND_URL}${GOOGLE_CALLBACK_URL}`

### Using Custom Domains

If you have custom domains set up:

**Railway:**
```env
BACKEND_URL=https://api.yourdomain.com
GOOGLE_CALLBACK_URL=/api/auth/google/callback
```

**Vercel:**
```env
VITE_API_URL=https://api.yourdomain.com/api
```

**Google Cloud Console:**
- Authorized JavaScript origins: `https://api.yourdomain.com`, `https://yourdomain.com`
- Authorized redirect URIs: `https://api.yourdomain.com/api/auth/google/callback`

---

## ✅ Checklist

- [ ] Got Railway backend URL
- [ ] Got Vercel frontend URL
- [ ] Added both URLs to Google Cloud Console "Authorized JavaScript origins"
- [ ] Added Railway callback URL to "Authorized redirect URIs"
- [ ] Set `BACKEND_URL` in Railway variables
- [ ] Set `GOOGLE_CALLBACK_URL=/api/auth/google/callback` in Railway variables
- [ ] Set `FRONTEND_URL` in Railway variables (your Vercel URL)
- [ ] Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in Railway variables
- [ ] Set `VITE_API_URL` in Vercel variables (your Railway URL + /api)
- [ ] Deployed backend to Railway
- [ ] Verified callback URL in Railway logs
- [ ] Verified callback URL matches Google Console
- [ ] Deployed frontend to Vercel
- [ ] Tested Google OAuth login in production

---

## 📝 Example Configuration

**Railway Backend URL:** `https://everwell-api.up.railway.app`  
**Vercel Frontend URL:** `https://everwell.vercel.app`

**Railway Variables:**
```env
BACKEND_URL=https://everwell-api.up.railway.app
GOOGLE_CALLBACK_URL=/api/auth/google/callback
FRONTEND_URL=https://everwell.vercel.app
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xyz123
```

**Vercel Variables:**
```env
VITE_API_URL=https://everwell-api.up.railway.app/api
```

**Google Cloud Console:**
- JavaScript origins: `https://everwell-api.up.railway.app`, `https://everwell.vercel.app`
- Redirect URIs: `https://everwell-api.up.railway.app/api/auth/google/callback`

---

**Need help?** Check the Railway logs after deployment to see what callback URL is being used, and make sure it matches Google Console exactly.

