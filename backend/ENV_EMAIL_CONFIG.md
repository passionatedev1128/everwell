# Email Environment Variables Configuration

## 📧 Required Email Variables

Add these to your `backend/.env` file:

```env
# Email Provider
# Options: gmail, outlook, hotmail, yahoo, custom
EMAIL_PROVIDER=gmail

# Email Credentials
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-password
EMAIL_APP_PASSWORD=your-app-password  # Required for Gmail

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:5173

# Custom SMTP Settings (only if EMAIL_PROVIDER=custom)
# SMTP_HOST=smtp.example.com
# SMTP_PORT=587
# SMTP_SECURE=false
```

---

## Complete .env Example

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=super_secret_key_here_change_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Email Configuration
EMAIL_PROVIDER=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-password
EMAIL_APP_PASSWORD=your-app-password-for-gmail

# For custom SMTP (if EMAIL_PROVIDER=custom)
# SMTP_HOST=smtp.example.com
# SMTP_PORT=587
# SMTP_SECURE=false
```

---

## Quick Setup by Provider

### Gmail
```env
EMAIL_PROVIDER=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

### Outlook
```env
EMAIL_PROVIDER=outlook
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

### Yahoo
```env
EMAIL_PROVIDER=yahoo
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-app-password
```

### Custom SMTP
```env
EMAIL_PROVIDER=custom
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
```

