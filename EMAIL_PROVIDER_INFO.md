# Email Provider Support - EverWell

## ✅ Universal Email Support

**The EverWell application accepts email addresses from ANY email provider!**

Users can register and sign in with:
- ✅ Gmail (@gmail.com)
- ✅ Outlook/Hotmail (@outlook.com, @hotmail.com)
- ✅ Yahoo (@yahoo.com)
- ✅ Custom domains (@company.com, @university.edu, etc.)
- ✅ Any other email provider

---

## 🔍 How It Works

### Backend Validation

The system uses standard email validation that accepts any valid email format:

1. **User Model** (`backend/models/User.js`):
   - Pattern: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
   - Accepts any valid email format
   - No domain restrictions

2. **Auth Routes** (`backend/routes/auth.js`):
   - Uses `express-validator`'s `isEmail()` function
   - Validates standard email format (RFC 5322)
   - No provider-specific restrictions

3. **Email Storage**:
   - All emails are stored in lowercase
   - No domain filtering or restrictions

### Frontend Validation

The frontend also accepts any email format:
- Pattern: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Standard HTML5 email input type
- No provider restrictions

---

## 📧 Email Service vs User Email

**Important Distinction:**

1. **User Email (Registration/Login)**:
   - Users can use ANY email provider
   - No restrictions on email domains
   - Works with Gmail, Outlook, Yahoo, custom domains, etc.

2. **Email Service (Sending Emails)**:
   - This is configured in `backend/.env`
   - Used to SEND emails FROM the application
   - Can be Gmail, Outlook, or any SMTP server
   - This is separate from user registration emails

**Example:**
- User registers with: `user@outlook.com` ✅ (works)
- Admin configures email service: `EMAIL_USER=admin@gmail.com` (for sending emails)
- These are independent!

---

## ✅ Supported Email Providers for Registration

Users can register with emails from:

### Popular Providers
- Gmail (@gmail.com, @googlemail.com)
- Outlook (@outlook.com, @hotmail.com, @live.com, @msn.com)
- Yahoo (@yahoo.com, @yahoo.com.br, @ymail.com)
- ProtonMail (@protonmail.com, @proton.me)
- AOL (@aol.com)
- iCloud (@icloud.com, @me.com, @mac.com)

### Business/Enterprise
- Microsoft 365 (@company.onmicrosoft.com)
- Google Workspace (@company.com)
- Any custom domain (@yourcompany.com)

### Educational
- University emails (@university.edu)
- School emails (@school.edu.br)

### International Providers
- Brazilian providers (@uol.com.br, @terra.com.br, etc.)
- Any country-specific email provider

### Any Other Provider
- Any valid email address format is accepted!

---

## 🔒 Security & Validation

The system validates:
- ✅ Email format (must have @ and domain)
- ✅ Email uniqueness (no duplicate emails)
- ✅ Standard email structure

The system does NOT:
- ❌ Restrict by domain
- ❌ Require specific providers
- ❌ Block any email providers
- ❌ Filter by country or region

---

## 📝 Examples of Accepted Emails

All of these work perfectly:

```
✅ user@gmail.com
✅ user@outlook.com
✅ user@yahoo.com
✅ user@company.com
✅ user@university.edu
✅ user@custom-domain.co.uk
✅ user.name+tag@example.org
✅ user_name@subdomain.example.com
```

---

## 🚀 How to Test

1. **Try registering with different email providers:**
   - Gmail: `test@gmail.com`
   - Outlook: `test@outlook.com`
   - Custom: `test@yourdomain.com`

2. **All should work!**

3. **Check the database:**
   - All emails are stored in lowercase
   - No domain restrictions in the database

---

## 💡 Technical Details

### Email Validation Pattern

```javascript
/^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

This pattern:
- Allows any characters before @ (local part)
- Requires @ symbol
- Allows any characters after @ (domain)
- Requires at least one dot in domain
- No provider-specific restrictions

### Backend Processing

```javascript
// Email is normalized to lowercase
email: email.toLowerCase()

// Stored as-is (no domain filtering)
// Example: user@outlook.com → stored as "user@outlook.com"
```

---

## ✅ Confirmation

**The EverWell application is provider-agnostic!**

- ✅ Users can register with any email
- ✅ Users can login with any email
- ✅ No provider restrictions
- ✅ Works with all email services worldwide

---

**Need help?** The system is already configured to accept any email provider. Just register with your preferred email address!

