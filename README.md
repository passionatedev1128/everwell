# EverWell - MERN Stack Application

Modern, compliant MERN web application for medical cannabis wellness platform.

## 🚀 Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT
- **Deployment**: Vercel (Frontend) + Render/Heroku (Backend)

## 📁 Project Structure

```
everwell/
├── backend/          # Express API
│   ├── config/       # Database configuration
│   ├── controllers/  # Route controllers
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   ├── middleware/   # Auth & error handling
│   └── server.js     # Entry point
│
└── frontend/         # React application
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── pages/       # Page components
    │   ├── utils/       # API & auth utilities
    │   └── App.jsx      # Main app component
    └── package.json
```

## 🛠️ Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=super_secret_key_here_change_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

4. Start development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start development server:
```bash
npm run dev
```

## 📋 API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Products (Protected + Authorized)
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/slug/:slug` - Get product by slug

### Blog (Public)
- `GET /api/blogs` - Get all published blogs
- `GET /api/blogs/:slug` - Get blog by slug

### FAQ (Public)
- `GET /api/faqs` - Get all active FAQs

### Admin (Admin Only)
- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/users/:id/authorize` - Toggle user authorization
- `GET /api/admin/auditlogs` - Get audit logs

## 🔐 Authentication Flow

1. User registers → `isAuthorized: false`
2. User logs in → Receives JWT token
3. User tries to access `/produtos` → Blocked (not authorized)
4. Admin authorizes user → `isAuthorized: true`
5. User can now access products

## 🎨 Design System

- **Primary Color**: `#1C6758`
- **Secondary Color**: `#3D8361`
- **Accent Color**: `#EEF2E6`
- **Text Dark**: `#1A1A1A`
- **Font**: Inter (SemiBold for headings, Regular for body)

## 📱 Routes

- `/` - Home page
- `/produtos` - Products (protected, requires authorization)
- `/duvidas` - FAQ page
- `/blog` - Blog list
- `/blog/:slug` - Blog detail
- `/login` - Login/Register
- `/admin` - Admin dashboard (admin only)

## ⚖️ Compliance

- Products are restricted per Anvisa RDC 327/2019 & 660/2022
- No product advertisement on public pages
- User authorization required for product access
- Legal disclaimers on all product-related pages
- Secure data handling (bcrypt, JWT, HTTPS)

## 🔗 External Integrations

- **Booking Widget**: `https://v0-booking-widget-frontend.vercel.app`
- **Consulta Médica**: `https://pro.quaddro.co/yourbestversion/servicos/vgwg3F`
- **Autorização Anvisa**: `https://pro.quaddro.co/yourbestversion/servicos/xUJjRT`
- **Formulário de Objetivos**: enviado internamente para `/api/leads/goals` com email de notificação
- **WhatsApp**: `https://wa.me/5521998170460`

## 🚀 Deployment

### Backend (Render/Heroku)
1. Set environment variables
2. Connect to MongoDB Atlas
3. Deploy

### Frontend (Vercel)
1. Connect repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

## 📝 Notes

- All text content preserved from original site
- Portuguese language throughout
- Mobile-responsive design
- SEO optimized

## ✅ Acceptance Criteria

- ✅ User cannot view `/produtos` before login + authorization
- ✅ All content from original site preserved
- ✅ Booking, formulário interno e WhatsApp plenamente funcionais
- ✅ Admin can toggle authorization successfully
- ✅ Fully responsive and mobile-friendly
- ✅ Passes Anvisa compliance checks

