# User Registration - How Many Users Can Register?

## ✅ Quick Answer

**NO, multiple users CAN register!** There's **NO limit** on the number of users who can register on the site.

The only restriction is: **one email address = one account** (this is standard practice).

---

## 🔍 How Registration Works

### Multiple Users Can Register

✅ **User 1** registers with: `user1@gmail.com` → **Account created**  
✅ **User 2** registers with: `user2@outlook.com` → **Account created**  
✅ **User 3** registers with: `user3@yahoo.com` → **Account created**  
✅ **User 4** registers with: `user4@custom.com` → **Account created**  
✅ **Unlimited users** can register with different emails → **All accounts created**

### Email Uniqueness Check

The system checks if an email is already registered:

```javascript
// Check if user exists
const existingUser = await User.findOne({ email: email.toLowerCase() });
if (existingUser) {
  return res.status(400).json({
    success: false,
    message: 'Email já está em uso.'  // Email already in use
  });
}
```

**What this means:**
- ✅ Different emails → Different accounts → All can register
- ❌ Same email → Same account → Cannot register again

---

## 📋 Registration Rules

### ✅ Allowed

1. **Multiple users with different emails:**
   - `user1@gmail.com` → ✅ Registered
   - `user2@gmail.com` → ✅ Registered
   - `user3@outlook.com` → ✅ Registered
   - `user4@yahoo.com` → ✅ Registered
   - **No limit on number of users!**

2. **Any email provider:**
   - Gmail (`@gmail.com`) → ✅ Works
   - Outlook (`@outlook.com`) → ✅ Works
   - Yahoo (`@yahoo.com`) → ✅ Works
   - Custom domains (`@company.com`) → ✅ Works
   - Any valid email format → ✅ Works

3. **Multiple registrations:**
   - User 1 registers → ✅ Account created
   - User 2 registers → ✅ Account created
   - User 3 registers → ✅ Account created
   - **No limit on registrations!**

### ❌ Not Allowed

1. **Same email twice:**
   - `user1@gmail.com` → ✅ Registered
   - `user1@gmail.com` (again) → ❌ Error: "Email já está em uso."

2. **Duplicate email (case-insensitive):**
   - `user1@gmail.com` → ✅ Registered
   - `USER1@gmail.com` → ❌ Error: "Email já está em uso."
   - `User1@gmail.com` → ❌ Error: "Email já está em uso."

---

## 🗄️ Database Storage

### User Model

The `User` model has:

```javascript
email: {
  type: String,
  required: [true, 'Email é obrigatório'],
  unique: true,  // ← This ensures one email = one account
  lowercase: true,
  trim: true
}
```

**What `unique: true` means:**
- ✅ MongoDB ensures no duplicate emails in the database
- ✅ Each email can only have one account
- ✅ Multiple users can register with different emails
- ✅ No limit on total number of users

---

## 🔐 Authorization System

### Two-Step Process

1. **Registration:**
   - User registers → Account created
   - `isAuthorized: false` (default)
   - `emailVerified: false` (default)
   - User can log in but cannot access restricted areas

2. **Authorization:**
   - Admin authorizes user → `isAuthorized: true`
   - User can now access products and make purchases
   - Admin can authorize unlimited users

### Authorization vs Registration

**Registration:**
- ✅ Anyone can register (unlimited users)
- ✅ Multiple users can register
- ✅ No limit on registrations
- ✅ Each user needs a unique email

**Authorization:**
- ✅ Admin controls who can access products
- ✅ Admin can authorize unlimited users
- ✅ Admin can revoke authorization anytime
- ✅ Users must be authorized to purchase products

---

## 📊 Example Scenarios

### Scenario 1: Multiple Users Register

```
User 1: john@gmail.com → ✅ Registered → Pending authorization
User 2: mary@outlook.com → ✅ Registered → Pending authorization
User 3: bob@yahoo.com → ✅ Registered → Pending authorization
User 4: alice@custom.com → ✅ Registered → Pending authorization

Result: 4 users registered (all can register, no limit)
```

### Scenario 2: Same Email Twice

```
User 1: john@gmail.com → ✅ Registered
User 2: john@gmail.com → ❌ Error: "Email já está em uso."

Result: Only 1 user registered (email must be unique)
```

### Scenario 3: Case Variations

```
User 1: john@gmail.com → ✅ Registered
User 2: JOHN@gmail.com → ❌ Error: "Email já está em uso."
User 3: John@gmail.com → ❌ Error: "Email já está em uso."

Result: Only 1 user registered (emails are case-insensitive)
```

### Scenario 4: Unlimited Registrations

```
User 1: user1@gmail.com → ✅ Registered
User 2: user2@gmail.com → ✅ Registered
User 3: user3@gmail.com → ✅ Registered
...
User 1000: user1000@gmail.com → ✅ Registered

Result: 1000 users registered (no limit on registrations)
```

---

## 🎯 Key Points

1. **Multiple users CAN register:**
   - ✅ No limit on number of users
   - ✅ Each user needs a unique email
   - ✅ Standard practice: one email = one account

2. **Email uniqueness:**
   - ✅ Each email can only have one account
   - ✅ Case-insensitive (john@gmail.com = JOHN@gmail.com)
   - ✅ Prevents duplicate accounts

3. **Authorization system:**
   - ✅ Admin controls access to products
   - ✅ Admin can authorize unlimited users
   - ✅ Users must be authorized to purchase

4. **Registration flow:**
   - ✅ User registers → Account created
   - ✅ Email verification sent (if configured)
   - ✅ User waits for admin authorization
   - ✅ Admin authorizes → User can access products

---

## ❓ Common Questions

### Q: Can only one user register?

**A: NO!** Multiple users can register. There's no limit on the number of users who can register. Each user just needs a unique email address.

### Q: What if two users use the same email?

**A: The second registration will fail** with the error "Email já está em uso." (Email already in use). This is standard practice - one email = one account.

### Q: Is there a limit on registrations?

**A: NO!** There's no limit on the number of users who can register. You can have 1 user, 100 users, 1000 users, or unlimited users.

### Q: Can I register with any email?

**A: YES!** You can register with any valid email address from any provider (Gmail, Outlook, Yahoo, custom domains, etc.).

### Q: What happens after registration?

**A: After registration:**
1. User account is created
2. Email verification is sent (if email is configured)
3. User can log in but cannot access products
4. Admin must authorize user to access products
5. Once authorized, user can purchase products

### Q: Can the same person register multiple times?

**A: NO!** Each person can only have one account per email address. If they try to register again with the same email, they'll get an error.

### Q: What if I want to allow multiple accounts for the same person?

**A: They would need to use different email addresses.** For example:
- `john.personal@gmail.com` → Account 1
- `john.business@gmail.com` → Account 2
- `john+test@gmail.com` → Account 3 (Gmail allows plus addresses)

---

## 🔗 Related Files

- `backend/controllers/authController.js` - Registration logic
- `backend/models/User.js` - User model with email uniqueness
- `backend/routes/auth.js` - Registration route
- `frontend/src/pages/Login.jsx` - Registration form

---

## ✅ Summary

- ✅ **Multiple users CAN register** (no limit)
- ✅ **Each user needs a unique email** (one email = one account)
- ✅ **Any email provider works** (Gmail, Outlook, Yahoo, custom)
- ✅ **Admin controls authorization** (who can access products)
- ✅ **Standard practice** (one email = one account is normal)

**Bottom line:** The site supports unlimited user registrations. Each user just needs a unique email address. This is standard behavior for any registration system.

---

**Last Updated:** 2025-01-28


