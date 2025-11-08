# Email Integration Setup Guide

## 📧 Email Service Configuration

The EverWell application supports multiple email providers: Gmail, Outlook, Yahoo, and custom SMTP servers.

---

## 🔧 Configuration

### Step 1: Add Email Settings to `.env`

Add these variables to your `backend/.env` file:

```env
# Email Configuration
EMAIL_PROVIDER=gmail                    # Options: gmail, outlook, hotmail, yahoo, custom
EMAIL_USER=your-email@gmail.com         # Your email address
EMAIL_PASSWORD=your-app-password        # Your email password or app password
EMAIL_APP_PASSWORD=your-app-password   # For Gmail (required)

# For custom SMTP (if EMAIL_PROVIDER=custom)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false                        # true for 465, false for 587

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:5173
```

---

## 📮 Provider-Specific Setup

### Gmail Setup

1. **Enable 2-Step Verification**:
   - Go to Google Account → Security
   - Enable 2-Step Verification

2. **Generate App Password**:
   - Go to Google Account → Security → App passwords
   - Create app password for "Mail"
   - Copy the 16-character password

3. **Configure `.env`**:
   ```env
   EMAIL_PROVIDER=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx  # The 16-char app password
   ```

### Outlook/Hotmail Setup

1. **Get Password**:
   - Use your regular Outlook/Hotmail password
   - Or create an app password if 2FA is enabled

2. **Configure `.env`**:
   ```env
   EMAIL_PROVIDER=outlook
   EMAIL_USER=your-email@outlook.com
   EMAIL_PASSWORD=your-password
   ```

### Yahoo Setup

1. **Generate App Password**:
   - Go to Account Security → Generate app password
   - Use this password (not your regular password)

2. **Configure `.env`**:
   ```env
   EMAIL_PROVIDER=yahoo
   EMAIL_USER=your-email@yahoo.com
   EMAIL_PASSWORD=your-app-password
   ```

### Custom SMTP Setup

For any other email provider:

```env
EMAIL_PROVIDER=custom
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
```

**Common SMTP Settings:**
- **Port 587**: TLS (SMTP_SECURE=false)
- **Port 465**: SSL (SMTP_SECURE=true)
- **Port 25**: Usually blocked by ISPs

---

## ✅ Testing Email Configuration

### Test via API

Once configured, test by registering a new user. You should receive a welcome email.

### Manual Test

Create a test script:

```javascript
// test-email.js
import { sendEmail, verifyEmailConfig } from './config/email.js';

async function test() {
  const verified = await verifyEmailConfig();
  if (verified) {
    await sendEmail({
      to: 'test@example.com',
      subject: 'Test Email',
      html: '<h1>Test</h1><p>This is a test email.</p>',
      text: 'This is a test email.'
    });
  }
}

test();
```

Run: `node test-email.js`

---

## 📨 Email Templates

The system includes these email templates:

1. **Welcome Email** - Sent on user registration
2. **Authorization Email** - Sent when user is authorized/deauthorized
3. **Document Upload Email** - Sent when user uploads a document
4. **Document Approved Email** - Sent when document is approved
5. **Order Confirmation** - Sent when order is created (future)
6. **Booking Confirmation** - Sent when booking is made (future)

---

## 🔄 Email Flow

### Registration Flow
1. User registers → Welcome email sent
2. User waits for authorization
3. Admin authorizes → Authorization email sent

### Document Upload Flow
1. User uploads document → Upload confirmation email
2. Admin reviews document
3. Document approved/rejected → Status email sent

---

## 🛠️ Troubleshooting

### Gmail Issues

**Error: "Invalid login"**
- Use App Password, not regular password
- Enable 2-Step Verification first
- Make sure "Less secure app access" is enabled (if app password doesn't work)

**Error: "Connection timeout"**
- Check firewall settings
- Verify internet connection

### Outlook Issues

**Error: "Authentication failed"**
- Use app password if 2FA is enabled
- Check if account is locked

### General Issues

**Emails not sending:**
1. Check `.env` variables are set correctly
2. Verify email configuration on server start
3. Check server logs for errors
4. Test with a simple email first

**Emails going to spam:**
- Add SPF/DKIM records to your domain
- Use a professional email address
- Avoid spam trigger words

---

## 📋 Environment Variables Summary

```env
# Required
EMAIL_PROVIDER=gmail                    # or outlook, yahoo, custom
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password

# Optional (for Gmail)
EMAIL_APP_PASSWORD=app-password

# Optional (for custom SMTP)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false

# Required for email links
FRONTEND_URL=http://localhost:5173      # or production URL
```

---

## ✅ Verification Checklist

- [ ] Email provider configured in `.env`
- [ ] Email credentials set correctly
- [ ] App password generated (for Gmail)
- [ ] Server starts without email errors
- [ ] Welcome email received on registration
- [ ] Authorization email received when authorized
- [ ] Document upload email received

---

**Email service is ready!** 📧✨

