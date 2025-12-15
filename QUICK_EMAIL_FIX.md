# Quick Fix: Email Not Sending After Registration

## 🔍 Problem

You see:
```
POST /api/auth/register 201 110.785 ms - 486
```

But **NO email logs** (no "📧 Email sent" or "⚠️ Email not configured")

This means the email configuration is likely missing or incorrect.

---

## ✅ Quick Fix Steps

### Step 1: Check Your `.env` File

Open `backend/.env` and verify you have these lines:

```env
EMAIL_PROVIDER=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-16-char-app-password
```

**Important:**
- ✅ `EMAIL_PROVIDER=gmail` (lowercase, no quotes)
- ✅ `EMAIL_USER=your-email@gmail.com` (your actual Gmail address)
- ✅ `EMAIL_APP_PASSWORD=...` (16 characters, **NO spaces**)
- ❌ Do NOT use `EMAIL_PASSWORD` for Gmail (use `EMAIL_APP_PASSWORD`)

### Step 2: Get Gmail App Password

If you don't have an App Password yet:

1. **Enable 2-Step Verification:**
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" → "Other (Custom name)"
   - Name: "EverWell"
   - Copy the 16-character password
   - **Remove all spaces** when adding to `.env`

### Step 3: Update `.env` File

Make sure your `backend/.env` has:

```env
# Email Configuration
EMAIL_PROVIDER=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=abcdefghijklmnop
```

**Example:**
```env
EMAIL_PROVIDER=gmail
EMAIL_USER=john.doe@gmail.com
EMAIL_APP_PASSWORD=abcd efgh ijkl mnop
```

**After copying, remove spaces:**
```env
EMAIL_APP_PASSWORD=abcdefghijklmnop
```

### Step 4: Restart Backend Server

**CRITICAL:** After changing `.env`, restart the backend:

1. Stop the server (press `Ctrl+C` in the backend terminal)
2. Start it again:
   ```bash
   cd backend
   npm run dev
   ```

3. **Check the console** when server starts:
   - ✅ Should see: `✅ Email service configured successfully`
   - ❌ If you see: `❌ Email configuration error:` → Check your App Password

### Step 5: Test Email Configuration

Run the test script:

```bash
cd backend
node scripts/test-gmail.js
```

**Expected output:**
```
✅ Email configuration verified!
📧 Sending test email to: your-email@gmail.com
✅ Test email sent successfully!
📬 Check your inbox at: your-email@gmail.com
```

**If you see errors:**
- Check App Password is correct
- Make sure 2-Step Verification is enabled
- Verify EMAIL_USER is your correct Gmail address

### Step 6: Register Again

After fixing the configuration:

1. Register a new user (or use existing account)
2. **Check backend console** - you should now see:
   ```
   📧 Email sent to user@gmail.com: <messageId>
   📧 Email sent to user@gmail.com: <messageId>
   ```

3. **Check email inbox** (and spam folder)

---

## 🐛 Common Issues

### Issue 1: No Email Logs at All

**Problem:** Email variables not set or wrong

**Check:**
- `EMAIL_PROVIDER=gmail` exists in `.env`
- `EMAIL_USER=...` exists in `.env`
- `EMAIL_APP_PASSWORD=...` exists in `.env`
- No typos in variable names
- Backend server restarted after changes

### Issue 2: "Email not configured" Warning

**Problem:** Missing EMAIL_USER or EMAIL_APP_PASSWORD

**Fix:**
- Add both variables to `.env`
- Restart backend server

### Issue 3: "Invalid login" Error

**Problem:** Wrong App Password or using regular password

**Fix:**
- Generate NEW App Password
- Make sure 2-Step Verification is enabled
- Use `EMAIL_APP_PASSWORD` (not `EMAIL_PASSWORD`)
- Remove spaces from App Password

### Issue 4: Email Sent But Not Received

**Problem:** Email in spam or delayed

**Fix:**
- Check spam/junk folder
- Wait a few minutes
- Search inbox for "EverWell"

---

## ✅ Complete Checklist

Before registering, verify:

- [ ] `EMAIL_PROVIDER=gmail` in `backend/.env`
- [ ] `EMAIL_USER=your-email@gmail.com` in `backend/.env`
- [ ] `EMAIL_APP_PASSWORD=...` in `backend/.env` (16 chars, no spaces)
- [ ] 2-Step Verification enabled on Google Account
- [ ] App Password generated from Google
- [ ] Backend server restarted after `.env` changes
- [ ] Backend console shows: "✅ Email service configured successfully"
- [ ] Test script (`node scripts/test-gmail.js`) works
- [ ] Check spam folder if email sent but not received

---

## 🧪 Quick Test

**Test your email setup:**

```bash
cd backend
node scripts/test-gmail.js
```

**If this works, registration emails will work too!**

---

## 📝 Example `.env` Configuration

**Complete example for `backend/.env`:**

```env
# Required for sign in/sign up
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/everwell
JWT_SECRET=your_secret_key_here

# Email Configuration (for verification emails)
EMAIL_PROVIDER=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=abcdefghijklmnop

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

---

**After fixing, restart backend and try registering again!**

