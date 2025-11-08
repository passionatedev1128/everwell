# EverWell - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Git

### Step 1: Clone and Setup Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB URI and JWT secret
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/everwell
# JWT_SECRET=your_super_secret_key_here

# Start development server
npm run dev
```

Backend will run on: `http://localhost:5000`

### Step 2: Setup Frontend

```bash
# Navigate to frontend (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

### Step 3: Setup Gmail Email (Optional but Recommended)

For email notifications (registration, authorization, order updates):

1. **Get Gmail App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Enable 2-Step Verification if needed
   - Generate App Password for "Mail" → "EverWell"
   - Copy the 16-character password

2. **Add to `backend/.env`:**
   ```env
   EMAIL_PROVIDER=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_APP_PASSWORD=your-16-char-app-password
   ```

3. **Test Gmail Integration:**
   ```bash
   cd backend
   npm run test-email
   ```

**📖 Detailed Guide:** See `backend/GMAIL_SETUP_GUIDE.md`

---

### Step 4: Create Admin User

To create an admin user, you can either:

1. **Via MongoDB directly:**
   - Connect to your MongoDB database
   - Find a user in the `users` collection
   - Update: `{ role: "admin" }`

2. **Via code (temporary):**
   - Add a route in backend to create admin (remove after first use)
   - Or use MongoDB Compass/Atlas UI

### Step 4: Seed Initial Data (Optional)

You can create initial products, FAQs, and blogs via MongoDB or API:

```javascript
// Example: Create FAQ via API
POST /api/faqs
{
  "question": "O que é Cannabis Medicinal ?",
  "answer": "A cannabis medicinal refere-se ao uso...",
  "order": 1
}
```

## 📋 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=super_secret_key_here_change_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env - optional)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Testing the Application

1. **Test Registration:**
   - Go to `/login`
   - Create a new account with **any email provider** (Gmail, Outlook, Yahoo, custom domain, etc.)
   - ✅ The system accepts emails from ANY provider
   - Verify user is created with `isAuthorized: false`

2. **Test Product Access:**
   - Try to access `/produtos` → Should be blocked
   - Login as admin
   - Go to `/admin`
   - Authorize the user
   - User can now access products

3. **Test Public Pages:**
   - Home page loads all sections
   - FAQ page works
   - Blog page works

## 🔧 Troubleshooting

### Backend Issues
- **MongoDB Connection Error**: Check your MONGO_URI in .env
- **Port Already in Use**: Change PORT in .env
- **JWT Error**: Ensure JWT_SECRET is set

### Frontend Issues
- **API Connection Error**: Check VITE_API_URL matches backend URL
- **CORS Error**: Ensure FRONTEND_URL in backend .env matches frontend URL
- **Build Errors**: Run `npm install` again

## 📦 Production Deployment

### Backend (Render/Heroku)
1. Push code to GitHub
2. Connect to Render/Heroku
3. Set environment variables
4. Deploy

### Frontend (Vercel)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output: `dist`
4. Deploy

## ✅ Next Steps

1. Set up MongoDB Atlas database
2. Configure environment variables
3. Create admin user
4. Seed initial data (products, FAQs, blogs)
5. Test all flows
6. Deploy to production

