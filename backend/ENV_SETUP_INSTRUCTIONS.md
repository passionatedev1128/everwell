# Environment Variables Setup Instructions

## ⚠️ IMPORTANT: Fix MongoDB Connection Error

The server is failing because `MONGO_URI` is not set. Follow these steps:

---

## Step 1: Edit the `.env` file

Open `backend/.env` and update these **REQUIRED** variables:

### 1. MongoDB URI (REQUIRED)

**Option A: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or log in
3. Create a free cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Replace `<dbname>` with `everwell`

Example:
```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/everwell?retryWrites=true&w=majority
```

**Option B: Local MongoDB**
1. Install MongoDB locally (https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Use this connection string:

```env
MONGO_URI=mongodb://localhost:27017/everwell
```

### 2. JWT Secret (REQUIRED)

Generate a secure random string for JWT_SECRET. You can use:

**Option A: Online Generator**
- Visit: https://randomkeygen.com/
- Copy a "CodeIgniter Encryption Keys" value

**Option B: Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Option B: PowerShell**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
```

Add to `.env`:
```env
JWT_SECRET=your_generated_secret_key_here_at_least_32_characters_long
```

---

## Step 2: Update `.env` file

Edit `backend/.env` and replace these values:

```env
# MongoDB Configuration (REQUIRED)
MONGO_URI=your_actual_mongodb_connection_string_here

# JWT Configuration (REQUIRED)
JWT_SECRET=your_generated_secret_key_here
```

---

## Step 3: Optional Variables (Can be set later)

These are optional and have defaults:

```env
PORT=5000                          # Server port (default: 5000)
NODE_ENV=development               # Environment (default: development)
FRONTEND_URL=http://localhost:5173 # Frontend URL for CORS
```

**Email Configuration (Optional - for email features)**
Only set these if you want email functionality:

```env
EMAIL_PROVIDER=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-app-password  # For Gmail, you need an App Password
```

---

## Step 4: Test the Connection

After updating `.env`, restart the server:

```bash
cd backend
npm start
```

You should see:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
🚀 Server running on port 5000
```

---

## Quick Setup Commands

### For MongoDB Atlas:
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `.env` with `MONGO_URI`

### For Local MongoDB:
1. Install MongoDB: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Use: `MONGO_URI=mongodb://localhost:27017/everwell`

### Generate JWT Secret:
```bash
# PowerShell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Troubleshooting

### Error: "MONGO_URI is undefined"
- ✅ Make sure `.env` file exists in `backend/` directory
- ✅ Check that `MONGO_URI=...` is in the `.env` file (no spaces around `=`)
- ✅ Make sure you didn't add quotes around the value

### Error: "MongoDB connection failed"
- ✅ Check your MongoDB URI is correct
- ✅ For Atlas: Make sure your IP is whitelisted
- ✅ For Atlas: Check your username and password
- ✅ For Local: Make sure MongoDB service is running

### Error: "JWT_SECRET is undefined"
- ✅ Make sure `JWT_SECRET=...` is in the `.env` file
- ✅ Generate a secure random string (at least 32 characters)

---

## Example `.env` file (Minimal)

```env
# REQUIRED - MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/everwell?retryWrites=true&w=majority

# REQUIRED - JWT Secret
JWT_SECRET=your_super_secret_key_here_at_least_32_characters_long_change_this_in_production

# Optional - Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

**After updating `.env`, restart your server!** 🚀

