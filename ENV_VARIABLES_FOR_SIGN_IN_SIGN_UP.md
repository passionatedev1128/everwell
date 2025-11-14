# Environment Variables for Sign In and Sign Up

This guide shows exactly what environment variables are needed in the `.env` files for user registration (sign up) and login (sign in) to work.

---

## 📋 Quick Summary

### ✅ Required (Sign In/Sign Up Won't Work Without These)

**Backend `.env`:**
- `MONGO_URI` - Database connection
- `JWT_SECRET` - Token signing key

**Frontend `.env`:**
- `VITE_API_URL` - Backend API URL (has default)

### ⚠️ Optional (Sign In/Sign Up Works, But Features Limited)

**Backend `.env`:**
- `EMAIL_USER` + `EMAIL_APP_PASSWORD` - For sending verification emails
- `FRONTEND_URL` - For email verification links (has default)
- `JWT_EXPIRES_IN` - Token expiry (has default: 7d)
- `PORT` - Server port (has default: 5000)

---

## 🔧 Backend `.env` File

### Location: `backend/.env`

### ✅ REQUIRED Variables

These are **absolutely required** for sign in/sign up to work:

```env
# MongoDB Connection (REQUIRED)
# Without this, the server cannot connect to database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/everwell
# OR for local MongoDB:
# MONGO_URI=mongodb://localhost:27017/everwell

# JWT Secret Key (REQUIRED)
# Without this, tokens cannot be generated for login
JWT_SECRET=your_super_secret_key_here_at_least_32_characters_long
```

**What happens if missing:**
- ❌ `MONGO_URI` missing → Server crashes, cannot save users
- ❌ `JWT_SECRET` missing → Cannot generate login tokens, authentication fails

### ⚠️ OPTIONAL Variables (Have Defaults)

These have default values, but you can customize them:

```env
# Server Port (Optional - defaults to 5000)
PORT=5000

# JWT Token Expiry (Optional - defaults to 7d)
JWT_EXPIRES_IN=7d

# Frontend URL (Optional - defaults to http://localhost:5173)
# Used for email verification links
FRONTEND_URL=http://localhost:5173

# Environment (Optional - defaults to development)
NODE_ENV=development

# Session Secret (Optional - defaults to JWT_SECRET)
# Used for OAuth sessions
SESSION_SECRET=your_session_secret_here
```

### 📧 OPTIONAL: Email Configuration

**Sign in/sign up works WITHOUT these**, but verification emails won't be sent:

```env
# Email Provider (Optional)
# Options: gmail, outlook, hotmail, yahoo, custom
EMAIL_PROVIDER=gmail

# Email Credentials (Optional)
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-app-password  # For Gmail
# OR
EMAIL_PASSWORD=your-password  # For other providers

# Custom SMTP (Only if EMAIL_PROVIDER=custom)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
```

**What happens if missing:**
- ✅ Sign up still works (user account created)
- ✅ Sign in still works (user can log in)
- ❌ Verification emails NOT sent
- ❌ Welcome emails NOT sent
- ⚠️ Backend console shows: "Email not configured. Skipping email send."

---

## 🎨 Frontend `.env` File

### Location: `frontend/.env`

### ✅ REQUIRED Variables

```env
# Backend API URL (REQUIRED - but has default)
# Without this, frontend cannot communicate with backend
VITE_API_URL=http://localhost:5000/api
```

**What happens if missing:**
- ⚠️ Uses default: `http://localhost:5000/api`
- ✅ Works fine if backend is on default port
- ❌ Won't work if backend is on different port/URL

### ⚠️ OPTIONAL Variables

These are for analytics and other features (NOT required for sign in/sign up):

```env
# Google Analytics 4 (Optional)
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Tag Manager (Optional)
VITE_GTM_CONTAINER_ID=GTM-XXXXXXX

# HubSpot (Optional)
VITE_HUBSPOT_PORTAL_ID=12345678

# SimplyBook (Optional - for booking)
VITE_SIMPLYBOOK_COMPANY_ID=everwell
```

**What happens if missing:**
- ✅ Sign in/sign up still works perfectly
- ❌ Analytics events not tracked
- ❌ HubSpot tracking not active
- ❌ Booking widget may not work

---

## 📝 Complete Example Files

### Backend `.env` (Minimum Required)

```env
# ============================================
# REQUIRED - Sign In/Sign Up Won't Work Without These
# ============================================

# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/everwell

# JWT Secret (generate a secure random string)
JWT_SECRET=your_super_secret_key_here_at_least_32_characters_long

# ============================================
# OPTIONAL - Have Defaults
# ============================================

PORT=5000
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# ============================================
# OPTIONAL - For Email Features
# ============================================

# Email Configuration (for verification emails)
EMAIL_PROVIDER=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-16-char-app-password
```

### Frontend `.env` (Minimum Required)

```env
# ============================================
# REQUIRED - But Has Default
# ============================================

# Backend API URL
VITE_API_URL=http://localhost:5000/api

# ============================================
# OPTIONAL - For Analytics & Features
# ============================================

# VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
# VITE_GTM_CONTAINER_ID=GTM-XXXXXXX
# VITE_HUBSPOT_PORTAL_ID=12345678
# VITE_SIMPLYBOOK_COMPANY_ID=everwell
```

---

## 🎯 What's Actually Needed for Sign In/Sign Up

### Minimum Setup (Sign In/Sign Up Works)

**Backend `.env`:**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/everwell
JWT_SECRET=your_secret_key_here
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:5000/api
```

**Result:**
- ✅ Users can register
- ✅ Users can log in
- ✅ Tokens are generated
- ✅ Sessions work
- ❌ Verification emails NOT sent (but registration still works)

### Full Setup (Sign In/Sign Up + Email Features)

**Backend `.env`:**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/everwell
JWT_SECRET=your_secret_key_here
EMAIL_PROVIDER=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:5000/api
```

**Result:**
- ✅ Users can register
- ✅ Users can log in
- ✅ Verification emails ARE sent
- ✅ Welcome emails ARE sent
- ✅ Full email functionality

---

## 🔍 How to Check What's Required

### Check Backend Code

**Sign Up requires:**
- `MONGO_URI` - To save user to database
- `JWT_SECRET` - To generate login token

**Sign In requires:**
- `MONGO_URI` - To find user in database
- `JWT_SECRET` - To verify login token

**Email sending requires:**
- `EMAIL_USER` - Email address to send FROM
- `EMAIL_APP_PASSWORD` or `EMAIL_PASSWORD` - Credentials to authenticate

### Check Frontend Code

**API calls require:**
- `VITE_API_URL` - To know where backend is (has default)

---

## ⚠️ Common Mistakes

### Mistake 1: Missing MONGO_URI

**Error:**
```
❌ MongoDB connection error: MONGO_URI is not defined
```

**Fix:**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/everwell
```

### Mistake 2: Missing JWT_SECRET

**Error:**
```
❌ JWT_SECRET is not defined
```

**Fix:**
```env
JWT_SECRET=your_super_secret_key_here
```

### Mistake 3: Wrong VITE_API_URL

**Error:**
```
❌ Network Error: Failed to fetch
```

**Fix:**
```env
# Make sure this matches your backend URL
VITE_API_URL=http://localhost:5000/api
```

### Mistake 4: Email Not Configured (Not Actually a Problem)

**Warning:**
```
⚠️ Email not configured. Skipping email send.
```

**This is OK!** Sign in/sign up still works. Emails just won't be sent.

**To fix (optional):**
```env
EMAIL_PROVIDER=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-app-password
```

---

## 📊 Summary Table

| Variable | Location | Required? | Default | Purpose |
|----------|----------|-----------|---------|---------|
| `MONGO_URI` | Backend | ✅ **YES** | None | Database connection |
| `JWT_SECRET` | Backend | ✅ **YES** | None | Token signing |
| `VITE_API_URL` | Frontend | ⚠️ Has default | `http://localhost:5000/api` | Backend API URL |
| `EMAIL_USER` | Backend | ❌ Optional | None | Send emails FROM |
| `EMAIL_APP_PASSWORD` | Backend | ❌ Optional | None | Email authentication |
| `FRONTEND_URL` | Backend | ⚠️ Has default | `http://localhost:5173` | Email verification links |
| `JWT_EXPIRES_IN` | Backend | ⚠️ Has default | `7d` | Token expiry time |
| `PORT` | Backend | ⚠️ Has default | `5000` | Server port |

---

## ✅ Quick Checklist

### For Sign In/Sign Up to Work:

**Backend `.env`:**
- [ ] `MONGO_URI` is set
- [ ] `JWT_SECRET` is set

**Frontend `.env`:**
- [ ] `VITE_API_URL` is set (or use default)

### For Email Features to Work:

**Backend `.env`:**
- [ ] `EMAIL_USER` is set
- [ ] `EMAIL_APP_PASSWORD` (Gmail) or `EMAIL_PASSWORD` (others) is set
- [ ] `EMAIL_PROVIDER` is set (optional, defaults to gmail)
- [ ] `FRONTEND_URL` is set (optional, has default)

---

## 🎯 Bottom Line

**Minimum for Sign In/Sign Up:**
- Backend: `MONGO_URI` + `JWT_SECRET`
- Frontend: `VITE_API_URL` (or use default)

**Everything else is optional!**

Email configuration is nice to have but not required for basic sign in/sign up functionality.

---

**Last Updated:** 2025-01-28

