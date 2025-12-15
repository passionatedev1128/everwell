# Frontend & Backend Checklist (Excluding HubSpot & GA4 Tracking)

## 🎯 Overview

This checklist covers all frontend and backend features based on client requirements, **excluding** HubSpot and Google Analytics tracking code.

---

## 📱 FRONTEND CHECKLIST

### ✅ Authentication & User Management

#### Login Page (`Login.jsx`)
- [ ] Email/password login form
- [ ] Google OAuth login button
- [ ] Form validation (email format, required fields)
- [ ] Error handling and display
- [ ] Loading states during login
- [ ] Redirect to dashboard after successful login
- [ ] "Forgot password" link
- [ ] "Don't have account? Register" link
- [ ] Remember me / Stay logged in functionality

#### Registration Page (`Login.jsx` - registration mode)
- [ ] Registration form (name, email, password, confirm password)
- [ ] Form validation (email format, password strength, matching passwords)
- [ ] Error handling and display
- [ ] Loading states during registration
- [ ] Email verification message after registration
- [ ] Redirect to email verification page
- [ ] "Already have account? Login" link

#### Email Verification (`VerifyEmail.jsx`)
- [ ] Display verification status
- [ ] Resend verification email button
- [ ] Success message after verification
- [ ] Redirect to login after verification
- [ ] Error handling for invalid/expired tokens

#### Password Reset (`ResetPassword.jsx`)
- [ ] Password reset form
- [ ] New password and confirm password fields
- [ ] Form validation (password strength, matching passwords)
- [ ] Error handling and display
- [ ] Success message after password reset
- [ ] Redirect to login after reset
- [ ] Token validation

#### OAuth Callback (`OAuthCallback.jsx`)
- [ ] Handle Google OAuth callback
- [ ] Process OAuth response
- [ ] Create/update user account
- [ ] Redirect to dashboard after success
- [ ] Error handling for OAuth failures

---

### ✅ User Dashboard (`Dashboard.jsx`)

#### Profile Management
- [ ] Display user information (name, email, role)
- [ ] Edit profile form
- [ ] Update profile functionality
- [ ] Success/error messages
- [ ] Loading states

#### Document Management
- [ ] Display document upload section
- [ ] Three document types:
  - [ ] Medical Prescription (Receita Médica)
  - [ ] Import Authorization (Autorização de Importação - Anvisa)
  - [ ] Proof of Residence (Comprovante de Residência)
- [ ] Document upload functionality
- [ ] File type validation (PDF, DOC, DOCX only)
- [ ] File size validation (max 10MB)
- [ ] Upload progress indicator
- [ ] Display uploaded documents
- [ ] Document status display (Pending, Approved, Rejected)
- [ ] View/download uploaded documents
- [ ] Replace document functionality
- [ ] Success/error messages

#### Order History
- [ ] Display list of user orders
- [ ] Order status display
- [ ] Order details view
- [ ] Order date and total
- [ ] Filter orders by status
- [ ] Empty state when no orders
- [ ] Loading states

---

### ✅ E-commerce Features

#### Products Page (`Products.jsx`)
- [ ] Display product list
- [ ] Product cards with image, name, price
- [ ] Product category display
- [ ] "Add to Cart" button
- [ ] Product search functionality (if implemented)
- [ ] Product filtering (if implemented)
- [ ] Loading states
- [ ] Empty states
- [ ] Protected route (requires login)

#### Product Detail Page (`ProductDetail.jsx`)
- [ ] Display product details (image, name, description, price)
- [ ] Product information display
- [ ] Quantity selector
- [ ] "Add to Cart" button
- [ ] "Buy Now" button (if implemented)
- [ ] Related products (if implemented)
- [ ] Loading states
- [ ] Error handling
- [ ] Protected route (requires login)

#### Shopping Cart (`Cart.jsx`)
- [ ] Display cart items
- [ ] Product name, image, price, quantity
- [ ] Update quantity functionality
- [ ] Remove item from cart
- [ ] Subtotal calculation
- [ ] Total calculation
- [ ] "Continue Shopping" button
- [ ] "Proceed to Checkout" button
- [ ] Empty cart state
- [ ] Loading states
- [ ] Cart persistence (localStorage/sessionStorage)

#### Checkout Page (`Checkout.jsx`)
- [ ] Shipping address form:
  - [ ] Street and number
  - [ ] City
  - [ ] State
  - [ ] ZIP code
  - [ ] Country
- [ ] Form validation
- [ ] Order summary display
- [ ] Cart items list
- [ ] Subtotal, shipping, total
- [ ] "Confirm Order" button
- [ ] Loading states during order creation
- [ ] Success message after order creation
- [ ] Redirect to orders page after success
- [ ] Error handling
- [ ] Payment proof upload info/instructions

---

### ✅ Orders Management (`Orders.jsx`)

#### Order List
- [ ] Display all user orders
- [ ] Order ID, date, status, total
- [ ] Order status badges/indicators
- [ ] Filter by status (All, Pending, Processing, Completed, Cancelled)
- [ ] Sort by date (newest/oldest)
- [ ] Pagination (if implemented)
- [ ] Loading states
- [ ] Empty state

#### Order Details
- [ ] Order information (ID, date, status, total)
- [ ] Shipping address display
- [ ] Order items list (product, quantity, price)
- [ ] Order status timeline (if implemented)
- [ ] Payment proof upload section
- [ ] Upload payment proof functionality
- [ ] View uploaded payment proof
- [ ] Order actions (cancel, if implemented)

---

### ✅ Admin Panel (`Admin.jsx`)

#### User Management
- [ ] Display all users list
- [ ] User information (name, email, role, status)
- [ ] Search users functionality
- [ ] Filter users (by role, status)
- [ ] Toggle user authorization
- [ ] Delete user functionality
- [ ] User details view
- [ ] Loading states

#### Product Management
- [ ] Display all products list
- [ ] Product information (name, price, category, status)
- [ ] Add new product
- [ ] Edit product
- [ ] Delete product
- [ ] Product image upload
- [ ] Form validation
- [ ] Loading states

#### Order Management
- [ ] Display all orders list
- [ ] Order information (ID, user, date, status, total)
- [ ] Filter orders (by status, user, date)
- [ ] Search orders
- [ ] Update order status
- [ ] Order details view
- [ ] Bulk status update (if implemented)
- [ ] Export orders (if implemented)
- [ ] Loading states

#### Document Management
- [ ] Display pending documents
- [ ] Document information (user, type, upload date)
- [ ] View document
- [ ] Approve document
- [ ] Reject document
- [ ] Add rejection reason (if implemented)
- [ ] Filter by document type
- [ ] Filter by status
- [ ] Loading states

#### Audit Logs (if implemented)
- [ ] Display audit log entries
- [ ] Filter by action type
- [ ] Filter by user
- [ ] Filter by date
- [ ] Export logs (if implemented)

---

### ✅ Content Pages

#### Home Page (`Home.jsx`)
- [ ] Hero section
- [ ] Value proposition section
- [ ] Features section
- [ ] Process/How it works section
- [ ] Products preview section
- [ ] Testimonials section
- [ ] FAQ section (or link to FAQ page)
- [ ] CTA buttons
- [ ] Goal form component
- [ ] Responsive design
- [ ] Smooth scrolling
- [ ] Animations (if implemented)

#### Blog Page (`Blog.jsx`)
- [ ] Display blog posts list
- [ ] Blog post cards (title, excerpt, date, author)
- [ ] Pagination
- [ ] Search functionality (if implemented)
- [ ] Category filter (if implemented)
- [ ] Loading states
- [ ] Empty state

#### Blog Post Detail (`BlogPost.jsx`)
- [ ] Display full blog post
- [ ] Title, content, author, date
- [ ] Featured image
- [ ] Related posts (if implemented)
- [ ] Share buttons (if implemented)
- [ ] Comments section (if implemented)
- [ ] Loading states

#### FAQ Page (`Doubts.jsx`)
- [ ] Display FAQ list
- [ ] Accordion/collapsible FAQ items
- [ ] Search functionality (if implemented)
- [ ] Category grouping (if implemented)
- [ ] Loading states

#### Booking Page (`Booking.jsx`)
- [ ] SimplyBook widget integration
- [ ] Widget container
- [ ] Loading states
- [ ] Error handling if widget fails to load

---

### ✅ Shared Components

#### Header (`Header.jsx`)
- [ ] Logo
- [ ] Navigation menu
- [ ] User menu (when logged in)
- [ ] Cart icon with item count
- [ ] Login/Register buttons (when not logged in)
- [ ] Logout button
- [ ] Mobile menu (hamburger)
- [ ] Responsive design
- [ ] Active route highlighting

#### Footer (`Footer.jsx`)
- [ ] Company information
- [ ] Links (About, Products, FAQ, Contact)
- [ ] Social media links
- [ ] Copyright notice
- [ ] Responsive design

#### Product Card (`ProductCard.jsx`)
- [ ] Product image
- [ ] Product name
- [ ] Product price
- [ ] "Add to Cart" button
- [ ] Link to product detail
- [ ] Hover effects
- [ ] Loading state (skeleton)

#### Document Upload (`DocumentUpload.jsx`)
- [ ] File upload input
- [ ] File type validation
- [ ] File size validation
- [ ] Upload progress
- [ ] Success/error messages
- [ ] Display uploaded file
- [ ] Replace file functionality
- [ ] Document status display

#### Payment Proof Upload (`PaymentProofUpload.jsx`)
- [ ] File upload input
- [ ] File type validation (PDF, DOC, DOCX)
- [ ] File size validation (max 10MB)
- [ ] Upload progress
- [ ] Success/error messages
- [ ] Display uploaded file
- [ ] Replace file functionality

#### Goal Form (`GoalForm.jsx`)
- [ ] Form fields (as per requirements)
- [ ] Form validation
- [ ] Submit button
- [ ] Success message
- [ ] Error handling
- [ ] Loading states

#### Profile Form (`ProfileForm.jsx`)
- [ ] Name field
- [ ] Email field (read-only or editable)
- [ ] Update button
- [ ] Form validation
- [ ] Success/error messages
- [ ] Loading states

#### Protected Route (`ProtectedRoute.jsx`)
- [ ] Check if user is authenticated
- [ ] Redirect to login if not authenticated
- [ ] Check user authorization (for admin routes)
- [ ] Loading state while checking

#### Loading Components
- [ ] LoadingButton component
- [ ] SkeletonLoader component
- [ ] Spinner component
- [ ] Loading states for all async operations

#### Empty States (`EmptyState.jsx`)
- [ ] Empty cart state
- [ ] No orders state
- [ ] No products state
- [ ] No documents state
- [ ] Appropriate messages and icons

#### Error Handling
- [ ] Error message component
- [ ] Toast notifications (react-hot-toast)
- [ ] Form validation errors
- [ ] API error handling
- [ ] Network error handling
- [ ] 404 page (if implemented)

---

### ✅ UI/UX Features

#### Responsive Design
- [ ] Mobile layout (< 768px)
- [ ] Tablet layout (768px - 1024px)
- [ ] Desktop layout (> 1024px)
- [ ] Navigation menu responsive
- [ ] Forms responsive
- [ ] Tables responsive (admin panel)
- [ ] Images responsive

#### Loading States
- [ ] Page loading states
- [ ] Button loading states
- [ ] Form submission loading
- [ ] Data fetching loading
- [ ] Skeleton loaders

#### Animations & Transitions
- [ ] Page transitions
- [ ] Button hover effects
- [ ] Card hover effects
- [ ] Form field focus effects
- [ ] Smooth scrolling
- [ ] Fade in/out animations

#### Form Validation
- [ ] Real-time validation
- [ ] Error messages display
- [ ] Success indicators
- [ ] Required field indicators
- [ ] Input format validation

#### Accessibility
- [ ] Alt text for images
- [ ] ARIA labels
- [ ] Keyboard navigation
- [ ] Focus indicators
- [ ] Screen reader support

---

## 🔧 BACKEND CHECKLIST

### ✅ Authentication & Authorization

#### Auth Controller (`authController.js`)
- [ ] User registration endpoint
- [ ] Email/password login endpoint
- [ ] Google OAuth login endpoint
- [ ] Get current user endpoint
- [ ] Email verification endpoint
- [ ] Resend verification email endpoint
- [ ] Forgot password endpoint
- [ ] Reset password endpoint
- [ ] JWT token generation
- [ ] Password hashing (bcrypt)
- [ ] Email verification token generation
- [ ] Password reset token generation
- [ ] Token expiration handling
- [ ] Error handling

#### Auth Routes (`auth.js`)
- [ ] POST `/api/auth/register`
- [ ] POST `/api/auth/login`
- [ ] GET `/api/auth/me`
- [ ] GET `/api/auth/google`
- [ ] GET `/api/auth/google/callback`
- [ ] GET `/api/auth/verify-email/:token`
- [ ] POST `/api/auth/resend-verification`
- [ ] POST `/api/auth/forgot-password`
- [ ] POST `/api/auth/reset-password/:token`
- [ ] Route protection middleware

#### Auth Middleware (`auth.js`)
- [ ] JWT token verification
- [ ] User authentication check
- [ ] Admin authorization check
- [ ] Error handling for invalid tokens
- [ ] Error handling for expired tokens

---

### ✅ User Management

#### User Controller (`userController.js`)
- [ ] Get user profile endpoint
- [ ] Update user profile endpoint
- [ ] Upload document endpoint
- [ ] Get user documents endpoint
- [ ] Update document status (admin)
- [ ] Delete user endpoint (admin)
- [ ] Get all users endpoint (admin)
- [ ] Toggle user authorization (admin)
- [ ] User validation
- [ ] File upload handling
- [ ] Error handling

#### User Routes (`users.js`)
- [ ] GET `/api/users/profile`
- [ ] PATCH `/api/users/profile`
- [ ] POST `/api/users/documents/:documentType`
- [ ] GET `/api/users/documents`
- [ ] Route protection (require auth)
- [ ] File upload middleware

#### User Model
- [ ] User schema definition
- [ ] Required fields validation
- [ ] Email uniqueness
- [ ] Password hashing (pre-save)
- [ ] Document subdocument schema
- [ ] Timestamps
- [ ] Indexes

---

### ✅ Product Management

#### Product Controller (`productController.js`)
- [ ] Get all products endpoint
- [ ] Get product by ID endpoint
- [ ] Create product endpoint (admin)
- [ ] Update product endpoint (admin)
- [ ] Delete product endpoint (admin)
- [ ] Product validation
- [ ] Image upload handling (if implemented)
- [ ] Error handling

#### Product Routes (`products.js`)
- [ ] GET `/api/products`
- [ ] GET `/api/products/:id`
- [ ] POST `/api/products` (admin)
- [ ] PATCH `/api/products/:id` (admin)
- [ ] DELETE `/api/products/:id` (admin)
- [ ] Route protection (admin routes)

#### Product Model
- [ ] Product schema definition
- [ ] Required fields validation
- [ ] Price validation
- [ ] Category validation
- [ ] Image URL handling
- [ ] Timestamps
- [ ] Indexes

---

### ✅ Order Management

#### Order Controller (`orderController.js`)
- [ ] Create order endpoint
- [ ] Get user orders endpoint
- [ ] Get order by ID endpoint
- [ ] Get all orders endpoint (admin)
- [ ] Update order status endpoint (admin)
- [ ] Delete order endpoint (admin)
- [ ] Order validation
- [ ] Order total calculation
- [ ] Payment proof upload endpoint
- [ ] Error handling

#### Order Routes (`orders.js`)
- [ ] POST `/api/orders`
- [ ] GET `/api/orders`
- [ ] GET `/api/orders/:id`
- [ ] GET `/api/admin/orders` (admin)
- [ ] PATCH `/api/admin/orders/:id/status` (admin)
- [ ] POST `/api/orders/:id/payment` (payment proof upload)
- [ ] Route protection

#### Order Model
- [ ] Order schema definition
- [ ] User reference
- [ ] Products array with details
- [ ] Shipping address
- [ ] Order status enum
- [ ] Total amount
- [ ] Payment proof URL
- [ ] Timestamps
- [ ] Indexes

---

### ✅ Admin Features

#### Admin Controller (`adminController.js`)
- [ ] Get all users endpoint
- [ ] Toggle user authorization endpoint
- [ ] Update document status endpoint
- [ ] Get audit logs endpoint (if implemented)
- [ ] Delete user endpoint
- [ ] Admin authorization check
- [ ] Error handling

#### Admin Routes (`admin.js`)
- [ ] GET `/api/admin/users`
- [ ] PATCH `/api/admin/users/:id/authorization`
- [ ] PATCH `/api/admin/users/documents/status`
- [ ] DELETE `/api/admin/users/:id`
- [ ] GET `/api/admin/audit-logs` (if implemented)
- [ ] Route protection (admin only)

---

### ✅ Content Management

#### Blog Controller (`blogController.js`)
- [ ] Get all blog posts endpoint
- [ ] Get blog post by ID endpoint
- [ ] Create blog post endpoint (admin)
- [ ] Update blog post endpoint (admin)
- [ ] Delete blog post endpoint (admin)
- [ ] Blog validation
- [ ] Error handling

#### Blog Routes (`blogs.js`)
- [ ] GET `/api/blogs`
- [ ] GET `/api/blogs/:id`
- [ ] POST `/api/blogs` (admin)
- [ ] PATCH `/api/blogs/:id` (admin)
- [ ] DELETE `/api/blogs/:id` (admin)

#### FAQ Controller (`faqController.js`)
- [ ] Get all FAQs endpoint
- [ ] Get FAQ by ID endpoint
- [ ] Create FAQ endpoint (admin)
- [ ] Update FAQ endpoint (admin)
- [ ] Delete FAQ endpoint (admin)
- [ ] FAQ validation
- [ ] Error handling

#### FAQ Routes (`faqs.js`)
- [ ] GET `/api/faqs`
- [ ] GET `/api/faqs/:id`
- [ ] POST `/api/faqs` (admin)
- [ ] PATCH `/api/faqs/:id` (admin)
- [ ] DELETE `/api/faqs/:id` (admin)

#### Lead Controller (`leadController.js`)
- [ ] Create lead endpoint (goal form submission)
- [ ] Get all leads endpoint (admin)
- [ ] Lead validation
- [ ] Error handling

#### Lead Routes (`leads.js`)
- [ ] POST `/api/leads`
- [ ] GET `/api/admin/leads` (admin)

---

### ✅ File Upload

#### Upload Configuration (`upload.js`)
- [ ] Multer configuration
- [ ] File type validation
- [ ] File size limits (10MB)
- [ ] Storage configuration (local/cloud)
- [ ] Document upload middleware
- [ ] Payment proof upload middleware
- [ ] File naming strategy
- [ ] Directory creation

#### File Handling
- [ ] Document storage path
- [ ] Payment proof storage path
- [ ] File URL generation
- [ ] File deletion (if implemented)
- [ ] Error handling

---

### ✅ Email System

#### Email Configuration (`email.js`)
- [ ] Email provider setup (Gmail, Outlook, etc.)
- [ ] SMTP configuration
- [ ] Email transporter creation
- [ ] Email template functions
- [ ] Error handling

#### Email Templates
- [ ] Welcome email template
- [ ] Email verification template
- [ ] Password reset template
- [ ] Order confirmation template
- [ ] Document upload confirmation template
- [ ] Document approval/rejection template
- [ ] Order status update template

#### Email Sending
- [ ] Send email function
- [ ] Email queue handling (if implemented)
- [ ] Error handling
- [ ] Retry logic (if implemented)

---

### ✅ Database

#### MongoDB Connection (`db.js`)
- [ ] MongoDB connection setup
- [ ] Connection string configuration
- [ ] Connection error handling
- [ ] Reconnection logic
- [ ] Environment variable usage

#### Models
- [ ] User model
- [ ] Product model
- [ ] Order model
- [ ] Blog model
- [ ] FAQ model
- [ ] Lead model
- [ ] AuditLog model (if implemented)
- [ ] Booking model (if implemented)

#### Database Setup
- [ ] Initial data seeding (if needed)
- [ ] Index creation
- [ ] Migration scripts (if needed)

---

### ✅ Security

#### Security Middleware
- [ ] Helmet.js configuration
- [ ] CORS configuration
- [ ] Rate limiting (if implemented)
- [ ] Input sanitization
- [ ] XSS protection
- [ ] CSRF protection (if implemented)

#### Validation
- [ ] Request body validation
- [ ] Request parameter validation
- [ ] File upload validation
- [ ] Email format validation
- [ ] Password strength validation

#### Error Handling
- [ ] Global error handler
- [ ] Custom error classes
- [ ] Error logging
- [ ] Error response formatting

---

### ✅ Server Configuration

#### Server Setup (`server.js`)
- [ ] Express app initialization
- [ ] Middleware setup
- [ ] Route registration
- [ ] Error handling middleware
- [ ] Server startup
- [ ] Port configuration
- [ ] Environment variable loading

#### Environment Variables
- [ ] MongoDB connection string
- [ ] JWT secret
- [ ] Email configuration
- [ ] Server port
- [ ] Frontend URL
- [ ] OAuth credentials
- [ ] File storage configuration

---

### ✅ API Documentation

#### API Endpoints
- [ ] All endpoints documented
- [ ] Request/response examples
- [ ] Authentication requirements
- [ ] Error codes documented
- [ ] Rate limits documented (if applicable)

---

## 🧪 Testing Checklist

### Frontend Testing
- [ ] Login flow testing
- [ ] Registration flow testing
- [ ] Product browsing testing
- [ ] Cart functionality testing
- [ ] Checkout flow testing
- [ ] Document upload testing
- [ ] Order management testing
- [ ] Admin panel testing
- [ ] Responsive design testing
- [ ] Cross-browser testing

### Backend Testing
- [ ] Authentication endpoints testing
- [ ] User endpoints testing
- [ ] Product endpoints testing
- [ ] Order endpoints testing
- [ ] Admin endpoints testing
- [ ] File upload testing
- [ ] Email sending testing
- [ ] Error handling testing
- [ ] Security testing

---

## 📋 Final Verification

### Frontend
- [ ] All pages load without errors
- [ ] All forms submit correctly
- [ ] All API calls work
- [ ] Error messages display properly
- [ ] Loading states work
- [ ] Responsive on all devices
- [ ] No console errors

### Backend
- [ ] All endpoints respond correctly
- [ ] Authentication works
- [ ] Authorization works
- [ ] File uploads work
- [ ] Email sending works
- [ ] Database operations work
- [ ] Error handling works
- [ ] No server errors

---

**Note:** This checklist excludes HubSpot and Google Analytics tracking code as requested. Focus on core functionality and user experience.

