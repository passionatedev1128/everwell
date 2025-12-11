# Database Configuration - MongoDB Atlas

This project uses **MongoDB Atlas** (cloud database) exclusively. Local MongoDB is not used in production.

---

## 🔧 Configuration

### Required Environment Variable

Add to `backend/.env`:

```env
# MongoDB Atlas Connection String (REQUIRED)
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/everwell?retryWrites=true&w=majority
```

**Important:**
- Replace `username` with your MongoDB Atlas database username
- Replace `password` with your MongoDB Atlas database password
- Replace `cluster0.xxxxx.mongodb.net` with your actual cluster URL
- The database name is `everwell` (or your preferred name)

---

## 📡 How to Get MongoDB Atlas Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in to your account
3. Select your cluster
4. Click **"Connect"**
5. Choose **"Connect your application"**
6. Select **"Node.js"** as driver
7. Copy the connection string
8. Replace `<password>` with your actual password
9. Add database name: `/everwell` at the end

**Example:**
```
mongodb+srv://everwell-admin:YourPassword123@cluster0.xxxxx.mongodb.net/everwell?retryWrites=true&w=majority
```

---

## ✅ Verify Connection

After setting `MONGO_URI`, start your backend server:

```bash
cd backend
npm run dev
```

**Expected output:**
```
✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
🚀 Server running on port 5000
```

If you see the cluster hostname (not `localhost`), you're connected to MongoDB Atlas!

---

## 🔄 Migration from Local MongoDB

If you need to migrate data from a local MongoDB database, use the migration script:

```bash
cd backend
npm run migrate-to-atlas
```

**Note:** This script is for one-time migration only. After migration, the project uses only MongoDB Atlas.

---

## 🚫 Local MongoDB Not Used

This project does **NOT** use local MongoDB for:
- Development
- Production
- Any database operations

All database connections go to MongoDB Atlas.

---

## 🔒 Security Notes

1. **Never commit `.env` file** to version control
2. **Use strong passwords** for database users
3. **Restrict IP access** in production (don't use `0.0.0.0/0`)
4. **Rotate passwords** periodically
5. **Enable MongoDB Atlas monitoring** and alerts

---

## 📚 Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Connection Strings](https://docs.mongodb.com/manual/reference/connection-string/)
- [MongoDB Atlas Free Tier](https://www.mongodb.com/cloud/atlas/pricing)

