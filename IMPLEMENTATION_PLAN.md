# EverWell - 4-Day MERN Stack Implementation Plan

## Project Overview
Transform EverWell from a Canva prototype into a full-stack MERN application with e-commerce, user authentication, document management, and marketing integrations.

## Database Schema (MongoDB)

### User Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed),
  name: String (required),
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  documents: {
    medicalPrescription: { url: String, uploadedAt: Date },
    importAuthorization: { url: String, uploadedAt: Date },
    proofOfResidence: { url: String, uploadedAt: Date }
  },
  role: String (default: 'customer'), // 'customer', 'admin'
  createdAt: Date,
  updatedAt: Date
}
```

### Product Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String,
  price: Number (required),
  image: String,
  stock: Number,
  isActive: Boolean (default: true),
  createdAt: Date
}
```

### Order Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  products: [{
    productId: ObjectId (ref: Product),
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  status: String, // 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'
  paymentProof: { url: String, uploadedAt: Date },
  shippingAddress: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Collection (SimplyBook integration)
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  simplyBookId: String,
  serviceName: String,
  appointmentDate: Date,
  status: String,
  createdAt: Date
}
```

---

## 4-Day Implementation Timeline

### DAY 1: Foundation & Backend Setup (8-10 hours)

#### Morning (4 hours)
1. **Project Initialization**
   - Create React app with Vite (faster than CRA)
   - Set up Express.js backend
   - Configure MongoDB Atlas connection
   - Set up environment variables (.env files)

2. **Backend Core Structure**
   - Express server setup with middleware (CORS, body-parser, morgan)
   - Database models (User, Product, Order, Booking)
   - File upload middleware (Multer for document storage)
   - Basic route structure

#### Afternoon (4-6 hours)
3. **Authentication System**
   - JWT-based authentication
   - Password hashing with bcrypt
   - Registration endpoint
   - Login endpoint
   - Protected route middleware
   - User profile endpoints

4. **Product Management**
   - Product CRUD endpoints (admin)
   - Product listing endpoint (public)
   - Product detail endpoint

---

### DAY 2: Frontend & User Dashboard (8-10 hours)

#### Morning (4 hours)
1. **React Application Structure**
   - Set up React Router
   - Create component structure (components, pages, layouts)
   - Set up state management (Context API or Zustand)
   - Create reusable UI components (Button, Input, Card, Modal)

2. **Authentication UI**
   - Login page
   - Registration page
   - Protected route wrapper
   - Auth context for user state

#### Afternoon (4-6 hours)
3. **User Dashboard**
   - Dashboard layout with sidebar navigation
   - Profile management page
   - Document upload interface
   - Document management (view, delete, upload new)
   - Booking history display (SimplyBook integration placeholder)

4. **Product Display**
   - Product listing page (public)
   - Product detail page
   - Restricted product area (requires login)

---

### DAY 3: E-commerce & Integrations (8-10 hours)

#### Morning (4 hours)
1. **E-commerce Implementation**
   - Shopping cart functionality (Context API)
   - Checkout page
   - Order creation endpoint
   - Payment proof upload
   - Order history in user dashboard
   - Order status tracking

2. **Document Management**
   - File upload to cloud storage (Cloudinary or AWS S3)
   - Document validation (file type, size)
   - Document preview functionality

#### Afternoon (4-6 hours)
3. **Marketing Integrations**
   - Google Analytics 4 setup
   - Google Tag Manager integration
   - Facebook Pixel implementation
   - Event tracking for:
     - User registration
     - Product views
     - Add to cart
     - Checkout initiation
     - Purchase completion
     - Document uploads

4. **SimplyBook Widget**
   - Embed SimplyBook widget
   - Create booking sync endpoint
   - Display bookings in user dashboard

---

### DAY 4: Polish, Email & Testing (8-10 hours)

#### Morning (4 hours)
1. **Email Automation**
   - Brevo (Sendinblue) integration
   - Welcome email on registration
   - Booking confirmation email
   - Order confirmation email
   - Order status update emails

2. **Customer Analytics Dashboard**
   - Booking statistics
   - Purchase history with charts
   - Document upload status
   - Account activity timeline

#### Afternoon (4-6 hours)
3. **UI/UX Improvements**
   - Modern color palette implementation
   - Responsive design (mobile-first)
   - Loading states and error handling
   - Success/error notifications
   - CTAs placement optimization

4. **Testing & Deployment Prep**
   - Test all user flows
   - Test authentication
   - Test document uploads
   - Test e-commerce flow
   - Test email automation
   - Test analytics tracking
   - Prepare deployment configuration
   - Create user documentation

---

## Technical Stack Details

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB Atlas (Free tier)
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer + Cloudinary (free tier)
- **Email**: Brevo (Sendinblue) - 300 emails/day free
- **Validation**: Joi or express-validator

### Frontend
- **Framework**: React 18+ with Vite
- **Routing**: React Router v6
- **State Management**: Context API + useReducer (or Zustand)
- **Styling**: Tailwind CSS (fast setup) or CSS Modules
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form

### Marketing Tools
- **Analytics**: Google Analytics 4 (gtag.js)
- **Tag Manager**: Google Tag Manager
- **Facebook Pixel**: Facebook Pixel code
- **Booking**: SimplyBook widget (iframe/script)

### Deployment (Recommendations)
- **Frontend**: Vercel or Netlify (free)
- **Backend**: Railway, Render, or Heroku (free tier)
- **Database**: MongoDB Atlas (free tier)
- **File Storage**: Cloudinary (free tier) or AWS S3

---

## Priority Features (Must Have)

1. ✅ User registration/login with JWT
2. ✅ Document upload (prescription, authorization, residence proof)
3. ✅ Product display (3 products)
4. ✅ Shopping cart & checkout
5. ✅ Payment proof upload
6. ✅ User dashboard
7. ✅ Google Analytics 4 + GTM
8. ✅ Facebook Pixel
9. ✅ SimplyBook widget
10. ✅ Email automation (Brevo)

## Nice-to-Have (If Time Permits)

- Admin dashboard for order management
- Email notifications for order status
- Product search/filter
- Order cancellation
- User profile photo upload
- Password reset functionality

---

## Risk Mitigation

1. **Time Constraints**: Focus on core features first, polish later
2. **File Storage**: Use Cloudinary free tier (25GB) instead of setting up S3
3. **Email Limits**: Brevo free tier (300/day) should be sufficient initially
4. **Testing**: Prioritize critical user flows (login, purchase, document upload)

---

## Development Workflow

1. **Day 1**: Backend API fully functional
2. **Day 2**: Frontend connected to backend, basic UI complete
3. **Day 3**: All integrations working, e-commerce functional
4. **Day 4**: Polish, testing, documentation

---

## Next Steps

1. Set up MongoDB Atlas account and database
2. Set up Cloudinary account for file storage
3. Set up Brevo account for email
4. Get Google Analytics 4 tracking ID
5. Get Facebook Pixel ID
6. Get SimplyBook widget code

