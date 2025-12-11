# MongoDB Atlas Migration Guide

This guide will help you migrate your local MongoDB database to MongoDB Atlas (cloud database).

---

## 📋 Prerequisites

- MongoDB Atlas account (free tier available)
- Local MongoDB database with data
- Node.js installed
- Access to your backend `.env` file

---

## 🚀 Step 1: Create MongoDB Atlas Account & Cluster

### 1.1 Sign Up for MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Try Free"** or **"Sign Up"**
3. Create an account (you can use Google, GitHub, or email)

### 1.2 Create a Free Cluster

1. After signing in, click **"Build a Database"**
2. Choose **"M0 FREE"** (Free Shared Cluster)
3. Select your preferred **Cloud Provider** (AWS, Google Cloud, or Azure)
4. Choose a **Region** closest to you
5. Name your cluster (e.g., "EverWell-Cluster")
6. Click **"Create"**

**Note:** Cluster creation takes 3-5 minutes

---

## 🔐 Step 2: Configure Database Access

### 2.1 Create Database User

1. In MongoDB Atlas dashboard, go to **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication method
4. Enter:
   - **Username**: `everwell-admin` (or your preferred username)
   - **Password**: Generate a strong password (click "Autogenerate Secure Password" or create your own)
   - **⚠️ IMPORTANT:** Save this password! You'll need it for the connection string
5. Under **"Database User Privileges"**, select **"Atlas admin"** (or "Read and write to any database")
6. Click **"Add User"**

### 2.2 Configure Network Access

1. Go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. For development, click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
   - **⚠️ For production, add only your server's IP address**
4. Click **"Confirm"**

---

## 🔗 Step 3: Get Connection String

1. Go back to **"Database"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **"Node.js"** as driver
5. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 3.1 Update Connection String

Replace the placeholders:
- Replace `<username>` with your database username (e.g., `everwell-admin`)
- Replace `<password>` with your database password
- Add database name at the end: `/everwell`

**Final connection string example:**
```
mongodb+srv://everwell-admin:YourPassword123@cluster0.xxxxx.mongodb.net/everwell?retryWrites=true&w=majority
```

---

## 📝 Step 4: Update Environment Variables

### 4.1 Update `backend/.env` File

Open `backend/.env` and add/update these variables:

```env
# MongoDB Atlas Connection String
ATLAS_MONGO_URI=mongodb+srv://everwell-admin:YourPassword123@cluster0.xxxxx.mongodb.net/everwell?retryWrites=true&w=majority

# Keep local MongoDB URI for migration (if using local MongoDB)
LOCAL_MONGO_URI=mongodb://localhost:27017/everwell

# After migration, update MONGO_URI to use Atlas
MONGO_URI=mongodb+srv://everwell-admin:YourPassword123@cluster0.xxxxx.mongodb.net/everwell?retryWrites=true&w=majority
```

**Important Notes:**
- Replace `everwell-admin` with your actual username
- Replace `YourPassword123` with your actual password
- Replace `cluster0.xxxxx.mongodb.net` with your actual cluster URL
- Keep `LOCAL_MONGO_URI` if you're migrating from local MongoDB

---

## 🔄 Step 5: Run Migration Script

### 5.1 Install Dependencies (if needed)

```bash
cd backend
npm install
```

### 5.2 Run Migration Script

```bash
node scripts/migrate-to-atlas.js
```

**What the script does:**
1. Connects to your local MongoDB database
2. Connects to MongoDB Atlas
3. Migrates all collections:
   - users
   - products
   - orders
   - blogs
   - faqs
   - bookings
   - feedback
   - notifications
   - auditlogs
4. Handles duplicates (skips existing documents)
5. Shows progress and summary

**Expected Output:**
```
🔄 Starting database migration from local MongoDB to MongoDB Atlas...

📡 Step 1: Connecting to local MongoDB...
✅ Connected to local MongoDB: mongodb://localhost:27017/everwell

📡 Step 2: Connecting to MongoDB Atlas...
✅ Connected to MongoDB Atlas

📦 Migrating collection: users...
   📄 Found 5 document(s)
   ✅ Inserted 5 document(s)
   ✅ Collection 'users' migrated successfully

... (continues for all collections)

✅ Migration completed successfully!
📊 Total documents migrated: 25
```

---

## ✅ Step 6: Verify Migration

### 6.1 Check MongoDB Atlas Dashboard

1. Go to MongoDB Atlas dashboard
2. Click **"Browse Collections"**
3. Verify all collections are present
4. Check document counts match your local database

### 6.2 Test Application Connection

1. Update `MONGO_URI` in `backend/.env` to use Atlas connection string
2. Restart your backend server:
   ```bash
   cd backend
   npm run dev
   ```
3. Check console for:
   ```
   ✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
   🚀 Server running on port 5000
   ```
4. Test your application:
   - Try logging in
   - Check if products load
   - Verify data is accessible

---

## 🔧 Step 7: Update Application (After Migration)

### 7.1 Final `.env` Configuration

After successful migration, your `backend/.env` should have:

```env
# MongoDB Atlas Connection (REQUIRED - This is the ONLY database used)
MONGO_URI=mongodb+srv://everwell-admin:YourPassword123@cluster0.xxxxx.mongodb.net/everwell?retryWrites=true&w=majority

# Remove these after migration (they're only for one-time migration):
# LOCAL_MONGO_URI=mongodb://localhost:27017/everwell
# ATLAS_MONGO_URI=mongodb+srv://everwell-admin:YourPassword123@cluster0.xxxxx.mongodb.net/everwell?retryWrites=true&w=majority
```

**Important:** 
- After migration, the project uses **ONLY MongoDB Atlas**
- Remove `LOCAL_MONGO_URI` and `ATLAS_MONGO_URI` from `.env`
- Keep only `MONGO_URI` pointing to Atlas
- Local MongoDB is no longer used

### 7.2 Restart Backend Server

```bash
cd backend
npm run dev
```

**Verify connection:**
- Check console output: Should show `✅ MongoDB Atlas Connected: cluster0-xxxxx.mongodb.net`
- If you see `localhost`, check your `MONGO_URI` in `.env`

---

## 🛠️ Troubleshooting

### Issue: Connection Timeout

**Solution:**
- Check Network Access in Atlas (Step 2.2)
- Verify your IP address is whitelisted
- Try "Allow Access from Anywhere" for testing

### Issue: Authentication Failed

**Solution:**
- Verify username and password in connection string
- Check if user has proper permissions (Atlas admin)
- Ensure password doesn't contain special characters that need URL encoding

### Issue: Migration Script Fails

**Solution:**
- Verify `LOCAL_MONGO_URI` is correct
- Verify `ATLAS_MONGO_URI` is correct
- Check local MongoDB is running (if using local)
- Ensure Node.js and mongoose are up to date

### Issue: Some Collections Missing

**Solution:**
- Check if collections exist in local database
- Verify collection names match (case-sensitive)
- Run migration script again (it will skip duplicates)

---

## 📊 Migration Checklist

- [ ] MongoDB Atlas account created
- [ ] Free cluster created and running
- [ ] Database user created with password
- [ ] Network access configured (IP whitelist)
- [ ] Connection string obtained and updated
- [ ] `ATLAS_MONGO_URI` added to `.env` (for migration)
- [ ] Migration script run successfully
- [ ] Data verified in Atlas dashboard
- [ ] `MONGO_URI` updated to Atlas connection string
- [ ] `LOCAL_MONGO_URI` and `ATLAS_MONGO_URI` removed from `.env`
- [ ] Backend server restarted and connected
- [ ] Verified connection shows Atlas hostname (not localhost)
- [ ] Application tested and working

---

## 🔒 Security Best Practices

1. **Never commit `.env` file** to version control
2. **Use strong passwords** for database users
3. **Restrict IP access** in production (don't use 0.0.0.0/0)
4. **Rotate passwords** periodically
5. **Use environment-specific** connection strings
6. **Enable MongoDB Atlas monitoring** and alerts

---

## 📚 Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Connection Strings](https://docs.mongodb.com/manual/reference/connection-string/)
- [MongoDB Atlas Free Tier Limits](https://www.mongodb.com/cloud/atlas/pricing)

---

## 🎉 Success!

Once migration is complete, your application will be using MongoDB Atlas cloud database. You can now:

- ✅ Access your database from anywhere
- ✅ Scale as needed
- ✅ Use MongoDB Atlas features (monitoring, backups, etc.)
- ✅ Deploy your application to production

**Need Help?** Check the troubleshooting section or MongoDB Atlas documentation.

