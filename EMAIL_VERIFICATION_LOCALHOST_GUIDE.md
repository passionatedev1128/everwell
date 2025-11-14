# Email Verification in Localhost Environment

## ✅ Quick Answer

**YES, verification emails ARE sent to users' inboxes when they register**, **IF** email is properly configured in your backend `.env` file.

---

## 🔍 How to Check If Email Is Configured

### 1. Check Backend Console

When a user registers, look at your backend terminal/console:

**✅ If Email IS Configured:**
```
📧 Email sent to user@example.com: <messageId>
```

**❌ If Email is NOT Configured:**
```
⚠️ Email not configured. Skipping email send.
   Set EMAIL_USER and EMAIL_APP_PASSWORD (or EMAIL_PASSWORD) in .env
```

### 2. Check Backend `.env` File

Your `backend/.env` file should have these variables:

```env
# Required for email to work
EMAIL_PROVIDER=gmail                    # or outlook, yahoo, custom
EMAIL_USER=your-email@gmail.com         # Your sending email address
EMAIL_APP_PASSWORD=your-app-password    # For Gmail (16-char app password)
# OR
EMAIL_PASSWORD=your-password            # For other providers

# Optional: Frontend URL for verification links
FRONTEND_URL=http://localhost:5173      # Defaults to http://localhost:5173 if not set
```

---

## 📧 What Happens During Registration

1. **User registers** → Backend creates user account
2. **Backend generates verification token** → Valid for 24 hours
3. **Backend sends verification email** → IF email is configured
4. **User receives email** → With verification link
5. **User clicks link** → Email is verified

---

## 🔗 Verification Link Format

The verification link in the email will be:

```
http://localhost:5173/verify-email/{token}
```

**Example:**
```
http://localhost:5173/verify-email/abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

This link:
- ✅ Works in localhost environment
- ✅ Expires after 24 hours
- ✅ Can only be used once
- ✅ Redirects to frontend verification page

---

## ⚙️ How to Configure Email (If Not Already Done)

### For Gmail (Recommended for Testing)

1. **Enable 2-Step Verification:**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification

2. **Generate App Password:**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Other (Custom name)"
   - Name it "EverWell Localhost"
   - Copy the 16-character password (remove spaces)

3. **Add to `backend/.env`:**
   ```env
   EMAIL_PROVIDER=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_APP_PASSWORD=abcdefghijklmnop
   FRONTEND_URL=http://localhost:5173
   ```

4. **Restart Backend Server:**
   ```bash
   cd backend
   npm run dev
   ```

### For Other Providers (Outlook, Yahoo, Custom)

See `backend/EMAIL_SETUP_GUIDE.md` for detailed instructions.

---

## 🧪 Testing Email Verification

### Step 1: Register a New User

1. Go to `http://localhost:5173`
2. Click "Cadastre-se" or "Register"
3. Fill in the registration form
4. Submit the form

### Step 2: Check Backend Console

Look for:
```
📧 Email sent to user@example.com: <messageId>
```

### Step 3: Check Email Inbox

1. Open the email inbox for the registered email
2. Look for email from "EverWell" with subject "Verifique seu email - EverWell"
3. The email should contain:
   - Welcome message
   - Verification button
   - Verification link (can copy/paste)

### Step 4: Click Verification Link

1. Click the "Verificar Email" button in the email
2. OR copy/paste the verification link into browser
3. Should redirect to `http://localhost:5173/verify-email/{token}`
4. Frontend should show success message
5. User's email is now verified

### Step 5: Verify in Database (Optional)

Check MongoDB to confirm `emailVerified: true`:

```javascript
// In MongoDB shell or Compass
db.users.findOne({ email: "user@example.com" })
// Should show: emailVerified: true
```

---

## 🐛 Troubleshooting

### Problem: No Email Received

**Possible Causes:**

1. **Email not configured:**
   - ✅ Check backend console for warning message
   - ✅ Verify `.env` has `EMAIL_USER` and `EMAIL_APP_PASSWORD`
   - ✅ Restart backend server after adding env variables

2. **Email in spam folder:**
   - ✅ Check spam/junk folder
   - ✅ Mark as "Not Spam" if found

3. **Wrong email address:**
   - ✅ Verify user entered correct email
   - ✅ Check for typos

4. **Gmail App Password incorrect:**
   - ✅ Verify app password has no spaces
   - ✅ Regenerate app password if needed
   - ✅ Make sure 2-Step Verification is enabled

5. **SMTP connection error:**
   - ✅ Check internet connection
   - ✅ Verify email provider settings
   - ✅ Check backend console for error messages

### Problem: Verification Link Doesn't Work

**Possible Causes:**

1. **Link expired:**
   - ✅ Verification links expire after 24 hours
   - ✅ Request new verification email

2. **Link already used:**
   - ✅ Tokens can only be used once
   - ✅ Check if email is already verified

3. **Wrong FRONTEND_URL:**
   - ✅ Verify `FRONTEND_URL` in `.env` matches your frontend URL
   - ✅ Default is `http://localhost:5173`
   - ✅ Restart backend after changing

4. **Frontend route not set up:**
   - ✅ Verify `/verify-email/:token` route exists in frontend
   - ✅ Check `frontend/src/pages/VerifyEmail.jsx` exists

---

## 📝 Important Notes

1. **Email works the same in localhost and production:**
   - The code doesn't care if it's localhost or production
   - Emails are sent if email is configured
   - Verification links work the same way

2. **Verification links point to localhost:**
   - In localhost: `http://localhost:5173/verify-email/{token}`
   - In production: `https://yourdomain.com/verify-email/{token}`
   - Controlled by `FRONTEND_URL` environment variable

3. **Email is sent asynchronously:**
   - Registration doesn't wait for email to send
   - User gets response immediately
   - Email sending errors are logged but don't block registration

4. **Welcome email is also sent:**
   - User receives 2 emails: verification email + welcome email
   - Both are sent if email is configured

---

## 🔗 Related Files

- `backend/controllers/authController.js` - Registration and verification logic
- `backend/config/email.js` - Email sending configuration
- `backend/utils/emailTemplates.js` - Email templates
- `frontend/src/pages/VerifyEmail.jsx` - Frontend verification page
- `backend/EMAIL_SETUP_GUIDE.md` - Detailed email setup instructions

---

## ✅ Quick Checklist

- [ ] `EMAIL_USER` is set in `backend/.env`
- [ ] `EMAIL_APP_PASSWORD` (Gmail) or `EMAIL_PASSWORD` (other) is set
- [ ] `EMAIL_PROVIDER` is set (gmail, outlook, yahoo, or custom)
- [ ] `FRONTEND_URL` is set (optional, defaults to localhost:5173)
- [ ] Backend server is restarted after adding env variables
- [ ] Backend console shows "📧 Email sent" message
- [ ] Email is received in inbox (check spam folder)
- [ ] Verification link works when clicked
- [ ] User's email is verified in database

---

## 🆘 Still Having Issues?

1. **Check backend console** for error messages
2. **Verify email configuration** using test script:
   ```bash
   cd backend
   node scripts/test-gmail.js
   ```
3. **Check email provider documentation** for specific requirements
4. **Verify frontend route** is set up correctly
5. **Test with a different email provider** (e.g., Outlook instead of Gmail)

---

**Last Updated:** 2025-01-28

