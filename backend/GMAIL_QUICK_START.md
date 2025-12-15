# Gmail Integration - Quick Start

## 🚀 3-Step Setup

### Step 1: Enable 2-Step Verification & Get App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Enable 2-Step Verification if not already enabled
3. Generate App Password:
   - Select "Mail" → "Other (Custom name)"
   - Name: "EverWell"
   - Copy the 16-character password

### Step 2: Add to `.env` File

Open `backend/.env` and add:

```env
EMAIL_PROVIDER=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=abcdefghijklmnop
```

**Important:** Remove spaces from the app password if it has any.

### Step 3: Test

```bash
cd backend
npm run test-email
```

You should receive a test email!

---

## ✅ That's It!

Once the test email is received, Gmail integration is complete and all email features will work:
- User registration emails
- Authorization notifications
- Document upload confirmations
- Order status updates

---

**Need detailed instructions?** See `GMAIL_SETUP_GUIDE.md`

