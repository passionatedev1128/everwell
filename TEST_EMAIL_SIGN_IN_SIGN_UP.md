# Testing Email Sign In and Sign Up - Step-by-Step Guide

This guide walks you through testing user registration (sign up) and login (sign in) functionality with email authentication.

---

## 📋 Prerequisites

### 1. Start Backend Server

```bash
cd backend
npm run dev
```

**Check:** Backend should be running on `http://localhost:5000`

**Expected console output:**
```
✅ Server running on port 5000
✅ MongoDB connected
✅ Email service configured successfully  (if email is configured)
```

### 2. Start Frontend Server

```bash
cd frontend
npm run dev
```

**Check:** Frontend should be running on `http://localhost:5173`

### 3. Verify Email Configuration (Optional but Recommended)

**Check backend console when starting:**
- ✅ If configured: `✅ Email service configured successfully`
- ❌ If NOT configured: `⚠️ Email not configured. Skipping email send.`

**If email is NOT configured:**
- Users can still register and log in
- But verification emails won't be sent
- See `EMAIL_VERIFICATION_LOCALHOST_GUIDE.md` for setup instructions

---

## 🧪 Test 1: Sign Up (User Registration)

### Step 1: Navigate to Login/Register Page

1. Open browser: `http://localhost:5173/login`
2. You should see the login form

### Step 2: Switch to Registration Mode

1. Click "Cadastre-se e acesse os produtos disponíveis!" link
   - OR click the toggle that switches to registration mode
2. Form should change to show:
   - Name field
   - Email field
   - Password field
   - "Criar Conta" button

### Step 3: Fill Registration Form

**Use a REAL email address you can access** (to test email verification):

```
Name: Test User
Email: your-test-email@gmail.com    ← Use your real email!
Password: test123456                ← Minimum 6 characters
```

### Step 4: Submit Registration

1. Click "Criar Conta" button
2. Form should show loading state (button disabled, spinner)

### Step 5: Check Frontend Response

**✅ Success Case:**
- Toast notification: **"Conta criada! Verifique seu email para ativar sua conta."**
- Form clears/resets
- User is redirected to homepage (`/`)
- User is automatically logged in

**❌ Error Cases:**

**Email already exists:**
- Toast: **"Email já está em uso."**
- Form clears (all fields)

**Invalid email format:**
- Validation error under email field: **"Email inválido. Use qualquer endereço de email válido (Gmail, Outlook, Yahoo, etc.)"**
- Form doesn't submit

**Password too short:**
- Validation error under password field
- Form doesn't submit

**Missing required fields:**
- Validation errors under missing fields
- Form doesn't submit

### Step 6: Check Backend Console

**✅ If Email is Configured:**
```
📧 Email sent to your-test-email@gmail.com: <messageId>
📧 Email sent to your-test-email@gmail.com: <messageId>
```

**Note:** You should see TWO email sends:
1. Verification email
2. Welcome email

**❌ If Email is NOT Configured:**
```
⚠️ Email not configured. Skipping email send.
   Set EMAIL_USER and EMAIL_APP_PASSWORD (or EMAIL_PASSWORD) in .env
```

### Step 7: Check Email Inbox

**If email is configured, check your inbox for TWO emails:**

1. **Verification Email:**
   - **Subject:** "Verifique seu email - EverWell"
   - **From:** The email address in your `.env` (EMAIL_USER)
   - **Content:**
     - Greeting with your name
     - "Verificar Email" button
     - Verification link (can copy/paste)
     - Note: Link expires in 24 hours

2. **Welcome Email:**
   - **Subject:** "Bem-vindo à EverWell!"
   - **From:** The email address in your `.env` (EMAIL_USER)
   - **Content:**
     - Welcome message
     - Information about the platform

**If emails are in spam folder:**
- Mark as "Not Spam"
- Add sender to contacts

---

## 🔐 Test 2: Email Verification

### Step 1: Open Verification Email

1. Go to your email inbox
2. Open the **verification email** (subject: "Verifique seu email - EverWell")
3. Find the verification link

### Step 2: Click Verification Link

**Option A: Click Button**
1. Click the **"Verificar Email"** button in the email

**Option B: Copy/Paste Link**
1. Copy the verification link (should look like: `http://localhost:5173/verify-email/{token}`)
2. Paste into browser address bar
3. Press Enter

### Step 3: Check Verification Page

**✅ Success Case:**
- Page shows: **✅ Email Verificado!**
- Green checkmark icon
- Success message
- Automatic redirect to login page after 3 seconds

**❌ Error Cases:**

**Invalid token:**
- Page shows: **❌ Verificação Falhou**
- Red X icon
- Error message: **"Token de verificação inválido ou expirado."**
- Link to go back to login

**Expired token (24+ hours):**
- Same as invalid token
- Token expires after 24 hours

### Step 4: Verify Email Status

**After successful verification:**
- User's email is marked as verified in database
- User can now log in normally
- No need to verify again

---

## 🔑 Test 3: Sign In (User Login)

### Step 1: Navigate to Login Page

1. Go to: `http://localhost:5173/login`
2. You should see the login form

### Step 2: Fill Login Form

**Use the credentials you just registered:**

```
Email: your-test-email@gmail.com    ← The email you registered with
Password: test123456                ← The password you set
```

### Step 3: Submit Login

1. Click "Entrar" or "Login" button
2. Form should show loading state

### Step 4: Check Frontend Response

**✅ Success Case:**
- Toast notification: **"Login realizado com sucesso!"**
- User is redirected to homepage (`/`)
- User is logged in (can see user menu/account icon)
- Can access protected routes (e.g., `/dashboard`)

**❌ Error Cases:**

**Invalid email:**
- Toast: **"Email ou senha inválidos."**
- Form clears (email and password)

**Invalid password:**
- Toast: **"Email ou senha inválidos."**
- Form clears (email and password)

**Email not verified (if verification required):**
- May show warning message
- User may be able to log in but with limited access

**Missing fields:**
- Validation errors under missing fields
- Form doesn't submit

### Step 5: Check Backend Console

**✅ Success:**
```
POST /api/auth/login 200
```

**❌ Error:**
```
POST /api/auth/login 401
Error: Invalid credentials
```

### Step 6: Verify Login State

**After successful login, verify:**

1. **User is logged in:**
   - Account icon/avatar visible in header
   - Can see user name/email in dropdown
   - Can access dashboard (`/dashboard`)

2. **Session persists:**
   - Refresh page → Still logged in
   - Close browser → Session may persist (depends on token expiry)
   - Token stored in localStorage

3. **Protected routes work:**
   - Can access `/dashboard`
   - Can access `/produtos` (if authorized)
   - Can access `/dashboard/pedidos`

4. **Unauthorized access blocked:**
   - Try accessing `/admin` → Should redirect (if not admin)
   - Products may not be visible (if not authorized)

---

## 🧪 Test 4: Error Scenarios

### Test 4.1: Register with Existing Email

1. Try registering again with the same email
2. **Expected:** Toast error: **"Email já está em uso."**

### Test 4.2: Login with Wrong Password

1. Enter correct email but wrong password
2. **Expected:** Toast error: **"Email ou senha inválidos."**

### Test 4.3: Login with Non-Existent Email

1. Enter email that doesn't exist in database
2. **Expected:** Toast error: **"Email ou senha inválidos."**

### Test 4.4: Invalid Email Format

1. Try registering/login with invalid email (e.g., `invalid-email`)
2. **Expected:** Validation error under email field

### Test 4.5: Password Too Short

1. Try registering with password less than 6 characters
2. **Expected:** Validation error under password field

### Test 4.6: Missing Required Fields

1. Try submitting form with empty fields
2. **Expected:** Validation errors for each missing field

---

## 📊 Checklist Summary

### Sign Up (Registration)
- [ ] Can navigate to registration form
- [ ] Form fields are visible (name, email, password)
- [ ] Can submit with valid data
- [ ] Success toast appears
- [ ] User redirected to homepage
- [ ] User automatically logged in
- [ ] Backend console shows email sends (if configured)
- [ ] Two emails received (verification + welcome)
- [ ] Error handling works (duplicate email, invalid format, etc.)

### Email Verification
- [ ] Verification email received
- [ ] Verification link works
- [ ] Verification page shows success
- [ ] Email marked as verified
- [ ] Invalid/expired token handled correctly

### Sign In (Login)
- [ ] Can navigate to login form
- [ ] Can login with correct credentials
- [ ] Success toast appears
- [ ] User redirected to homepage
- [ ] User session persists
- [ ] Can access protected routes
- [ ] Error handling works (wrong password, non-existent email, etc.)

---

## 🔍 Debugging Tips

### Issue: Emails Not Being Sent

**Check:**
1. Backend console for warnings about email configuration
2. `backend/.env` file has `EMAIL_USER` and `EMAIL_APP_PASSWORD`
3. Email service is properly configured (run `node backend/scripts/test-gmail.js`)
4. Check spam folder

**Fix:**
- Configure email in `backend/.env` (see `EMAIL_VERIFICATION_LOCALHOST_GUIDE.md`)
- Restart backend server after adding email config

### Issue: Verification Link Doesn't Work

**Check:**
1. Link format: `http://localhost:5173/verify-email/{token}`
2. Token is not expired (24-hour expiry)
3. Token hasn't been used already
4. Frontend route exists: `/verify-email/:token`

**Fix:**
- Make sure `FRONTEND_URL` in `.env` matches your frontend URL
- Check if token is valid (not expired or already used)

### Issue: Login Fails After Registration

**Check:**
1. Email is verified (if verification is required)
2. Password is correct
3. User exists in database
4. Backend console for error messages

**Fix:**
- Verify email first
- Check password is correct
- Check database for user record

### Issue: User Not Redirected After Login

**Check:**
1. `navigate('/')` is called in Login component
2. Protected route redirects work
3. Browser console for JavaScript errors

**Fix:**
- Check `frontend/src/pages/Login.jsx` for navigation logic
- Check for JavaScript errors in browser console

---

## 🎯 Quick Test Commands

### Test Email Configuration
```bash
cd backend
node scripts/test-gmail.js
```

### Test Registration API (curl)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123456"
  }'
```

### Test Login API (curl)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'
```

### Test Verification API (replace TOKEN from email)
```bash
curl http://localhost:5000/api/auth/verify-email/TOKEN_HERE
```

---

## 📝 Notes

1. **Email is optional:** Users can register and log in even if email is not configured. Verification emails just won't be sent.

2. **Email verification is not required for login:** Users can log in even if email is not verified (depends on implementation).

3. **Session persistence:** Login tokens are stored in localStorage and persist across browser sessions (until expiry or logout).

4. **Security:** Passwords are hashed with bcrypt and never stored in plain text.

5. **Analytics:** Registration and login events are tracked in GA4, HubSpot, and GTM (if configured).

---

## ✅ Success Criteria

**Sign Up:**
- ✅ User can register with any email provider
- ✅ Account is created in database
- ✅ Verification emails are sent (if configured)
- ✅ User is automatically logged in after registration
- ✅ Error handling works for invalid inputs

**Sign In:**
- ✅ User can login with correct credentials
- ✅ Session persists across page refreshes
- ✅ Protected routes are accessible
- ✅ Error handling works for invalid credentials

**Email Verification:**
- ✅ Verification emails are sent (if configured)
- ✅ Verification links work correctly
- ✅ Email status is updated in database
- ✅ Invalid/expired tokens are handled

---

**Last Updated:** 2025-01-28

