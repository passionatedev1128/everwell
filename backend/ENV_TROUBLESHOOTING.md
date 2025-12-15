# Environment Variables Troubleshooting Guide

## Issue: Google OAuth Not Detected Even After Setting Variables

### Problem
You see the warning: `⚠️ Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env`

Even though you've added them to your `.env` file.

---

## ✅ Solution Checklist

### 1. Check Variable Names (Common Typo!)

**❌ WRONG:**
```env
GOOGLE_CLIENT_SECRE=...  # Missing 'T' at the end!
```

**✅ CORRECT:**
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

**Common typos to avoid:**
- `GOOGLE_CLIENT_SECRE` ❌ (should be `GOOGLE_CLIENT_SECRET`)
- `GOOGLE_CLIENT_ID` with extra spaces ❌
- Quotes around values ❌ (don't use quotes)

---

### 2. Check .env File Location

The `.env` file **MUST** be in the `backend/` folder:

```
backend/
├── .env          ← Must be here!
├── server.js
├── package.json
└── ...
```

**NOT** in:
- ❌ Root folder
- ❌ `backend/config/`
- ❌ Any other location

---

### 3. Check .env File Format

**✅ CORRECT Format:**
```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
GOOGLE_CALLBACK_URL=/api/auth/google/callback
SESSION_SECRET=your-session-secret-here
FRONTEND_URL=http://localhost:5173
```

**❌ WRONG Formats:**
```env
# Don't use quotes
GOOGLE_CLIENT_ID="123456789-..."  ❌

# Don't use spaces around =
GOOGLE_CLIENT_ID = 123456789-...  ❌

# Don't use comments on same line
GOOGLE_CLIENT_ID=123456789-... # my comment  ❌
```

---

### 4. Verify .env File is Being Loaded

Add this temporary debug code to `backend/server.js` after `dotenv.config()`:

```javascript
dotenv.config();

// Debug: Check if variables are loaded
console.log('🔍 Debug - Environment Variables:');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Not set');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Not set');
```

If it shows "Not set", the `.env` file isn't being loaded.

---

### 5. Restart Server After Changing .env

**IMPORTANT**: After changing `.env` file:
1. Stop the server (Ctrl+C)
2. Start it again: `npm run dev`

Environment variables are only loaded when the server starts!

---

### 6. Check for Hidden Characters

Sometimes copying from Google Console can add hidden characters:

1. Open `.env` in a plain text editor (Notepad, VS Code)
2. Delete the line with the variable
3. Type it again manually
4. Save and restart server

---

### 7. Verify File Encoding

Make sure `.env` file is saved as:
- **Encoding**: UTF-8
- **Line endings**: LF or CRLF (both work)

---

## 🔍 Debugging Steps

### Step 1: Verify .env File Exists

```bash
# In backend folder
dir .env
# or
ls -la .env
```

Should show the file exists.

### Step 2: Check File Contents

```bash
# Windows PowerShell
Get-Content .env | Select-String "GOOGLE"

# Should show:
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
```

### Step 3: Test Environment Loading

Create a test file `backend/test-env.js`:

```javascript
import dotenv from 'dotenv';
dotenv.config();

console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Set (hidden)' : 'Not set');
```

Run: `node test-env.js`

---

## 🐛 Common Issues

### Issue 1: Variables Not Loading

**Cause**: `.env` file in wrong location or dotenv not loading it

**Fix**: 
1. Make sure `.env` is in `backend/` folder
2. Check `dotenv.config()` is called in `server.js`
3. Restart server

### Issue 2: Typo in Variable Name

**Cause**: Misspelled variable name

**Fix**: Double-check spelling:
- `GOOGLE_CLIENT_ID` (not `GOOGLE_CLIENT_IDD` or `GOOGLE_CLIENTID`)
- `GOOGLE_CLIENT_SECRET` (not `GOOGLE_CLIENT_SECRE` or `GOOGLE_CLIENT_SECRETT`)

### Issue 3: Extra Spaces or Quotes

**Cause**: Formatting issues in `.env` file

**Fix**: Remove quotes and spaces:
```env
# Wrong
GOOGLE_CLIENT_ID = "123456789-..."
GOOGLE_CLIENT_ID="123456789-..."

# Correct
GOOGLE_CLIENT_ID=123456789-...
```

### Issue 4: Windows Script Error

**Cause**: PowerShell script execution issue

**Fix**: 
1. Run commands directly in terminal instead of scripts
2. Or use: `npm run dev` directly
3. Check if Node.js is in PATH

---

## ✅ Complete .env Example

Here's a complete example of what your `backend/.env` should look like:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/everwell

# JWT Configuration
JWT_SECRET=your-jwt-secret-key-here
JWT_EXPIRES_IN=7d

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Google OAuth Configuration
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
GOOGLE_CALLBACK_URL=/api/auth/google/callback

# Session Secret
SESSION_SECRET=your-session-secret-here

# Email Configuration (Optional)
EMAIL_PROVIDER=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-app-password
```

---

## 🎯 Quick Fix Checklist

- [ ] `.env` file is in `backend/` folder
- [ ] Variable names are spelled correctly (no typos)
- [ ] No quotes around values
- [ ] No spaces around `=` sign
- [ ] Server restarted after changing `.env`
- [ ] File saved and closed before restarting

---

## Still Not Working?

1. **Delete `.env` and recreate it** from scratch
2. **Copy values one by one** manually (don't copy-paste)
3. **Check for invisible characters** (try typing values manually)
4. **Verify in Google Console** that credentials are correct
5. **Check server logs** for any error messages

