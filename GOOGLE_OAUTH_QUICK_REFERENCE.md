# Google OAuth - Quick Reference Card

## 🚀 Quick Setup (5 Minutes)

### 1. Google Cloud Console Setup
- Go to: https://console.cloud.google.com/
- Create project → Enable People API
- OAuth consent screen → Configure → Publish app
- Credentials → Create OAuth 2.0 Client ID
- Copy Client ID and Secret

### 2. Backend Configuration
Add to `backend/.env`:
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=/api/auth/google/callback
SESSION_SECRET=your-session-secret
FRONTEND_URL=http://localhost:5173
```

### 3. Test
- Start backend: `cd backend && npm run dev`
- Start frontend: `cd frontend && npm run dev`
- Go to: http://localhost:5173/login
- Click "Continuar com Google"

---

## 📝 Required URLs in Google Console

### Authorized JavaScript Origins:
```
http://localhost:5000
http://localhost:5173
https://your-production-domain.com (when deployed)
```

### Authorized Redirect URIs:
```
http://localhost:5000/api/auth/google/callback
https://your-production-domain.com/api/auth/google/callback (when deployed)
```

---

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| `redirect_uri_mismatch` | Check redirect URI matches exactly in Google Console |
| `access_denied` | Add your email as test user OR publish the app |
| Button doesn't work | Check backend is running and `.env` is configured |
| `Invalid client` | Verify Client ID and Secret in `.env` |

---

## ✅ Checklist

- [ ] Google Cloud project created
- [ ] People API enabled
- [ ] OAuth consent screen configured and published
- [ ] OAuth 2.0 credentials created
- [ ] Redirect URIs added correctly
- [ ] Backend `.env` updated
- [ ] Backend restarted
- [ ] Test user added (if Testing mode)

---

## 📖 Full Guide

See `GOOGLE_OAUTH_STEP_BY_STEP.md` for detailed instructions.

