# EverWell – Booking & Purchase Walkthrough

This guide covers two core user flows on the EverWell platform:
- Scheduling a consultation through the SimplyBook widget
- Purchasing products end-to-end (cart → checkout → order confirmation)

Follow the steps below in order. Screens/actions assume a desktop view; mobile behaves the same with responsive layouts.

---

## 1. Booking a Consultation

### 1.1 Navigate to the booking page
1. From any page, click **Agendar consulta** in the header or go directly to `/agendar`.
2. The page shows an EverWell-branded hero with the embedded SimplyBook widget below.
   - If the widget takes a moment to load, the page shows a loading state.
   - If the widget fails to load, a fallback message prompts you to refresh or contact EverWell.

### 1.2 Choose service, date, and time
1. Inside the widget, select the service you want (if multiple are available).
2. Pick an available date and time slot.
3. Proceed with booking as the widget guides you (customer info and any required fields).

### 1.3 Confirm booking
1. Complete the booking form and submit.
2. You should see a confirmation inside the widget.
3. HubSpot event `booking_completed` fires automatically if HubSpot tracking scripts are active.
4. If you provided an email address, check your inbox for a confirmation sent by SimplyBook.

**Tip:** If you need to test repeatedly, consider using SimplyBook’s sandbox mode or reset the appointment after verification.

---

## 2. Purchasing Products

### 2.1 Register & authorize your account
1. Head to `/login` → click **Cadastre-se** (or log in if you already have an account).
2. Complete email verification (check inbox for the verification link).  
3. Wait for an admin to mark your account as **Autorizado**. Without authorization:
   - Protected product routes (`/produtos`, `/produtos/:slug`, cart, checkout) remain blocked.
   - You will be redirected to `/login` if you try to access them.

### 2.2 Browse products
1. Once authorized and logged in, go to `/produtos`.
2. Explore the catalog; click any product card to open `/produtos/:slug` for full details.
3. Product detail pages fire GA4 & HubSpot view events when loaded.

### 2.3 Add items to cart
1. On the product detail page, click **Adicionar**.
2. Toast confirms the action; cart badge updates (bottom-right floating “Carrinho” button).
3. Add/remove items as needed—quantities update in real time, and GA4 tracks add/remove events.

### 2.4 Review cart
1. Click the floating **Carrinho** button (bottom-right) or visit `/carrinho`.
2. Confirm items, quantities, and totals.
3. Remove or adjust items if needed—the totals recompute automatically.

### 2.5 Checkout
1. Click **Finalizar compra** to go to `/checkout`.
2. Fill in the shipping form (name, street, city, state, zip, country).
3. Submit → the backend creates the order, stores it in MongoDB, logs to AuditLog, and pushes data to HubSpot CRM.

### 2.6 Post-order actions
1. You are redirected to the dashboard (toast confirmation).
2. Visit `/dashboard` → **Pedidos** to view order status and upload payment proof.
3. If you have a payment receipt, upload it via the order modal.
   - File types: PDF/JPG/PNG; size limit enforced.
   - Admin sees the proof in `/admin → Pedidos`.

### 2.7 Admin follow-up (optional)
1. Admin logs in ➜ `/admin`.
2. Inside “Pedidos”, filter/sort orders, update statuses (pending → paid → delivered).
3. Status changes trigger GA4/HubSpot events and update the user dashboard in real time.

---

## 3. Tips for Testing

- **HubSpot CRM:** After placing an order, confirm that the contact record (email, order ID, total) appears in HubSpot.
- **Analytics:** Use GA4 DebugView and HubSpot console logs to verify events (`view_item`, `add_to_cart`, `purchase`, `goal_form`, `booking_completed`).
- **Emails:** Ensure Brevo/SMTP settings are configured to receive order emails or notifications.
- **Authorization:** Use the admin panel to toggle user access—non-authorized accounts should be blocked from product/catalog sections.

---

By following the steps above, you can validate both the booking flow and the end-to-end purchase experience, mirroring how real EverWell clients interact with the platform. Adjust data as needed (e.g., test payment proofs, multiple products) to cover different scenarios. Enjoy! ✨


