You are the Lead Software Architect, Senior Product Designer, Senior Backend Engineer, Senior Frontend Engineer, Database Architect, DevOps Engineer and QA Engineer.

Your mission is NOT to generate mockups.

Your mission is to transform this repository into a COMPLETE PRODUCTION READY BUSINESS PLATFORM.

=========================================================
PROJECT
=========================================================

Project Name:
dohsSheba

Business Type:
Hyperlocal Ecommerce + Home Services Platform

Target Users:
Residents
Merchants
Riders
Service Providers
Admins

This project is for REAL BUSINESS.

NOT for portfolio.
NOT for demo.
NOT for prototype.

Everything must work from backend.

NO fake data.
NO hardcoded values.
NO placeholder business logic.

Everything must be database driven.

=========================================================
CORE PRINCIPLE
=========================================================

Reduce unnecessary complexity.

Follow real-world business workflow.

Every action must be understandable by a non-technical business owner.

Every page must be dynamic.

Every dashboard must communicate with backend APIs.

Every state must come from database.

Everything should scale.

=========================================================
REMOVE
=========================================================

Remove every demo account.

Remove seeded fake users.

Remove static cards.

Remove hardcoded products.

Remove hardcoded orders.

Remove hardcoded notifications.

Remove mock analytics.

Remove fake charts.

Remove fake rider locations.

Remove frontend-only authentication.

Remove every temporary implementation.

Everything must come from backend.

=========================================================
AUTHENTICATION
=========================================================

Build a professional authentication system.

Use JWT Access Token.

Use Refresh Token.

HTTP Only Cookies.

Automatic refresh.

Automatic logout.

Proper session validation.

Role Guard.

Permission Guard.

Secure logout.

Token rotation.

Refresh token invalidation.

Password reset.

Forgot password.

Email verification architecture.

Change password.

Profile update.

Image upload.

Every protected route must verify backend authentication.

Never trust frontend role.

=========================================================
ROLES
=========================================================

SUPER_ADMIN

ADMIN

SELLER

RIDER

CUSTOMER

SERVICE_PROVIDER

Each role has its own dashboard.

Each role has its own permissions.

No role should access another role's dashboard.

=========================================================
BUSINESS FLOW
=========================================================

PHASE 1

COMPLETE ECOMMERCE

After ecommerce becomes fully stable,

then

Start Home Service Module.

Do NOT build both together.

=========================================================
ECOMMERCE WORKFLOW
=========================================================

Customer browses products.

Customer adds products.

Customer checkout.

Customer selects address.

Customer chooses payment.

Order is created.

Order status

PENDING

Seller receives order instantly.

Seller dashboard shows

New Orders

Seller reviews order.

Seller can

Accept

Reject

Cancel

If Seller ACCEPTS

Order becomes

READY_FOR_RIDER

Immediately notify all ONLINE riders.

=========================================================
RIDER SYSTEM
=========================================================

This should work like Foodpanda.

Only riders with

ONLINE

ON DUTY

AVAILABLE

can receive order requests.

Every online rider receives popup.

Popup contains

Countdown

Sound

Distance

Store

Customer

Estimated earnings

Accept button

Decline button

First rider who accepts

gets assignment.

Automatically remove popup from all others.

Order becomes

RIDER_ASSIGNED

Other riders cannot accept anymore.

=========================================================
RIDER DELIVERY FLOW
=========================================================

After accepting

Rider sees navigation.

Pickup location.

Delivery location.

Order items.

Customer phone.

Customer address.

Seller phone.

Update buttons

Arrived at Store

Picked Up

On the Way

Arrived

Delivered

Each update

updates backend

updates seller

updates customer

updates admin

instantly.

=========================================================
ORDER STATUS
=========================================================

PENDING

SELLER_ACCEPTED

READY_FOR_RIDER

RIDER_ASSIGNED

PICKUP_STARTED

PICKED_UP

ON_THE_WAY

ARRIVED

DELIVERED

CANCELLED

REJECTED

Every transition must be validated.

No invalid transitions.

=========================================================
REAL TIME
=========================================================

Use Socket.IO.

Realtime events

New Order

Seller Accepted

Seller Rejected

New Rider Request

Rider Accepted

Order Status Changed

Notifications

Unread Count

Live Dashboard

No page refresh.

=========================================================
SELLER DASHBOARD
=========================================================

Professional business dashboard.

Overview

Revenue

Orders

Today's Sales

Weekly Sales

Monthly Sales

Products

Categories

Inventory

Coupons

Reviews

Customers

Notifications

Payouts

Store Settings

Order Management

Analytics

Low Stock Alerts

Search

Filters

Pagination

Everything backend driven.

=========================================================
CUSTOMER
=========================================================

Profile

Addresses

Orders

Wishlist

Cart

Coupons

Reviews

Notifications

Wallet

Invoices

Track Order

Live Timeline

Realtime Status

=========================================================
ADMIN
=========================================================

Manage Users

Manage Sellers

Manage Riders

Manage Products

Manage Categories

Manage Orders

Manage Coupons

Manage Reviews

Manage Payments

Manage Notifications

Platform Analytics

Business Reports

Commission Settings

System Settings

Dashboard must represent actual business metrics.

=========================================================
SERVICE MODULE
=========================================================

Only after ecommerce is production ready.

Workflow

Customer books service.

Provider receives booking.

Provider accepts.

Schedule confirmed.

Provider starts work.

Provider updates progress.

Provider completes.

Customer verifies.

Payment released.

Review submitted.

=========================================================
DATABASE
=========================================================

Normalize schema.

Avoid duplicated fields.

Soft delete where necessary.

Audit logs.

Created By.

Updated By.

Timestamps.

Indexes.

Transactions.

Foreign key integrity.

=========================================================
API
=========================================================

REST API.

Consistent response format.

Pagination.

Sorting.

Filtering.

Search.

Validation.

Error handling.

Rate limiting.

Logging.

Swagger documentation.

=========================================================
UI
=========================================================

Modern.

Clean.

Business focused.

Responsive.

Fast.

No unnecessary animations.

Professional typography.

Consistent spacing.

Proper loading states.

Skeleton loaders.

Empty states.

Error states.

Confirmation dialogs.

Toast notifications.

=========================================================
PERFORMANCE
=========================================================

Lazy loading.

Code splitting.

Memoization.

Image optimization.

Caching.

Database optimization.

Indexes.

Query optimization.

Pagination everywhere.

=========================================================
SECURITY
=========================================================

Input validation.

Sanitization.

RBAC.

Secure cookies.

Helmet.

CORS.

CSRF protection.

Rate limiting.

Password hashing.

Environment validation.

=========================================================
CODE QUALITY
=========================================================

Clean Architecture.

Feature Based Structure.

Reusable Components.

Reusable Hooks.

Reusable Services.

Strong TypeScript.

No duplicated code.

No any type.

SOLID principles.

Production standards.

=========================================================
FINAL GOAL
=========================================================

When development is complete,

the platform should be deployable immediately for real customers.

No mock data.

No demo mode.

No placeholder screens.

Every button works.

Every API works.

Every dashboard works.

Every authentication flow works.

Every role works.

Every notification works.

Every order workflow works.

Every rider workflow works.

Every seller workflow works.

Everything should be production-ready and scalable.

Do not stop after one feature.

Continue implementing every missing feature sequentially until the platform is fully functional.

Always analyze the existing repository before making changes.

Never replace working functionality with simplified code.

Improve architecture where necessary while preserving existing features.

Every implementation must follow real-world business standards.