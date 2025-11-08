# Quick Test Guide - Email Verification & Password Reset

## 🚀 Quick Start Testing

### 1. Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 2. Test Email Configuration

```bash
cd backend
npm run test-email
```

**Expected**: ✅ Email service configured successfully

---

## 📧 Test Email Verification

### Step 1: Register
1. Go to: `http://localhost:5173/login`
2. Click "Cadastre-se..."
3. Fill form with **real email** you can access
4. Submit

**Check**: 
- ✅ Toast: "Conta criada! Verifique seu email..."
- ✅ Check email inbox (2 emails should arrive)

### Step 2: Verify Email
1. Open verification email
2. Click "Verificar Email" button
3. Should see: ✅ "Email Verificado!"

**Check**: 
- ✅ Email verified successfully
- ✅ Redirected to login

---

## 🔑 Test Password Reset

### Step 1: Request Reset
1. Go to: `http://localhost:5173/login`
2. Click "Esqueceu a senha?"
3. Enter your email
4. Submit

**Check**: 
- ✅ Success message
- ✅ Reset email in inbox

### Step 2: Reset Password
1. Open reset email
2. Click "Redefinir Senha" button
3. Enter new password (min 6 chars)
4. Confirm password
5. Submit

**Check**: 
- ✅ "Senha Redefinida!" message
- ✅ Can login with new password

---

## 🧪 Quick API Tests

### Test Verification (replace TOKEN from email)
```bash
curl http://localhost:5000/api/auth/verify-email/TOKEN_HERE
```

### Test Password Reset Request
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com"}'
```

### Test Password Reset (replace TOKEN from email)
```bash
curl -X POST http://localhost:5000/api/auth/reset-password/TOKEN_HERE \
  -H "Content-Type: application/json" \
  -d '{"password":"newpassword123"}'
```

---

## ✅ Success Checklist

- [ ] Registration sends verification email
- [ ] Verification link works
- [ ] Password reset email received
- [ ] Password reset works
- [ ] Can login with new password
- [ ] Invalid tokens show errors

---

## 🐛 Common Issues

**No emails?**
- Check spam folder
- Run `npm run test-email` in backend
- Check `.env` email configuration

**Token not working?**
- Check if token expired (24h verification, 1h reset)
- Verify token in email link matches

**Frontend errors?**
- Check browser console
- Verify servers are running
- Check network tab for API errors

