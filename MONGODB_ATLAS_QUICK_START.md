# MongoDB Atlas Quick Start Guide

Quick reference for migrating to MongoDB Atlas.

---

## 🚀 Quick Steps

### 1. Create MongoDB Atlas Account
- Go to: https://www.mongodb.com/cloud/atlas
- Sign up (free tier available)
- Create M0 FREE cluster

### 2. Configure Access
- **Database Access**: Create user with password
- **Network Access**: Add IP `0.0.0.0/0` (for development) or your server IP

### 3. Get Connection String
- Click "Connect" → "Connect your application"
- Copy connection string
- Replace `<username>`, `<password>`, and add `/everwell` at the end

**Example:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/everwell?retryWrites=true&w=majority
```

### 4. Update `.env` File

Add to `backend/.env`:

```env
# MongoDB Atlas Connection (REQUIRED - This is the main database)
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/everwell?retryWrites=true&w=majority

# Optional: Only needed if migrating from local MongoDB (one-time use)
# LOCAL_MONGO_URI=mongodb://localhost:27017/everwell
# ATLAS_MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/everwell?retryWrites=true&w=majority
```

**Note:** After migration, you only need `MONGO_URI` pointing to Atlas.

### 5. (Optional) Run Migration (If migrating from local MongoDB)

If you have data in a local MongoDB database:

```bash
cd backend
npm run migrate-to-atlas
```

**After migration:** Remove `LOCAL_MONGO_URI` and `ATLAS_MONGO_URI` from `.env` - only keep `MONGO_URI`.

### 6. Restart Server

```bash
npm run dev
```

---

## ✅ Verify Migration

1. Check MongoDB Atlas dashboard → "Browse Collections"
2. Verify all collections are present
3. Check document counts
4. Test your application

---

## 📚 Full Guide

See `MONGODB_ATLAS_MIGRATION_GUIDE.md` for detailed instructions.

---

## 🆘 Troubleshooting

**Connection failed?**
- Check Network Access (IP whitelist)
- Verify username/password
- Check connection string format

**Migration failed?**
- Verify `LOCAL_MONGO_URI` is correct
- Verify `ATLAS_MONGO_URI` is correct
- Check local MongoDB is running

