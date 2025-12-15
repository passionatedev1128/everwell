# Gmail Integration Setup Guide

## 📧 Complete Gmail Setup for EverWell

This guide will help you set up Gmail email service for the EverWell application.

---

## 🔧 Step-by-Step Setup

### Step 1: Enable 2-Step Verification

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** (left sidebar)
3. Under "Signing in to Google", find **2-Step Verification**
4. Click **Get Started** and follow the prompts
5. Complete the setup (you'll need your phone)

**Why?** Gmail requires 2-Step Verification to generate App Passwords.

---

### Step 2: Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → App passwords
2. You may need to sign in again
3. Under "Select app", choose **Mail**
4. Under "Select device", choose **Other (Custom name)**
5. Type: **EverWell** (or any name you prefer)
6. Click **Generate**
7. **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)
   - ⚠️ **Important:** You can only see this password once!

---

### Step 3: Configure Environment Variables

1. Open `backend/.env` file
2. Add or update these variables:

```env
# Email Configuration for Gmail
EMAIL_PROVIDER=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=abcdefghijklmnop
```

**Important Notes:**
- Use `EMAIL_APP_PASSWORD` (not `EMAIL_PASSWORD`)
- Remove spaces from the app password (if it has spaces)
- Use your full Gmail address for `EMAIL_USER`
- Make sure `EMAIL_PROVIDER=gmail` (lowercase)

**Example:**
```env
EMAIL_PROVIDER=gmail
EMAIL_USER=everwell.business@gmail.com
EMAIL_APP_PASSWORD=abcdefghijklmnop
```

---

### Step 4: Test Gmail Integration

Run the test script:

```bash
cd backend
node scripts/test-gmail.js
```

**Expected Output:**
```
🧪 Testing Gmail Integration...

📋 Checking environment variables:
   EMAIL_PROVIDER: gmail
   EMAIL_USER: your-email@gmail.com
   EMAIL_APP_PASSWORD: ***set***

🔍 Verifying email configuration...
✅ Email service configured successfully
✅ Email configuration verified!

📧 Sending test email to: your-email@gmail.com
✅ Test email sent successfully!
   Message ID: <...>
```

**If successful:**
- Check your inbox for the test email
- Also check spam folder if not found

---

## 🛠️ Troubleshooting

### Error: "Invalid login"

**Problem:** App password is incorrect or not set.

**Solution:**
1. Verify `EMAIL_APP_PASSWORD` in `.env` (no spaces)
2. Make sure you copied the full 16-character password
3. Generate a new app password if needed
4. Restart the backend server after updating `.env`

---

### Error: "Less secure app access"

**Problem:** Gmail is blocking the connection.

**Solution:**
1. Make sure 2-Step Verification is enabled
2. Use App Password (not regular password)
3. App passwords are more secure and required for Gmail

---

### Error: "Connection timeout"

**Problem:** Network or firewall issue.

**Solution:**
1. Check your internet connection
2. Verify firewall isn't blocking port 587/465
3. Try from a different network

---

### Error: "Email not configured"

**Problem:** Environment variables not set correctly.

**Solution:**
1. Check `.env` file exists in `backend/` directory
2. Verify all variables are set:
   - `EMAIL_PROVIDER=gmail`
   - `EMAIL_USER=your-email@gmail.com`
   - `EMAIL_APP_PASSWORD=your-16-char-password`
3. Restart backend server after changes

---

### Emails going to Spam

**Problem:** Gmail marks emails as spam.

**Solution:**
1. Check spam folder
2. Mark as "Not Spam" if found
3. Add sender to contacts
4. For production, consider:
   - Using a custom domain email
   - Setting up SPF/DKIM records
   - Using a professional email service

---

## ✅ Verification Checklist

Before considering Gmail integration complete:

- [ ] 2-Step Verification enabled on Google Account
- [ ] App Password generated and copied
- [ ] `EMAIL_PROVIDER=gmail` in `.env`
- [ ] `EMAIL_USER` set to your Gmail address
- [ ] `EMAIL_APP_PASSWORD` set (16 characters, no spaces)
- [ ] Test script runs successfully
- [ ] Test email received in inbox
- [ ] Backend server starts without email errors

---

## 📧 Email Features Enabled

Once Gmail is configured, these features will work:

1. **User Registration** - Welcome email sent
2. **User Authorization** - Email when user is authorized/deauthorized
3. **Document Upload** - Confirmation email when document is uploaded
4. **Document Approval** - Email when document is approved/rejected
5. **Order Status Updates** - Email when order status changes
6. **Payment Confirmations** - Email when payment proof is received

---

## 🔒 Security Best Practices

1. **Never commit `.env` file** to version control
2. **Use App Passwords** (not regular passwords)
3. **Rotate App Passwords** periodically
4. **Use separate Gmail account** for production (not personal)
5. **Enable 2FA** on the Gmail account
6. **Monitor email activity** in Google Account

---

## 📝 Quick Reference

**Environment Variables:**
```env
EMAIL_PROVIDER=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=abcdefghijklmnop
```

**Test Command:**
```bash
cd backend
node scripts/test-gmail.js
```

**App Password Generator:**
https://myaccount.google.com/apppasswords

**Google Account Security:**
https://myaccount.google.com/security

---

## 🎉 Success!

If the test email is received, your Gmail integration is working correctly!

You can now:
- Register users and send welcome emails
- Send authorization notifications
- Send document upload confirmations
- Send order status updates
- All email features are active!

---

**Need Help?** Check the main `EMAIL_SETUP_GUIDE.md` for more details.

