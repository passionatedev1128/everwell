# SimplyBook Quick Setup Guide

## ✅ Current Status

The SimplyBook widget is **already integrated** into your EverWell site. You just need to add your Company ID!

## 📋 Setup Steps

### 1. Get Your SimplyBook Company ID

1. Go to [SimplyBook.me](https://simplybook.me/) and log in to your account
2. Navigate to **Settings** → **Widgets** → **Booking Widget**
3. Find your **Company ID** (it's the subdomain before `.simplybook.me`)
   - Example: If your SimplyBook URL is `https://everwell.simplybook.me`, your Company ID is `everwell`
   - Example: If your SimplyBook URL is `https://mycompany.simplybook.me`, your Company ID is `mycompany`

### 2. Add Company ID to Environment Variables

**For Local Development:**

Create or update `frontend/.env.local`:
```env
VITE_SIMPLYBOOK_COMPANY_ID=your-company-id-here
```

**For Production:**

Add the same variable to your hosting platform (Vercel, Netlify, etc.):
- Variable name: `VITE_SIMPLYBOOK_COMPANY_ID`
- Variable value: `your-company-id-here`

### 3. Test the Integration

1. Start your development server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Navigate to: `http://localhost:5173/agendar`

3. You should see the SimplyBook booking widget embedded in the page

## 🎯 How It Works

- **No external site needed** - The widget is embedded directly in your site at `/agendar`
- The widget loads from SimplyBook's servers using your Company ID
- All bookings are handled by SimplyBook
- The widget is styled to match EverWell's design (primary color: #4fb3a8)

## 📍 Where It's Used

The booking widget appears on:
- **Route**: `/agendar`
- **Header button**: "Agendar consulta" links to this page
- **Home page**: Multiple "Agendar consulta" buttons link here

## ⚙️ Current Configuration

The widget is configured with:
- **Theme**: Minimal (matches EverWell design)
- **Primary Color**: #4fb3a8 (EverWell teal)
- **Layout**: Modern timeline with top calendar
- **Language**: Portuguese (Brazil)

## 🔧 Troubleshooting

If the widget doesn't load:

1. **Check Company ID**: Make sure `VITE_SIMPLYBOOK_COMPANY_ID` is set correctly (no `.simplybook.me` suffix)
2. **Verify SimplyBook Account**: Ensure your SimplyBook account is active
3. **Check Console**: Open browser DevTools (F12) and check for errors
4. **Widget Enabled**: Verify the booking widget is enabled in your SimplyBook dashboard

## 📝 Example

If your SimplyBook account URL is:
```
https://everwell-brasil.simplybook.me
```

Then your `.env.local` should contain:
```env
VITE_SIMPLYBOOK_COMPANY_ID=everwell-brasil
```

**Note**: Only include the company name part, NOT the full URL!

---

That's it! Once you add your Company ID, the booking widget will work immediately. No external site or additional setup needed.

