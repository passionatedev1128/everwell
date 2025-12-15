# Testing Email Verification & Password Reset

This guide will help you test the email verification and password reset functionality.

## Prerequisites

1. **Email Configuration**: Make sure your email is configured in `backend/.env`:
   ```env
   EMAIL_PROVIDER=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_APP_PASSWORD=your-app-password
   FRONTEND_URL=http://localhost:5173
   ```

2. **Backend Running**: Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

3. **Frontend Running**: Start the frontend server:
   ```bash
   cd frontend
   npm run dev
   ```

---

## Test 1: Email Verification Flow

### Step 1: Register a New User

1. Open `http://localhost:5173/login`
2. Click "Cadastre-se e acesse os produtos disponíveis!"
3. Fill in the registration form:
   - Name: Test User
   - Email: **Use a real email address you can access**
   - Password: test123
4. Click "Criar Conta"

### Expected Results:
- ✅ Success toast: "Conta criada! Verifique seu email para ativar sua conta."
- ✅ You should receive **TWO emails**:
  1. **Verification Email** (subject: "Verifique seu email - EverWell")
  2. **Welcome Email** (subject: "Bem-vindo à EverWell!")

### Step 2: Verify Email

1. Check your email inbox
2. Open the **verification email**
3. Click the "Verificar Email" button (or copy the link)
4. You should be redirected to the verification page

### Expected Results:
- ✅ Green checkmark with "Email Verificado!"
- ✅ Success message
- ✅ Automatic redirect to login page after 3 seconds

### Step 3: Test Invalid/Expired Token

1. Try accessing: `http://localhost:5173/verify-email/invalid-token-12345`

### Expected Results:
- ✅ Red X with "Verificação Falhou"
- ✅ Error message: "Token de verificação inválido ou expirado."

---

## Test 2: Resend Verification Email

### Step 1: Login with Unverified Account

1. If you have an unverified account, login at `http://localhost:5173/login`
2. You should be logged in (verification is optional, not required for login)

### Step 2: Resend Verification (via API)

You can test this using:
- **Browser Console** (on any page after login):
  ```javascript
  fetch('http://localhost:5000/api/auth/resend-verification', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  })
  .then(r => r.json())
  .then(console.log);
  ```

### Expected Results:
- ✅ Response: `{ success: true, message: "Email de verificação reenviado..." }`
- ✅ New verification email in your inbox

---

## Test 3: Password Reset Flow

### Step 1: Request Password Reset

1. Go to `http://localhost:5173/login`
2. Click "Esqueceu a senha?"
3. Enter your email address
4. Click "Enviar Link de Redefinição"

### Expected Results:
- ✅ Success message: "Se o email existir, você receberá um link..."
- ✅ Password reset email in your inbox (subject: "Redefinir Senha - EverWell")

### Step 2: Reset Password

1. Check your email inbox
2. Open the **password reset email**
3. Click the "Redefinir Senha" button (or copy the link)
4. You should be redirected to the reset password page
5. Enter new password (min 6 characters)
6. Confirm new password
7. Click "Redefinir Senha"

### Expected Results:
- ✅ Green checkmark with "Senha Redefinida!"
- ✅ Success message
- ✅ Automatic redirect to login page after 3 seconds
- ✅ You can now login with the new password

### Step 3: Test Invalid/Expired Token

1. Try accessing: `http://localhost:5173/reset-password?token=invalid-token-12345`

### Expected Results:
- ✅ Error when submitting: "Token de redefinição inválido ou expirado."

---

## Test 4: Test with Different Email Providers

The system works with **any email provider**. Test with:

### Gmail
- Use a Gmail address
- Make sure you have App Password configured

### Outlook/Hotmail
- Use an Outlook or Hotmail address
- Update `.env`: `EMAIL_PROVIDER=outlook`

### Yahoo
- Use a Yahoo address
- Update `.env`: `EMAIL_PROVIDER=yahoo`

### Custom Domain
- Use any custom email domain
- Configure custom SMTP in `.env`

---

## Test 5: API Testing (Using cURL or Postman)

### Test Email Verification API

```bash
# Verify email
curl http://localhost:5000/api/auth/verify-email/YOUR_TOKEN_HERE
```

### Test Password Reset API

```bash
# Request password reset
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Reset password (replace TOKEN with actual token from email)
curl -X POST http://localhost:5000/api/auth/reset-password/TOKEN \
  -H "Content-Type: application/json" \
  -d '{"password":"newpassword123"}'
```

### Test Resend Verification

```bash
# Get token first by logging in
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Use the token from response
curl -X POST http://localhost:5000/api/auth/resend-verification \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

---

## Test 6: Edge Cases

### Test Expired Verification Token

1. Register a new user
2. Wait 24+ hours (or manually expire the token in database)
3. Try to verify with the old token

**Expected**: Error message about expired token

### Test Expired Reset Token

1. Request password reset
2. Wait 1+ hour (or manually expire the token in database)
3. Try to reset password with the old token

**Expected**: Error message about expired token

### Test Already Verified Email

1. Verify an email that's already verified
2. Try to verify again

**Expected**: Error or success (depending on implementation)

### Test Password Reset for Non-Existent Email

1. Go to reset password page
2. Enter an email that doesn't exist in the system
3. Submit

**Expected**: Same success message (security: doesn't reveal if email exists)

---

## Quick Test Checklist

- [ ] Registration sends verification email
- [ ] Verification link works and verifies email
- [ ] Invalid verification token shows error
- [ ] Password reset request sends email
- [ ] Password reset link works
- [ ] Can login with new password after reset
- [ ] Invalid reset token shows error
- [ ] Resend verification works
- [ ] Emails work with Gmail
- [ ] Emails work with Outlook (if configured)
- [ ] Emails work with Yahoo (if configured)
- [ ] Email templates look correct
- [ ] All links in emails work
- [ ] Token expiration works (24h for verification, 1h for reset)

---

## Troubleshooting

### No Emails Received?

1. **Check spam folder**
2. **Verify email configuration**:
   ```bash
   cd backend
   npm run test-email
   ```
3. **Check backend logs** for email sending errors
4. **Verify `.env` file** has correct email settings

### Email Sending Fails?

1. **Gmail**: Make sure you're using App Password, not regular password
2. **Outlook**: Check if 2FA is enabled (may need app password)
3. **Check backend console** for error messages
4. **Verify SMTP settings** in `.env`

### Token Not Working?

1. **Check token expiration** (24h for verification, 1h for reset)
2. **Verify token format** in email link
3. **Check database** to see if token exists and is valid
4. **Check backend logs** for token validation errors

### Frontend Not Loading?

1. **Check if frontend server is running**: `npm run dev` in `frontend/`
2. **Check browser console** for errors
3. **Verify routes** are correctly set up in `App.jsx`

---

## Database Verification

You can check the database to verify tokens:

```javascript
// In MongoDB shell or Compass
db.users.findOne({ email: "test@example.com" })

// Check these fields:
// - emailVerified: should be true after verification
// - emailVerificationToken: should be null after verification
// - resetPasswordToken: should be null after password reset
```

---

## Success Criteria

✅ **All tests pass**
✅ **Emails are received within 1-2 minutes**
✅ **Email templates look professional**
✅ **All links work correctly**
✅ **Error handling works properly**
✅ **Security measures are in place** (token expiration, no email enumeration)

---

## Next Steps

After testing:
1. Test with production email configuration
2. Test with different email providers
3. Test token expiration
4. Test concurrent requests
5. Test with invalid inputs
6. Performance testing (multiple emails)

