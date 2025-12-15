# Debug: Email Verification Link Not Arriving

## 🔍 Step-by-Step Troubleshooting

If you registered a user but the verification email isn't arriving, follow these steps:

---

## Step 1: Check Backend Console

**When you register a user, look at your backend terminal/console:**

### ✅ If Email IS Working:
```
📧 Email sent to user@gmail.com: <messageId>
📧 Email sent to user@gmail.com: <messageId>
```

### ❌ If Email is NOT Configured:
```
⚠️ Email not configured. Skipping email send.
   Set EMAIL_USER and EMAIL_APP_PASSWORD (or EMAIL_PASSWORD) in .env
```

### ❌ If Email Error:
```
❌ Error sending email: Invalid login: 535-5.7.8 Username and Password not accepted
Failed to send verification email: Error: Invalid login
```

**What this tells us:**
- If you see "Email not configured" → Email variables are missing or incorrect
- If you see "Invalid login" → Gmail App Password is wrong
- If you see "Email sent" → Email was sent (check spam folder)

---

## Step 2: Verify `.env` File Configuration

**Check `backend/.env` file (lines 19-22):**

### ✅ Correct Configuration for Gmail:

```env
EMAIL_PROVIDER=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=abcdefghijklmnop
```

### ❌ Common Mistakes:

**Mistake 1: Missing EMAIL_PROVIDER**
```env
# ❌ WRONG
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=abcdefghijklmnop
# Missing EMAIL_PROVIDER=gmail
```

**Mistake 2: Using Regular Password Instead of App Password**
```env
# ❌ WRONG
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-regular-gmail-password  # Won't work!
```

**Mistake 3: App Password Has Spaces**
```env
# ❌ WRONG
EMAIL_APP_PASSWORD=abcd efgh ijkl mnop  # Has spaces - remove them!
```

**Mistake 4: Wrong Variable Name**
```env
# ❌ WRONG
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password  # Should be EMAIL_APP_PASSWORD for Gmail
```

---

## Step 3: Check Gmail App Password Setup

### A. Verify 2-Step Verification is Enabled

1. Go to: https://myaccount.google.com/security
2. Check if "2-Step Verification" is ON
3. If OFF → Enable it first!

### B. Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in if needed
3. Select "Mail" from dropdown
4. Select "Other (Custom name)" from second dropdown
5. Enter name: "EverWell"
6. Click "Generate"
7. Copy the 16-character password (looks like: `abcd efgh ijkl mnop`)
8. **Remove all spaces** when adding to `.env`

### C. Update `.env` File

```env
EMAIL_PROVIDER=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=abcdefghijklmnop  # ← No spaces!
```

---

## Step 4: Restart Backend Server

**CRITICAL:** After changing `.env` file, you MUST restart the backend server!

```bash
# Stop the backend server (Ctrl+C)
# Then start it again:
cd backend
npm run dev
```

**Check console for:**
```
✅ Email service configured successfully
```

If you see this, email configuration is correct!

---

## Step 5: Test Email Configuration

**Run the test script:**

```bash
cd backend
node scripts/test-gmail.js
```

### ✅ If Test Passes:
```
✅ Email configuration verified!
📧 Sending test email to: your-email@gmail.com
✅ Test email sent successfully!
   Message ID: <messageId>
📬 Check your inbox at: your-email@gmail.com
```

**Check your inbox for the test email.**

### ❌ If Test Fails:
```
❌ Email configuration verification failed!
❌ Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

**This means:**
- App Password is wrong
- Or 2-Step Verification not enabled
- Or EMAIL_USER is wrong

---

## Step 6: Check Email Inbox

**If backend console shows "Email sent", but you don't see it:**

### A. Check Spam/Junk Folder
- Gmail may mark it as spam initially
- Look for email FROM: `your-email@gmail.com` (the EMAIL_USER in .env)
- Subject: "Verifique seu email - EverWell"

### B. Check "All Mail" Folder
- Sometimes emails go to "All Mail" first

### C. Search for "EverWell"
- Use Gmail search: `from:your-email@gmail.com EverWell`

---

## Step 7: Verify Complete `.env` Configuration

**Your `backend/.env` should have:**

```env
# Required for sign in/sign up
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/everwell
JWT_SECRET=your_secret_key_here

# Email Configuration (for verification emails)
EMAIL_PROVIDER=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=abcdefghijklmnop

# Frontend URL (for verification links)
FRONTEND_URL=http://localhost:5173
```

**Check that:**
- ✅ `EMAIL_PROVIDER=gmail` (lowercase, no quotes)
- ✅ `EMAIL_USER=your-email@gmail.com` (your actual Gmail address)
- ✅ `EMAIL_APP_PASSWORD=...` (16 characters, NO spaces)
- ✅ No quotes around values (unless they're part of the value)
- ✅ No spaces around `=` sign
- ✅ Each variable on its own line

---

## Step 8: Check Email Template URL

**Verify the verification link format in email:**

The verification link should be:
```
http://localhost:5173/verify-email/{token}
```

**If link is wrong:**
- Check `FRONTEND_URL` in `.env`
- Make sure it matches your frontend URL
- Restart backend after changing

---

## 🐛 Common Issues & Solutions

### Issue 1: "Email not configured" Warning

**Problem:** `EMAIL_USER` or `EMAIL_APP_PASSWORD` not set

**Solution:**
1. Check `.env` file has both variables
2. Make sure no typos in variable names
3. Restart backend server

### Issue 2: "Invalid login" Error

**Problem:** Wrong App Password or using regular password

**Solution:**
1. Make sure 2-Step Verification is enabled
2. Generate NEW App Password
3. Copy password WITHOUT spaces
4. Update `.env` file
5. Restart backend server

### Issue 3: Email Sent But Not Received

**Problem:** Email might be in spam or delayed

**Solution:**
1. Check spam/junk folder
2. Wait a few minutes (sometimes delayed)
3. Search inbox for "EverWell" or sender email
4. Check "All Mail" folder

### Issue 4: Email Sent But Link Doesn't Work

**Problem:** Wrong `FRONTEND_URL` in `.env`

**Solution:**
1. Check `FRONTEND_URL=http://localhost:5173` matches your frontend
2. Make sure frontend is running
3. Check link format in email

### Issue 5: Backend Shows Success But No Email

**Problem:** Email was sent but caught by spam filter or Gmail security

**Solution:**
1. Check spam folder
2. Wait a few minutes
3. Try with a different Gmail account
4. Check Gmail security settings
5. Make sure App Password is correct

---

## ✅ Complete Debug Checklist

Before registering again, verify:

- [ ] `EMAIL_PROVIDER=gmail` in `backend/.env`
- [ ] `EMAIL_USER=your-email@gmail.com` in `backend/.env` (your actual Gmail)
- [ ] `EMAIL_APP_PASSWORD=...` in `backend/.env` (16 chars, no spaces)
- [ ] 2-Step Verification is enabled on Google Account
- [ ] App Password generated from https://myaccount.google.com/apppasswords
- [ ] Backend server restarted after adding/changing `.env`
- [ ] Backend console shows: "✅ Email service configured successfully"
- [ ] Test email script runs successfully (`node scripts/test-gmail.js`)
- [ ] Checked spam/junk folder
- [ ] Checked "All Mail" folder
- [ ] Frontend is running on correct port

---

## 🧪 Quick Test

**Test your email configuration:**

```bash
cd backend
node scripts/test-gmail.js
```

**If this works, registration emails will work too!**

---

## 📞 Still Not Working?

If after following all steps, emails still don't arrive:

1. **Share backend console output** when registering
2. **Share your `.env` configuration** (hide password):
   ```env
   EMAIL_PROVIDER=???
   EMAIL_USER=???
   EMAIL_APP_PASSWORD=*** (hidden)
   ```
3. **Share test script output:**
   ```bash
   node scripts/test-gmail.js
   ```

---

**Last Updated:** 2025-01-28

