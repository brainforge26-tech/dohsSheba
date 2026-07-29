# Dynamic Admin Dashboard Plan (`/admin/dashboard`)

Plan document tracking step-by-step progress for turning `http://localhost:3000/admin/dashboard` into a 100% dynamic PostgreSQL Prisma DB dashboard.

---

## 📌 Dynamic Integration Roadmap

### ✅ Step 1: Top KPI Banner Metrics Dynamic Sync [COMPLETED]
- **Goal**: Connect Top KPI cards (Total GMV ৳, Registered Residents, Verified Partners, Active Local Shops) to live Prisma counts in `GET /api/v1/admin/dashboard`.
- **Backend Service**: [`backend/src/modules/admin/admin.service.ts`](file:///d:/dohsSheba/backend/src/modules/admin/admin.service.ts)
- **Frontend Page**: [`frontend/src/app/(admin)/admin/dashboard/page.tsx`](file:///d:/dohsSheba/frontend/src/app/(admin)/admin/dashboard/page.tsx)
- **Status**: Completed & Verified.

---

### ✅ Step 2: Quick Summary Monthly Revenue Bar Chart Dynamic Sync [COMPLETED]
- **Goal**: Aggregate monthly order & booking totals by month from Prisma database and feed `quickSummaryChart` dynamically to `QuickSummaryWidget`.
- **Backend Service**: [`backend/src/modules/admin/admin.service.ts`](file:///d:/dohsSheba/backend/src/modules/admin/admin.service.ts)
- **Frontend Widget**: [`frontend/src/components/dashboard/widgets/QuickSummaryWidget.tsx`](file:///d:/dohsSheba/frontend/src/components/dashboard/widgets/QuickSummaryWidget.tsx)
- **Status**: Completed & Verified.

---

### ✅ Step 3: Target Metrics (Orders & Users) Dynamic Calculation [COMPLETED]
- **Goal**: Calculate real-time order and resident user signup progress against targets dynamically from database counts in `TargetMetricsCard`.
- **Backend Service**: [`backend/src/modules/admin/admin.service.ts`](file:///d:/dohsSheba/backend/src/modules/admin/admin.service.ts)
- **Frontend Widget**: [`frontend/src/components/dashboard/widgets/TargetMetricsCard.tsx`](file:///d:/dohsSheba/frontend/src/components/dashboard/widgets/TargetMetricsCard.tsx)
- **Status**: Completed & Verified.

---

### ✅ Step 4: Live Order & Service Booking Tracking Table [COMPLETED]
- **Goal**: Populate `ProductTrackingWidget` with real-time `recentOrders` (with customer names & items) and `recentBookings` (with service title & time) fetched from database.
- **Backend Service**: [`backend/src/modules/admin/admin.service.ts`](file:///d:/dohsSheba/backend/src/modules/admin/admin.service.ts)
- **Frontend Widget**: [`frontend/src/components/dashboard/widgets/ProductTrackingWidget.tsx`](file:///d:/dohsSheba/frontend/src/components/dashboard/widgets/ProductTrackingWidget.tsx)
- **Status**: Completed & Verified.

---

### ✅ Step 5: Partner Approval Queue Real Database Actions [COMPLETED]
- **Goal**: Fetch pending service provider profile applications (`isVerified === false`) from Prisma and connect Approve/Reject buttons to live `updateUserRole` & `verifyProvider` API.
- **Backend Controller**: [`backend/src/modules/admin/admin.controller.ts`](file:///d:/dohsSheba/backend/src/modules/admin/admin.controller.ts)
- **Frontend Page**: [`frontend/src/app/(admin)/admin/dashboard/page.tsx`](file:///d:/dohsSheba/frontend/src/app/(admin)/admin/dashboard/page.tsx)
- **Status**: Completed & Verified.
