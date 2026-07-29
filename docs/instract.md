You are a Senior Full Stack Software Architect and Expert Next.js Developer.

Your task is to build a production-ready, scalable marketplace platform using the latest technologies.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn UI
- React Hook Form
- Zod
- TanStack Query
- Zustand
- Prisma 
- PostgreSQL
- Stripe/SSLCommerz Payment (future ready)
- NextAuth/Auth.js
- Cloudinary

================================================
src/
│
├── app/
│   ├── (public)/
│   │   ├── page.tsx                     // Home
│   │   ├── about/
│   │   ├── contact/
│   │   ├── services/
│   │   │   ├── page.tsx                 // All Services
│   │   │   ├── home-service/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── electrician/
│   │   │   │   ├── plumber/
│   │   │   │   ├── cleaner/
│   │   │   │   ├── painter/
│   │   │   │   ├── ac-service/
│   │   │   │   ├── carpenter/
│   │   │   │   └── [slug]/
│   │   │   │
│   │   │   └── shopping/
│   │   │       ├── page.tsx
│   │   │       ├── groceries/
│   │   │       ├── vegetables/
│   │   │       ├── fruits/
│   │   │       ├── meat/
│   │   │       ├── fish/
│   │   │       ├── dairy/
│   │   │       ├── snacks/
│   │   │       └── [category]/
│   │   │
│   │   ├── search/
│   │   ├── offers/
│   │   └── faq/
│   │
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── verify-email/
│   │
│   ├── (user)/
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── profile/
│   │   │   ├── orders/
│   │   │   ├── bookings/
│   │   │   ├── wishlist/
│   │   │   ├── addresses/
│   │   │   ├── notifications/
│   │   │   ├── reviews/
│   │   │   └── settings/
│   │
│   ├── (provider)/
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── bookings/
│   │   │   ├── earnings/
│   │   │   ├── services/
│   │   │   ├── schedule/
│   │   │   ├── reviews/
│   │   │   ├── wallet/
│   │   │   └── settings/
│   │
│   ├── (seller)/
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── products/
│   │   │   ├── add-product/
│   │   │   ├── inventory/
│   │   │   ├── orders/
│   │   │   ├── customers/
│   │   │   ├── earnings/
│   │   │   └── settings/
│   │
│   ├── (admin)/
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── users/
│   │   │   ├── providers/
│   │   │   ├── sellers/
│   │   │   ├── services/
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   ├── bookings/
│   │   │   ├── orders/
│   │   │   ├── payments/
│   │   │   ├── reports/
│   │   │   ├── coupons/
│   │   │   ├── banners/
│   │   │   └── settings/
│   │
│   ├── api/
│   │
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   └── globals.css
│
├── components/
│   ├── ui/
│   ├── common/
│   ├── navbar/
│   ├── footer/
│   ├── home/
│   ├── shopping/
│   ├── services/
│   ├── dashboard/
│   ├── forms/
│   ├── cards/
│   └── modals/
│
├── hooks/
│
├── lib/
│
├── services/
│   ├── auth.ts
│   ├── booking.ts
│   ├── order.ts
│   ├── payment.ts
│   ├── product.ts
│   └── service.ts
│
├── store/
│
├── types/
│
├── utils/
│
├── constants/
│
├── providers/
│
├── middleware.ts
│
└── assets/
    ├── images/
    ├── icons/
    └── logos/
Project Name

Home Service & Shopping Platform

The platform has two main businesses inside one application.

1. Home Services
2. Shopping (Grocery & Daily Needs)

================================================

User Roles

- Guest
- Customer
- Service Provider
- Shop Owner
- Admin

================================================

Project Structure

Use App Router.

src/

app/
(public)
(auth)
(user)
(provider)
(seller)
(admin)

components/
features/
hooks/
lib/
services/
store/
types/
utils/
constants/
providers/

================================================

Public Pages

Home

About

Contact

Services

Search

Offers

FAQ

================================================

Home Service Module

Categories

- Electrician
- Plumber
- House Cleaner
- Carpenter
- Painter
- AC Service
- CCTV
- Pest Control
- Appliance Repair
- Interior Service

Each category has

Category Page

Provider List

Provider Details

Book Service

Reviews

Pricing

================================================

Shopping Module

Categories

Groceries

Vegetables

Fruits

Fish

Meat

Milk

Egg

Rice

Oil

Snacks

Beverages

Medicine (Future)

Electronics (Future)

Each category has

Category Page

Product Details

Cart

Wishlist

Checkout

Reviews

================================================

Customer Dashboard

Dashboard

Profile

Orders

Bookings

Wishlist

Addresses

Notifications

Payment History

Reviews

Settings

================================================

Service Provider Dashboard

Dashboard

Booking Requests

My Services

Availability

Schedule

Reviews

Wallet

Earnings

Profile

Settings

================================================

Seller Dashboard

Dashboard

Products

Add Product

Inventory

Orders

Customers

Sales

Analytics

Wallet

Profile

Settings

================================================

Admin Dashboard

Dashboard

Users

Customers

Providers

Shop Owners

Services

Products

Categories

Orders

Bookings

Payments

Reports

Coupons

Banners

CMS

Notifications

Settings

================================================

Database Models

User

Role

Address

ServiceCategory

Service

Booking

BookingStatus

ProductCategory

Product

Cart

Wishlist

Order

OrderItem

Payment

Review

Notification

Banner

Coupon

Wallet

Transaction

================================================

Coding Standards

Use Feature-Based Architecture.

Each feature should have:

components

hooks

types

services

schemas

actions

Example

features/

booking/

cart/

product/

service/

auth/

================================================

Requirements

Use Server Components whenever possible.

Use Client Components only where required.

Use reusable components.

No duplicated code.

Follow SOLID principles.

Use clean folder architecture.

Use responsive layouts.

Support Dark Mode.

Use loading.tsx

Use error.tsx

Use not-found.tsx

Use route groups.

Use metadata.

Use dynamic routes.

================================================

UI Requirements

Modern SaaS Design

Rounded corners

Soft shadows

Large spacing

Premium animations

Skeleton loading

Beautiful cards

Responsive navigation

Sticky header

Mega menu

Professional dashboard layout

Beautiful tables

Professional forms

Charts

================================================

Authentication

Role Based Authentication

Protected Routes

Middleware

JWT Session

================================================

Performance

Image optimization

Code splitting

Lazy loading

Server Actions where appropriate

SEO optimized

Accessible

================================================

Important Instructions

Do NOT generate everything at once.

Build the project module by module.

For every module:

1. Create folder structure.
2. Create layouts.
3. Create pages.
4. Create reusable components.
5. Explain architecture briefly.
6. Keep code production-ready.
7. Follow best practices.
8. Use TypeScript everywhere.
9. Do not use placeholder code unless absolutely necessary.
10. Make every module fully functional before moving to the next.

Start with creating the complete project folder structure and base layout, then proceed to the Public Home module.