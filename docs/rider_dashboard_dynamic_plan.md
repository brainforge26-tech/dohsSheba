# Rider Dashboard — Full Dynamic Integration Plan

## লক্ষ্য (Goal)
Customer Order দেওয়া থেকে শুরু করে Admin প্যানেল থেকে Rider Assign করা, Rider কর্তৃক Order Accept করা, এবং Product Delivery সম্পন্ন করা পর্যন্ত সম্পূর্ণ Flow টি PostgreSQL Database-এর সাথে **100% Dynamic** করা।

---

## বর্তমান অবস্থা (Current State)

| উপাদান | অবস্থা |
|---|---|
| `Order` model (schema.prisma) | ✅ আছে — `riderId?`, `riderName?`, `status: OrderStatus` সহ |
| `OrderStatus` enum | ✅ আছে — `PENDING`, `RIDER_ASSIGNED`, `PROCESSING`, `SHIPPED`, `DELIVERED` |
| Rider User accounts (DB) | ✅ আছে — `rider@example.com`, `rider2@example.com` |
| Rider Dashboard UI | ✅ আছে কিন্তু সম্পূর্ণ Static/Hardcoded data |
| Admin Panel → Rider Assign | ❌ নেই — Backend API নেই, Frontend নেই |
| Rider Accept/Decline API | ❌ নেই |
| Rider Dashboard live data | ❌ নেই — Hardcoded mock data |
| Customer → Order Place API | ⚠️ আংশিক — DB এ save হচ্ছে কিন্তু Rider notification নেই |

---

## পূর্ণ Flow চিত্র

```
Customer places Order
        ↓
Order saved in DB (status = PENDING)
        ↓
Admin Dashboard → Order list দেখা যাচ্ছে
        ↓
Admin selects Order → "Assign Rider" button → Rider select করা
        ↓
DB update: order.riderId = rider.id, order.status = RIDER_ASSIGNED
        ↓
Rider Dashboard → Foodpanda-style popup (Live DB polling / SSE)
        ↓
Rider clicks ACCEPT → order.status = PROCESSING
        ↓
Rider updates: PICKED_UP → ON_THE_WAY → DELIVERED
        ↓
order.status = DELIVERED, earnings recorded
```

---

## Steps (ধাপে ধাপে Implementation)

---

### ✅ STEP 1 — Schema Migration: `RiderProfile` & `Order` relation (Permission নেওয়া হবে)
**উদ্দেশ্য**: Order model-এ proper Rider relation এবং RiderProfile model যুক্ত করা।

**Prisma Schema Changes** (`backend/prisma/schema.prisma`):
- `Order` model-এ `rider User? @relation("RiderOrders", fields: [riderId], references: [id])` relation যুক্ত করা
- `User` model-এ `riderOrders Order[] @relation("RiderOrders")` যুক্ত করা
- নতুন `RiderProfile` model:
  ```prisma
  model RiderProfile {
    id          String   @id @default(cuid())
    userId      String   @unique
    vehicleType String   @default("Bicycle")
    vehicleNo   String?
    isAvailable Boolean  @default(true)
    totalTrips  Int      @default(0)
    totalEarnings Float  @default(0)
    rating      Float    @default(5.0)
    createdAt   DateTime @default(now())
    updatedAt   DateTime @updatedAt
    user        User     @relation(fields: [userId], references: [id])
    @@map("rider_profiles")
  }
  ```
- Run: `npx prisma db push && npx prisma generate`
- `seed.ts`-এ rider profile data যুক্ত করা

---

### ✅ STEP 2 — Backend: Rider API Endpoints (STEP 1 এর পরে)
**উদ্দেশ্য**: Rider-এর জন্য dedicated backend API তৈরি করা।

**নতুন File** (`backend/src/modules/rider/`):
- `rider.service.ts` — সব business logic
- `rider.controller.ts` — HTTP handlers
- `rider.routes.ts` — Route definitions

**API Endpoints**:
| Method | Path | বিবরণ |
|---|---|---|
| `GET` | `/rider/profile` | Rider নিজের profile দেখা |
| `GET` | `/rider/orders/assigned` | আমার কাছে assigned orders list |
| `GET` | `/rider/orders/history` | আমার সম্পন্ন delivery history |
| `PATCH` | `/rider/orders/:id/accept` | Order accept করা |
| `PATCH` | `/rider/orders/:id/status` | Status update (PICKUP/ON_THE_WAY/DELIVERED) |
| `PATCH` | `/rider/availability` | Online/Offline toggle |

---

### ✅ STEP 3 — Backend: Admin → Assign Rider API (STEP 2 এর পরে)
**উদ্দেশ্য**: Admin প্যানেল থেকে যেকোনো Order-এ Rider assign করার API।

**Changes** (`backend/src/modules/admin/admin.service.ts`):
- `assignRiderToOrder(orderId, riderId)` function
- `getAvailableRiders()` — সব active/available rider list
- `getPendingOrders()` — Assign হয়নি এমন orders

**Changes** (`backend/src/modules/admin/admin.routes.ts`):
- `PATCH /admin/orders/:id/assign-rider`
- `GET /admin/riders/available`
- `GET /admin/orders/pending`

---

### ✅ STEP 4 — Frontend: Admin Panel → Rider Assign UI (STEP 3 এর পরে)
**উদ্দেশ্য**: Admin Ecommerce Dashboard-এ Orders ট্যাবে Rider Assign করার UI।

**Changes** (`frontend/src/app/(admin)/admin/dashboard/ecommerce/page.tsx`):
- Orders table-এ `PENDING` অর্ডারের পাশে **"Assign Rider"** button
- Click করলে Modal/Dropdown খুলবে — Available Riders list (DB থেকে)
- Rider select করে Confirm করলে API call → DB update

---

### ✅ STEP 5 — Frontend: Rider Dashboard → Live Polling (STEP 4 এর পরে)
**উদ্দেশ্য**: Rider Dashboard-এ Static Hardcoded data সরিয়ে Live DB data আনা।

**Changes** (`frontend/src/app/(rider)/rider/dashboard/page.tsx`):
- `useEffect` দিয়ে প্রতি **5 সেকেন্ড** interval-এ `/rider/orders/assigned` API call (Polling)
- নতুন `RIDER_ASSIGNED` status অর্ডার পেলে Foodpanda popup automatically trigger
- Popup-এ real order data (customer name, address, items, amount)
- **ACCEPT** button → `/rider/orders/:id/accept` API call
- **Decline** button → popup বন্ধ (পরের poll-এ আবার দেখাবে)

---

### ✅ STEP 6 — Frontend: Rider Active Trip Stepper → Live Update (STEP 5 এর পরে)
**উদ্দেশ্য**: Active delivery-এর 3-step progress (Store Pickup → On the Way → Delivered) DB-এর সাথে sync করা।

**Changes** (`frontend/src/app/(rider)/rider/dashboard/page.tsx`):
- Step 1: **"I've Reached the Store"** → `PATCH /rider/orders/:id/status { status: 'PROCESSING' }`
- Step 2: **"Picked Up, On the Way"** → `PATCH /rider/orders/:id/status { status: 'SHIPPED' }`
- Step 3: **"Delivered to Customer"** → `PATCH /rider/orders/:id/status { status: 'DELIVERED' }`
- প্রতিটি step-এ DB update + UI visual feedback

---

### ✅ STEP 7 — Frontend: Rider Dashboard Stats → Live DB (STEP 6 এর পরে)
**উদ্দেশ্য**: "Today's Deliveries", "Today's Earnings", "Active Mission" — সব DB থেকে real data।

**Changes** (`frontend/src/app/(rider)/rider/dashboard/page.tsx`):
- `/rider/profile` API থেকে `totalTrips`, `totalEarnings`, `rating` load
- `/rider/orders/history` থেকে আজকের completed trips count
- Trip history table-এ real completed orders show

---

## Implementation Order

```
STEP 1 → Schema Migration ← আজকের কাজ, Permission নিয়ে শুরু
STEP 2 → Backend Rider APIs
STEP 3 → Admin Assign Rider API
STEP 4 → Admin UI Assign Rider
STEP 5 → Rider Live Polling
STEP 6 → Rider Trip Stepper Live
STEP 7 → Rider Stats Live
```

---

## Test Flow (Verification Plan)

```
1. seed.ts দিয়ে DB fresh করা
2. customer@example.com → Login → Cart-এ Product add → Order place
3. admin@example.com → Login → Ecommerce → Orders → Order টি দেখা → Rider Assign
4. rider@example.com → Login → Dashboard → Popup আসা verify করা
5. Rider → ACCEPT → Trip steps complete করা
6. customer@example.com → Order history → DELIVERED status দেখা
```

---

> **📌 নোট**: প্রতিটি Step implement করার পরে আপনার কাছ থেকে Permission নেওয়া হবে পরবর্তী Step শুরু করার আগে।
