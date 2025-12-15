# EverWell – Full System Test Plan

This guide walks through end-to-end, cross-team testing to validate the entire EverWell platform before launch. Follow the checklist in order—mark each item complete once the expected results match.

---

## 1. Environment Preparation

- [ ] Backend `.env` updated (MongoDB, JWT, Brevo, HubSpot, etc.)
- [ ] Frontend `.env` updated (`VITE_API_URL`, `VITE_GA4_MEASUREMENT_ID`, `VITE_HUBSPOT_PORTAL_ID`, `VITE_GTM_CONTAINER_ID`, `VITE_SIMPLYBOOK_COMPANY_ID`)
- [ ] Install dependencies:  
  ```bash
  cd backend && npm install
  cd ../frontend && npm install
  ```
- [ ] Start services:
  ```bash
  # Terminal 1
  cd backend
  npm run dev

  # Terminal 2
  cd frontend
  npm run dev
  ```
- [ ] Optional: run MongoDB locally or point to Atlas staging database

---

## 2. Authentication & User Account Flows

### 2.1 Registration & Email Verification
- [ ] Register new user at `/login` → “Cadastre-se”
- [ ] Two emails arrive: verification + welcome (check inbox/spam)
- [ ] Email verification link activates account
- [ ] Login succeeds only after verification
- [ ] GA4 & HubSpot show `sign_up` / `complete_registration`

### 2.2 Login & Session
- [ ] Login with verified credentials
- [ ] Dashboard loads with personalized data
- [ ] Refresh preserves session
- [ ] Logout clears session and redirects home
- [ ] Attempting to access `/dashboard` while logged out redirects to `/login`

### 2.3 OAuth (Google)
- [ ] Follow `TEST_GOOGLE_OAUTH_LOCAL.md`
- [ ] New Google user auto-verifies (no email loop)
- [ ] Existing Google user re-authenticates smoothly

### 2.4 Password Reset
- [ ] Trigger “Esqueceu a senha?”
- [ ] Reset email delivered (verify token expiry 1h)
- [ ] Reset form accepts new password (min 6 chars)
- [ ] Login works with updated password

---

## 3. E-commerce Flow

### 3.1 Products & Cart
- [ ] Browse `/produtos` and `/produtos/:slug`
- [ ] Add/remove items (quantities update, GA4 `add_to_cart`)
- [ ] Cart persists across refresh (localStorage)
- [ ] Empty state messaging and skeleton loaders render

### 3.2 Checkout & Order Creation
- [ ] Proceed to `/checkout` with items in cart
- [ ] Fill shipping form (validation errors handled)
- [ ] Submit order → success toast and redirect
- [ ] `/dashboard/pedidos` shows new order
- [ ] Admin `/admin` order tab shows the same order
- [ ] GA4 `purchase`, HubSpot custom event logged
- [ ] HubSpot CRM contact created/updated with order ID & total

### 3.3 Payment Proof Upload
- [ ] Upload proof (PDF/JPG/PNG under limit)
- [ ] Preview renders; status = pending
- [ ] Admin sees proof link and can change status
- [ ] Audit log updated

---

## 4. Document Management

### 4.1 Upload & Status
- [ ] Upload medical prescription, import authorization, proof of residence
- [ ] Invalid format/size rejected
- [ ] Admin updates status to approved/rejected
- [ ] User dashboard reflects new status immediately

### 4.2 Admin Authorization
- [ ] Admin toggles `isAuthorized` → affects product access
- [ ] Unauthorized users blocked from restricted content (cart, checkout)

---

## 5. Booking & Lead Capture

### 5.1 SimplyBook Widget
- [ ] **Setup**: Add `VITE_SIMPLYBOOK_COMPANY_ID` to `frontend/.env.local` (get Company ID from SimplyBook dashboard)
- [ ] Visit `/agendar`
- [ ] Widget loads, matches styling
- [ ] Complete test booking (sandbox) or confirm embed interaction
- [ ] HubSpot event `booking_completed` recorded (check `_hsq` logs)
- [ ] **Note**: Widget is embedded directly in site - no external site needed!

### 5.2 Goal / Lead Form
- [ ] Submit “Defina seus objetivos” form on home page
- [ ] Toast success message appears
- [ ] Email notification sent to `LEAD_NOTIFICATION_EMAIL`
- [ ] HubSpot `goal_form` event recorded

---

## 6. Admin Panel

### 6.1 Users Tab
- [ ] `Painel Administrativo` metrics reflect real data
- [ ] Authorize/deauthorize users (Badge counts update)
- [ ] Search filters respond instantly

### 6.2 Orders Tab
- [ ] Filter by status/date/search
- [ ] Update order status (email template triggered if configured)
- [ ] View order modal shows shipping, items, payment proof
- [ ] HubSpot sync logs only once per order (no duplicates)

---

## 7. Analytics & Tracking

### 7.1 Google Analytics 4
- [ ] Open GA4 DebugView with extension enabled
- [ ] Verify `page_view`, `view_item`, `add_to_cart`, `purchase`, `document_upload`
- [ ] Realtime report shows active user traffic

### 7.2 Google Tag Manager
- [ ] Launch GTM Preview mode
- [ ] Navigate app → ensure dataLayer receives events
- [ ] Publish container only after QA

### 7.3 HubSpot
- [ ] **Frontend Setup**: `VITE_HUBSPOT_PORTAL_ID` configured in `frontend/.env.local`
- [ ] **Backend Setup**: `HUBSPOT_API_KEY` configured in `backend/.env`
- [ ] Console displays `HubSpot: Initialized with portal ID ...`
- [ ] `_hsq` logs events for lead form, orders, booking
- [ ] HubSpot Events Manager shows events in real-time (use Test Events)
- [ ] HubSpot CRM contact created when order is placed
- [ ] HubSpot CRM contact updated with latest order data
- [ ] **See detailed guide**: `HUBSPOT_TESTING_GUIDE.md`

---

## 8. Email & Notifications

- [ ] `npm run test-email` succeeds
- [ ] Welcome + verification emails delivered
- [ ] Order confirmation email triggered if template configured
- [ ] Admin receives lead notifications
- [ ] Error handling logged if SMTP missing

---

## 9. Cross-Browser & Device QA

- [ ] Chrome (latest)
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Tablet view (responsive breakpoints)

Check page layout, buttons, forms, modals, scrolling behavior, performance.

---

## 10. Performance & Accessibility Quick Checks

- [ ] Lighthouse performance ≥ 80 on desktop
- [ ] No blocking console errors
- [ ] Images optimized (lazy loading, correct sizes)
- [ ] Forms announce errors, buttons accessible via keyboard

---

## 11. Deployment Readiness

- [ ] `npm run build` (frontend) succeeds with no warnings
- [ ] Backend lints/tests (if any) pass
- [ ] Production env vars configured (Brevo, HubSpot, GA4, GTM, SimplyBook, Mongo)
- [ ] Start backend with `NODE_ENV=production` and hit health check
- [ ] Deploy to staging environment (Vercel + Railway/Render/Hobby server)
- [ ] Run **Post-Deployment Smoke Tests**: login, dashboard, products, checkout, admin

---

## 12. Sign-off

- [ ] Product owner review complete
- [ ] QA checklist signed
- [ ] Analytics dashboards show traffic/events
- [ ] Final go/no-go documented

> Tip: Create Jira/Trello tasks for any failures, referencing this checklist section for clarity.

---

**All boxes checked?** You’re ready to move the EverWell platform to production. 🎉


