# 🚀 dohsSheba (DOHS Sheba & Grocery Marketplace)

**dohsSheba** is a full-stack hyperlocal marketplace web application for DOHS residential areas in Dhaka (Mohakhali, Baridhara, Mirpur, Banani). It connects Residents, Service Providers, Sellers/Merchants, Riders, and Admins in an integrated platform for home services, grocery shopping, order fulfillment, and doorstep delivery.

---

## 🛠️ Technology Stack

- **Frontend:** Next.js 14/15 (App Router), React, TypeScript, Tailwind CSS, Lucide React, Zustand
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, JWT Authentication
- **Architecture:** Modular Multi-Role Dashboard Architecture (Customer, Provider, Seller, Rider, Admin, Super Admin)

---

## 👥 Role-Based Portals & Key Features

### 🛒 1. Resident / Customer Portal
- Browse grocery items, fresh produce, and home services.
- Cart & Checkout with dynamic location selection.
- Real-time order status tracking (`PENDING` ➔ `RIDER_ASSIGNED` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `DELIVERED`).

### 🏪 2. Seller / Merchant Dashboard (`/seller/dashboard`)
- Manage store inventory, catalog, categories, and active sales.
- Receive and fulfill incoming resident orders.

### ⚙️ 3. Admin Command Center (`/admin/dashboard/ecommerce`)
- Oversee marketplace GMV, total products, categories, and resident orders.
- **Rider Dispatch System:** View available online riders and assign riders to pending orders.

### 🛵 4. Rider Fleet Dashboard (`/rider/dashboard`)
- Foodpanda-style real-time order alert popups with 30-second countdown.
- Live duty toggle (On Duty / Off Duty).
- Active delivery mission stepper (Store Pickup ➔ On the Way ➔ Doorstep Delivery).
- Earnings & delivery trip history.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL database

### 2. Backend Setup
```bash
cd backend
npm install
npx prisma db push
npx prisma generate
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
