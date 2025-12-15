# ✅ .env File Created!

Your `frontend/.env` file has been created successfully!

## 📝 Next Steps

### 1. Open the `.env` file
Location: `frontend/.env`

### 2. Fill in your tracking IDs

You need to get these IDs from your accounts:

#### **GA4 Measurement ID** (Required for analytics)
1. Go to [Google Analytics](https://analytics.google.com)
2. Select your property
3. Click **Admin** (⚙️ icon, bottom left)
4. Under **Property**, click **Data Streams**
5. Click on your stream
6. Copy the **Measurement ID** (starts with `G-`)
7. Paste it in `.env`: `VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX`

#### **HubSpot Portal ID** (Required for CRM)
1. Go to [HubSpot](https://app.hubspot.com)
2. Click **Settings** (⚙️ icon, top right)
3. Under **Website**, click **Tracking Code**
4. Your Portal ID is in the URL or tracking code (8 digits)
   - Example URL: `https://js.hs-scripts.com/12345678.js`
   - Portal ID is: `12345678`
5. Paste it in `.env`: `VITE_HUBSPOT_PORTAL_ID=12345678`

#### **GTM Container ID** (Optional)
1. Go to [Google Tag Manager](https://tagmanager.google.com)
2. Select your container
3. Click **Admin** → **Container Settings**
4. Copy the **Container ID** (starts with `GTM-`)
5. Paste it in `.env`: `VITE_GTM_CONTAINER_ID=GTM-XXXXXXX`

### 3. Save the file

### 4. Restart your frontend server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
cd frontend
npm run dev
```

### 5. Verify it's working

1. Open your browser console (F12 → Console tab)
2. You should see:
   - ✅ `GA4: Initialized with measurement ID G-...`
   - ✅ `HubSpot: Initialized with portal ID ...`
   - ✅ `GTM: Initialized with container ID GTM-...` (if GTM is set)

## 📋 Example `.env` File

After filling in your IDs, it should look like:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Analytics & Tracking
VITE_GA4_MEASUREMENT_ID=G-05TH31T6CK
VITE_HUBSPOT_PORTAL_ID=12345678
VITE_GTM_CONTAINER_ID=GTM-XXXXXXX

# Booking Integration
VITE_SIMPLYBOOK_COMPANY_ID=everwell
```

## ⚠️ Important Notes

- **Don't commit `.env` to git** - It contains sensitive information
- **Restart server** after changing `.env` values
- **No quotes needed** - Just paste the ID directly: `VITE_GA4_MEASUREMENT_ID=G-123456` (not `"G-123456"`)

## 🆘 Troubleshooting

### Issue: "GA4: VITE_GA4_MEASUREMENT_ID not set"
- ✅ Make sure `.env` file is in `frontend/` directory
- ✅ Check variable name is exactly `VITE_GA4_MEASUREMENT_ID` (case-sensitive)
- ✅ Restart the dev server after adding variables
- ✅ No quotes around the value

### Issue: Tracking not working
- ✅ Check browser console for errors
- ✅ Verify IDs are correct (no typos)
- ✅ Make sure server was restarted after adding IDs

## 📚 More Help

- **Detailed Setup:** See `ENV_CONFIGURATION.md`
- **Integration Details:** See `../INTEGRATION_VERIFICATION.md`
- **Complete Guide:** See `../STEP_BY_STEP_CONFIGURATION_GUIDE.md`

---

**Once you've added your IDs and restarted the server, tracking will automatically work!** 🎉


