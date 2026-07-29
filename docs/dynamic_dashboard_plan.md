# 🚀 Dynamic Dashboard Implementation Plan (Customer & Seller)

A step-by-step roadmap for converting all static/mock components in the Customer Dashboard and Seller Dashboard of **dohsSheba** into fully dynamic, real-time backend-integrated pages.

---

## 📋 Overview of Phases

| Phase | Target Area | Primary Goal | Status |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Customer Dashboard Core | Connect Profile, Addresses, Orders, Service Bookings & Main Overview to Backend API | ⏳ Pending |
| **Phase 2** | Customer Secondary Features | Connect Wishlist, Reviews, Coupons, Support Tickets, Payments/Wallet, Refunds & Messages | ⏳ Pending |
| **Phase 3** | Seller Store & Branding | Connect Store Profile (Name, Banner, Logo, Contacts) & Seller Settings to Backend API | ⏳ Pending |
| **Phase 4** | Seller Analytics & Finance | Connect Seller Real Analytics (Charts, Top Products, Categories) & Wallet Transactions | ⏳ Pending |
| **Phase 5** | Seller Marketing | Connect Seller Coupons, Discounts, & Flash Sale Management | ⏳ Pending |

---

## 🗓️ Detailed Implementation Steps

### Phase 1: Customer Dashboard Core (Orders, Bookings, Profile, Addresses, Overview)

#### Step 1.1: Customer User Profile & Saved Addresses API Sync
- **Backend Endpoints**:
  - `GET /api/users/profile` -> Fetch authenticated user details.
  - `PATCH /api/users/profile` -> Update user name, phone, gender, avatar.
  - `GET /api/users/addresses` -> List saved delivery addresses.
  - `POST /api/users/addresses` -> Add new delivery address.
  - `DELETE /api/users/addresses/:id` -> Remove address.
  - `PATCH /api/users/addresses/:id/default` -> Set default address.
- **Frontend Integration**:
  - Update `src/app/dashboard/profile/page.tsx` with API submission and loading states.
  - Update `src/app/dashboard/addresses/page.tsx` to read & mutate database addresses.

#### Step 1.2: Customer Orders Integration (`GET /api/orders/my-orders`)
- **Backend Endpoints**:
  - `GET /api/order/my-orders` -> Fetch orders placed by logged-in customer.
  - `GET /api/order/:id` -> Fetch single order detail & tracking timeline.
  - `PATCH /api/order/:id/cancel` -> Cancel order if pending.
- **Frontend Integration**:
  - Update `src/app/dashboard/orders/page.tsx` to fetch orders via API (falling back to local store if offline).

#### Step 1.3: Service Bookings API & Frontend Integration
- **Backend Endpoints**:
  - `GET /api/booking/my-bookings` -> Fetch home service bookings.
  - `POST /api/booking` -> Create new service booking.
  - `PATCH /api/booking/:id/cancel` -> Cancel booking.
- **Frontend Integration**:
  - Update `src/app/dashboard/bookings/page.tsx` to fetch real service bookings from backend.

#### Step 1.4: Customer Overview Dashboard Aggregation (`/api/customer/dashboard/stats`)
- **Backend Endpoint**:
  - `GET /api/customer/dashboard/stats` -> Returns active booking count, total marketplace orders count, lifetime spend, loyalty points, and recent booking items.
- **Frontend Integration**:
  - Update `src/app/dashboard/page.tsx` to display real metric cards & recent bookings.

---

### Phase 2: Customer Secondary Features

#### Step 2.1: Wishlist & Reviews Integration
- **Backend**:
  - `GET /api/wishlist`, `POST /api/wishlist`, `DELETE /api/wishlist/:id`
  - `GET /api/review/my-reviews`, `POST /api/review`
- **Frontend**:
  - Update `src/app/dashboard/wishlist/page.tsx` and `src/app/dashboard/reviews/page.tsx`.

#### Step 2.2: Coupons, Wallet/Payments, Support & Refunds
- **Backend**:
  - `GET /api/coupon/available`, `GET /api/wallet/my-wallet`, `GET /api/wallet/transactions`
  - Support & Refund claim endpoints.
- **Frontend**:
  - Update `src/app/dashboard/coupons/page.tsx`, `payments/page.tsx`, `support/page.tsx`, `refunds/page.tsx`.

---

### Phase 3: Seller Store Profile & Settings

#### Step 3.1: Store Profile & Branding Integration
- **Backend Endpoints**:
  - `GET /api/seller/store-profile` -> Get current seller store branding info.
  - `PATCH /api/seller/store-profile` -> Update shop name, description, logo URL, banner URL, phone, email, address, operating hours.
- **Frontend Integration**:
  - Update `src/app/(seller)/seller/dashboard/store/page.tsx` to load and update real store info.

#### Step 3.2: Seller Settings & Notification Preferences
- **Backend Endpoints**:
  - `GET /api/seller/settings`, `PATCH /api/seller/settings`
- **Frontend Integration**:
  - Update `src/app/(seller)/seller/dashboard/settings/page.tsx`.

---

### Phase 4: Seller Real Analytics & Wallet Transactions

#### Step 4.1: Real Analytics Endpoint (`GET /api/seller/analytics`)
- **Backend**:
  - Aggregate actual monthly sales, total order count, customer count, top revenue products, top category percentages.
- **Frontend Integration**:
  - Update `src/app/(seller)/seller/dashboard/analytics/page.tsx` to render dynamic charts & tables.

#### Step 4.2: Wallet Transactions & Withdrawal Requests
- **Backend**:
  - `GET /api/wallet/seller-transactions`, `POST /api/wallet/withdraw`
- **Frontend Integration**:
  - Update `src/app/(seller)/seller/dashboard/finance/transactions/page.tsx`.

---

### Phase 5: Seller Marketing & Campaigns

#### Step 5.1: Seller Coupons & Discount Campaigns API
- **Backend**:
  - `GET /api/coupon/seller`, `POST /api/coupon/seller`, `DELETE /api/coupon/seller/:id`
- **Frontend Integration**:
  - Update `src/app/(seller)/seller/dashboard/marketing/page.tsx` & sub-pages.

---

## 🧪 Verification Plan
1. Test each endpoint using API test script.
2. Verify UI updates immediately without needing hardcoded fallbacks.
3. Test empty states, loading states, and error handling gracefully.
