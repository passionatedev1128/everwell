# Minimum Environment Variables for Email Sign In/Sign Up

## ✅ What You Need in `.env` Files

### Backend `.env` File

**Location:** `backend/.env`

**Minimum Required (Sign In/Sign Up Won't Work Without These):**

```env
# 1. MongoDB Connection (REQUIRED)
# Without this, the server cannot save/retrieve user data
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/everwell
# OR for local MongoDB:
# MONGO_URI=mongodb://localhost:27017/everwell

# 2. JWT Secret Key (REQUIRED)
# Without this, login tokens cannot be generated/verified
JWT_SECRET=your_super_secret_key_at_least_32_characters_long
```

**That's it!** These two are the **absolute minimum** for email sign in/sign up to work.

---

### Frontend `.env` File

**Location:** `frontend/.env`

**Minimum Required (Has Default, But Recommended to Set):**

```env
# Backend API URL (Has default, but recommended to set)
# Without this, frontend doesn't know where the backend is
VITE_API_URL=http://localhost:5000/api
```

**Note:** This has a default value of `http://localhost:5000/api`, so it's technically optional. But it's **recommended** to set it explicitly.

---

## 📋 Complete Minimum Setup

### Step 1: Create Backend `.env` File

Create/edit `backend/.env`:

```env
# ============================================
# REQUIRED - Sign In/Sign Up Won't Work Without These
# ============================================

# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/everwell

# JWT Secret (generate a secure random string)
JWT_SECRET=your_super_secret_key_here_at_least_32_characters_long
```

### Step 2: Create Frontend `.env` File

Create/edit `frontend/.env`:

```env
# ============================================
# RECOMMENDED - Has Default But Should Set Explicitly
# ============================================

# Backend API URL
VITE_API_URL=http://localhost:5000/api
```

---

## 🔑 How to Generate JWT_SECRET

You need a secure random string for `JWT_SECRET`. Here are several ways:

### Option 1: Node.js Command
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Option 2: PowerShell (Windows)
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
```

### Option 3: Online Generator
- Visit: https://randomkeygen.com/
- Copy a "CodeIgniter Encryption Keys" value

### Option 4: Manual (Not Recommended)
- Use any random string at least 32 characters long
- Example: `everwell_secret_key_2025_abcdefghijklmnop123456789`

---

## 🎯 What Happens With This Minimum Setup

### ✅ What Works:
- ✅ Users can register (sign up) with email and password
- ✅ Users can log in (sign in) with email and password
- ✅ User accounts are saved to MongoDB
- ✅ Login tokens are generated and verified
- ✅ Sessions work correctly
- ✅ Protected routes work

### ❌ What Doesn't Work:
- ❌ Verification emails are NOT sent
- ❌ Welcome emails are NOT sent
- ❌ Password reset emails are NOT sent
- ⚠️ Backend console shows: "Email not configured. Skipping email send."

**But this is OK!** Sign in/sign up still works perfectly. Users just won't receive emails.

---

## 📧 Optional: Add Email Support (If You Want Emails Sent)

If you want verification emails and welcome emails to be sent, add these to `backend/.env`:

```env
# ============================================
# OPTIONAL - For Sending Verification Emails
# ============================================

# Email Provider (options: gmail, outlook, hotmail, yahoo, custom)
EMAIL_PROVIDER=gmail

# Email Address to Send FROM
EMAIL_USER=your-email@gmail.com

# Email Password/App Password
EMAIL_APP_PASSWORD=your-16-char-app-password  # For Gmail
# OR
EMAIL_PASSWORD=your-password  # For other providers

# Frontend URL (for email verification links)
FRONTEND_URL=http://localhost:5173
```

**Important:** These are **optional**. Sign in/sign up works WITHOUT these. They're only needed if you want emails to be sent.

---

## 🔍 How to Get MongoDB URI

### Option A: MongoDB Atlas (Cloud - Recommended)

1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up or log in
3. Create a free cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Replace `<dbname>` with `everwell` (or your database name)

**Example:**
```
mongodb+srv://username:MyPassword123@cluster0.xxxxx.mongodb.net/everwell?retryWrites=true&w=majority
```

### Option B: Local MongoDB

1. Install MongoDB locally: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Use this connection string:

```env
MONGO_URI=mongodb://localhost:27017/everwell
```

---

## ✅ Quick Checklist

### For Email Sign In/Sign Up to Work:

**Backend `.env`:**
- [ ] `MONGO_URI` is set (MongoDB connection string)
- [ ] `JWT_SECRET` is set (secure random string, at least 32 characters)

**Frontend `.env`:**
- [ ] `VITE_API_URL` is set (or use default: `http://localhost:5000/api`)

### That's It!

With just these three variables (or two if using default), email sign in/sign up will work!

---

## 🧪 Test It Works

### Step 1: Start Backend
```bash
cd backend
npm run dev
```

**Check console for:**
- ✅ `✅ MongoDB Connected: ...`
- ✅ `Server running on port 5000`

### Step 2: Start Frontend
```bash
cd frontend
npm run dev
```

**Check console for:**
- ✅ `Local: http://localhost:5173`

### Step 3: Test Sign Up

1. Go to: `http://localhost:5173/login`
2. Click "Cadastre-se" (Register)
3. Fill form:
   - Name: Test User
   - Email: your-email@gmail.com
   - Password: test123456
4. Click "Criar Conta"

**Expected:**
- ✅ Success toast: "Conta criada! Verifique seu email..."
- ✅ Redirected to homepage
- ✅ User is logged in

**If email not configured:**
- ⚠️ Backend console shows: "Email not configured. Skipping email send."
- ✅ But sign up still works!

### Step 4: Test Sign In

1. Go to: `http://localhost:5173/login`
2. Fill form:
   - Email: your-email@gmail.com
   - Password: test123456
3. Click "Entrar" (Login)

**Expected:**
- ✅ Success toast: "Login realizado com sucesso!"
- ✅ Redirected to homepage
- ✅ User is logged in

---

## 🐛 Troubleshooting

### Error: "MONGO_URI is not defined"

**Problem:** MongoDB connection string is missing

**Fix:** Add to `backend/.env`:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/everwell
```

### Error: "JWT_SECRET is not defined"

**Problem:** JWT secret key is missing

**Fix:** Add to `backend/.env`:
```env
JWT_SECRET=your_super_secret_key_here_at_least_32_characters_long
```

### Error: "Network Error: Failed to fetch"

**Problem:** Frontend can't reach backend

**Fix:** Check `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

**Also check:**
- Backend is running on port 5000
- Frontend is running on port 5173
- Both servers are started

### Warning: "Email not configured"

**Problem:** Email credentials are missing

**This is OK!** Sign in/sign up still works. If you want emails sent, add:
```env
EMAIL_PROVIDER=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-app-password
```

---

## 📊 Summary Table

| Variable | Location | Required? | Purpose |
|----------|----------|-----------|---------|
| `MONGO_URI` | `backend/.env` | ✅ **YES** | Save/retrieve user data |
| `JWT_SECRET` | `backend/.env` | ✅ **YES** | Generate/verify login tokens |
| `VITE_API_URL` | `frontend/.env` | ⚠️ Has default | Know where backend is |
| `EMAIL_USER` | `backend/.env` | ❌ Optional | Send emails FROM |
| `EMAIL_APP_PASSWORD` | `backend/.env` | ❌ Optional | Authenticate email service |

---

## 🎯 Bottom Line

**To implement email sign in/sign up, you need:**

### Backend `.env`:
1. `MONGO_URI` - MongoDB connection
2. `JWT_SECRET` - Token signing key

### Frontend `.env`:
1. `VITE_API_URL` - Backend URL (has default)

**That's it!** Just 2-3 variables and email sign in/sign up works!

Everything else is optional and can be added later if needed.

---

**Last Updated:** 2025-01-28

