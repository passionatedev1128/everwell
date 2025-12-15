# How to Start Backend Server

## 🔍 The Problem

Your API URL is correct: `http://localhost:5000/api`

But you're getting `ERR_NAME_NOT_RESOLVED`, which means **the backend server is not running**.

---

## ✅ Solution: Start the Backend Server

### Step 1: Open Backend Directory

1. Open terminal/command prompt
2. Navigate to backend directory:
```bash
cd backend
```

**Or in Windows:**
```powershell
cd E:\My Workstation\projects\Workana_Updating Everwell_2025_10_28_Matheus_Brazil_own_ongoing\source\everwell\backend
```

---

### Step 2: Check if `.env` File Exists

**Required environment variables:**
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for authentication

**Check:**
```bash
# Check if .env exists
ls .env
# OR in Windows:
dir .env
```

**If `.env` doesn't exist:**
1. Create `backend/.env` file
2. Add minimum required variables:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/everwell
JWT_SECRET=your_super_secret_key_here_at_least_32_characters_long
PORT=5000
```

---

### Step 3: Install Dependencies (If Needed)

**If you haven't installed dependencies:**
```bash
npm install
```

---

### Step 4: Start the Server

**Option A: Development Mode (Recommended)**
```bash
npm run dev
```

**Option B: Production Mode**
```bash
npm start
```

---

### Step 5: Verify Server Started

**You should see:**
```
🚀 Server running on port 5000
📡 Environment: development
✅ MongoDB connected successfully
```

**If you see errors:**
- `MONGO_URI is not defined` → Add `MONGO_URI` to `.env`
- `JWT_SECRET is not defined` → Add `JWT_SECRET` to `.env`
- `Port 5000 already in use` → Another process is using port 5000

---

## 🚨 Common Issues

### Issue 1: MongoDB Connection Error

**Error:**
```
❌ MongoDB connection error: ...
```

**Solution:**
1. Check `MONGO_URI` in `backend/.env`
2. Verify MongoDB is accessible
3. Check if MongoDB Atlas IP whitelist includes your IP

---

### Issue 2: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
1. **Find what's using port 5000:**
   ```bash
   # Windows
   netstat -ano | findstr :5000
   
   # Mac/Linux
   lsof -i :5000
   ```

2. **Kill the process** or **change port** in `.env`:
   ```env
   PORT=5001
   ```
   Then update `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```

---

### Issue 3: Missing Dependencies

**Error:**
```
Cannot find module '...'
```

**Solution:**
```bash
npm install
```

---

## ✅ Verification Checklist

After starting the server:

- [ ] Backend terminal shows: `🚀 Server running on port 5000`
- [ ] No error messages in backend console
- [ ] MongoDB connection successful
- [ ] Try uploading document again
- [ ] Check browser console - should NOT see `ERR_NAME_NOT_RESOLVED`

---

## 📋 Quick Start Commands

**Full sequence:**
```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies (if needed)
npm install

# 3. Start server
npm run dev
```

**Keep this terminal open** - The server needs to keep running!

---

## 💡 Pro Tips

1. **Keep backend terminal open** - Server stops if you close it
2. **Check backend console** - Errors appear there
3. **Use `npm run dev`** - Better for development (auto-restart on changes)
4. **Check MongoDB connection** - Server won't start if MongoDB fails

---

## 🎯 What to Do Now

1. **Open a new terminal**
2. **Navigate to backend directory**
3. **Run:** `npm run dev`
4. **Wait for:** `🚀 Server running on port 5000`
5. **Try uploading document again**

The error should be fixed! 🎉

