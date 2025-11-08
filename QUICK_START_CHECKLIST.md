# EverWell - Quick Start Checklist

## Pre-Development Setup (Do This First!)

### 1. Accounts to Create
- [ ] **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
  - Create free cluster
  - Get connection string
  - Create database user

- [ ] **Cloudinary**: https://cloudinary.com/
  - Sign up for free account
  - Get API key, secret, and cloud name

- [ ] **Brevo (Sendinblue)**: https://www.brevo.com/
  - Sign up for free account
  - Get API key
  - Create email templates

- [ ] **Google Analytics 4**: https://analytics.google.com/
  - Create property
  - Get Measurement ID (G-XXXXXXXXXX)

- [ ] **Google Tag Manager**: https://tagmanager.google.com/
  - Create container
  - Get Container ID (GTM-XXXXXXX)

- [ ] **Facebook Pixel**: https://business.facebook.com/
  - Create pixel
  - Get Pixel ID

- [ ] **SimplyBook**: https://simplybook.me/
  - Get widget embed code
  - Configure booking widget

### 2. Deployment Accounts
- [ ] **Vercel** (Frontend): https://vercel.com/
- [ ] **Railway** or **Render** (Backend): https://railway.app/ or https://render.com/

---

## Environment Variables Needed

### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/everwell

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Brevo
BREVO_API_KEY=your-brevo-api-key
BREVO_SENDER_EMAIL=noreply@everwell.com
BREVO_SENDER_NAME=EverWell

# CORS
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_GTM_CONTAINER_ID=GTM-XXXXXXX
VITE_FB_PIXEL_ID=your-pixel-id
```

---

## Development Order

### Phase 1: Backend First (Day 1)
1. Initialize Express.js project
2. Set up MongoDB connection
3. Create models (User, Product, Order)
4. Create authentication routes
5. Create product routes
6. Create order routes
7. Create document upload route
8. Test with Postman

### Phase 2: Frontend Setup (Day 2)
1. Initialize React + Vite
2. Set up routing
3. Create auth pages
4. Create dashboard
5. Connect to backend
6. Test authentication flow

### Phase 3: E-commerce (Day 3)
1. Product pages
2. Shopping cart
3. Checkout
4. Order management
5. Marketing integrations
6. SimplyBook widget

### Phase 4: Polish (Day 4)
1. Email automation
2. Analytics dashboard
3. UI improvements
4. Testing
5. Bug fixes

---

## Key Files to Create

### Backend Structure
```
backend/
├── server.js
├── config/
│   ├── database.js
│   └── cloudinary.js
├── models/
│   ├── User.js
│   ├── Product.js
│   └── Order.js
├── routes/
│   ├── auth.js
│   ├── products.js
│   ├── orders.js
│   └── documents.js
├── middleware/
│   ├── auth.js
│   └── upload.js
└── controllers/
    ├── authController.js
    ├── productController.js
    └── orderController.js
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   └── Modal.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Products.jsx
│   │   └── Checkout.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── services/
│   │   └── api.js
│   └── App.jsx
```

---

## Testing Checklist

### Authentication
- [ ] User can register
- [ ] User can login
- [ ] Protected routes require auth
- [ ] JWT token expires correctly

### Documents
- [ ] User can upload medical prescription
- [ ] User can upload import authorization
- [ ] User can upload proof of residence
- [ ] User can view uploaded documents
- [ ] File size validation works
- [ ] File type validation works

### E-commerce
- [ ] Products display correctly
- [ ] Add to cart works
- [ ] Cart persists on refresh
- [ ] Checkout creates order
- [ ] Payment proof uploads
- [ ] Order appears in dashboard

### Integrations
- [ ] Google Analytics tracks page views
- [ ] Facebook Pixel tracks events
- [ ] SimplyBook widget loads
- [ ] Emails send correctly

### Mobile
- [ ] Responsive on phone
- [ ] Responsive on tablet
- [ ] Touch interactions work

---

## Deployment Checklist

### Before Deploy
- [ ] All environment variables set
- [ ] Database connection string updated
- [ ] CORS configured for production URL
- [ ] Error handling implemented
- [ ] Console.logs removed
- [ ] Build succeeds without errors

### After Deploy
- [ ] Test registration
- [ ] Test login
- [ ] Test document upload
- [ ] Test product purchase
- [ ] Verify analytics tracking
- [ ] Test email delivery

---

## Common Issues & Solutions

### Issue: MongoDB connection fails
**Solution**: Check connection string, whitelist IP in MongoDB Atlas

### Issue: File upload fails
**Solution**: Check Cloudinary credentials, verify file size limits

### Issue: CORS errors
**Solution**: Add frontend URL to CORS allowed origins

### Issue: JWT token invalid
**Solution**: Check JWT_SECRET matches, verify token expiration

### Issue: Email not sending
**Solution**: Check Brevo API key, verify sender email is verified

---

## Time-Saving Tips

1. **Use templates**: Don't build everything from scratch
2. **Copy-paste boilerplate**: Auth code, API calls, etc.
3. **Use libraries**: React Hook Form, Axios, etc.
4. **Test as you go**: Don't wait until the end
5. **Focus on core features**: Skip nice-to-haves initially

---

## Budget Breakdown

- **Infrastructure**: $0 (all free tiers)
- **Development Time**: 4 days × 8 hours = 32 hours
- **Hourly Rate**: $500 ÷ 32 = ~$15.63/hour

**Note**: This is a very tight budget. Focus on MVP features only.

---

## Next Steps After Launch

1. Monitor analytics
2. Collect user feedback
3. Fix critical bugs
4. Add admin dashboard
5. Consider payment gateway integration
6. SEO optimization
7. Performance optimization

