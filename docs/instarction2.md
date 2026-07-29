# Seller Dashboard Development Roadmap (Commerce Module Only)

## Project Context

You are working on my EXISTING multi-vendor marketplace project.

IMPORTANT RULES

- DO NOT create a new project.
- DO NOT replace the current architecture.
- DO NOT change routing unless required.
- DO NOT change authentication.
- DO NOT modify existing APIs unless necessary.
- DO NOT remove existing features.
- Reuse all existing layouts.
- Reuse existing components.
- Reuse existing services.
- Reuse existing hooks.
- Reuse existing state management.
- Follow the current folder structure.
- Keep all code clean and modular.
- Everything must be production-ready.

This phase is ONLY for the Seller Commerce Dashboard.

DO NOT implement:

- Services
- Booking
- Appointments
- Rentals
- Freelancing
- Service Marketplace

Those modules will be implemented later.

--------------------------------------------------

# STEP 1
PROJECT ANALYSIS

First analyze the entire project.

Understand:

• Folder structure
• Dashboard Layout
• Sidebar
• Header
• Routing
• Authentication
• API structure
• Database models
• State Management
• Theme
• Components
• Existing Seller Features

After analysis,

Generate a report explaining:

✔ Existing features
✔ Missing seller commerce features
✔ Components to reuse
✔ New modules to build

Do NOT write implementation code in this step.

Wait for approval before Step 2.

--------------------------------------------------

# STEP 2
SELLER DASHBOARD HOME

Build only the Dashboard Home.

Use the existing layout.

Dashboard should contain

Top Summary Cards

- Total Revenue
- Total Sales
- Today's Sales
- Weekly Sales
- Monthly Sales
- Yearly Sales
- Total Orders
- Pending Orders
- Processing Orders
- Delivered Orders
- Cancelled Orders
- Refund Requests
- Withdrawable Balance
- Wallet Balance
- Active Products
- Out of Stock Products
- Low Stock Products
- Total Customers

Charts

- Daily Sales
- Monthly Sales
- Revenue
- Orders
- Customers
- Product Performance

Widgets

Recent Orders

Recent Reviews

Top Products

Low Stock Alerts

Recent Customers

Best Selling Categories

Quick Actions

Add Product

Manage Orders

Withdraw Money

View Analytics

Recent Activities

Notifications

Dashboard must be responsive.

Do not modify other pages.

Wait for approval before Step 3.

--------------------------------------------------

# STEP 3
SELLER SIDEBAR

Upgrade the sidebar only.

Menus

Dashboard

Products

- Products
- Add Product
- Categories
- Brands
- Inventory
- Attributes
- Variants
- Reviews

Orders

- All Orders
- Pending
- Processing
- Packed
- Shipped
- Delivered
- Cancelled
- Returned
- Refunds

Customers

- Customer List
- Reviews
- Wishlist

Marketing

- Coupons
- Discounts
- Flash Sale

Finance

- Earnings
- Wallet
- Withdraw
- Transactions

Analytics

- Sales
- Revenue
- Products
- Customers

Store

- Store Profile
- Store Settings
- SEO
- Policies

Settings

Keep the existing sidebar style.

Only improve it.

Wait for approval before Step 4.

--------------------------------------------------

# STEP 4
PRODUCT MANAGEMENT

Build a complete Product Module.

Include

Product List

Add Product

Edit Product

Delete Product

Product Details

Duplicate Product

Bulk Import

Bulk Export

Fields

Name

Description

Category

Subcategory

Brand

Tags

SKU

Barcode

Price

Sale Price

Cost Price

Stock

Low Stock Alert

Weight

Dimensions

Shipping

Images

Gallery

Video

Variants

Attributes

SEO

Meta Title

Meta Description

Slug

Status

Featured

Draft

Archived

Include

Search

Filters

Sorting

Pagination

Bulk Actions

Responsive Table

Reuse existing APIs.

Wait for approval before Step 5.

--------------------------------------------------

# STEP 5
ORDER MANAGEMENT

Implement Seller Orders.

Features

Order List

Order Details

Invoices

Shipping Labels

Tracking

Timeline

Status Updates

Statuses

Pending

Confirmed

Packed

Ready to Ship

Shipped

Out for Delivery

Delivered

Cancelled

Returned

Refund Requested

Refunded

Actions

Search

Filters

Export

Print Invoice

Print Shipping Label

Reuse existing components.

Wait for approval before Step 6.

--------------------------------------------------

# STEP 6
INVENTORY MANAGEMENT

Build Inventory Module.

Include

Current Stock

Available Stock

Reserved Stock

Warehouse

SKU

Barcode

Stock History

Stock Adjustment

Transfers

Low Stock

Out of Stock

Inventory Logs

Search

Filters

Responsive Table

Wait for approval before Step 7.

--------------------------------------------------

# STEP 7
CUSTOMER MANAGEMENT

Implement Customer Module.

Features

Customer List

Customer Details

Addresses

Purchase History

Wishlist

Reviews

Messages

Support Tickets

Wallet

Reward Points

Search

Filters

Pagination

Wait for approval before Step 8.

--------------------------------------------------

# STEP 8
MARKETING

Implement

Coupons

Discounts

Flash Sales

Referral

Gift Cards

Email Campaigns

Push Notifications

Announcement Banner

Wait for approval before Step 9.

--------------------------------------------------

# STEP 9
FINANCE

Build Seller Finance.

Pages

Revenue

Wallet

Withdraw

Transactions

Commission

Settlement

Charts

Revenue Analytics

Monthly Earnings

Weekly Earnings

Top Revenue Products

Export

Excel

CSV

PDF

Wait for approval before Step 10.

--------------------------------------------------

# STEP 10
ANALYTICS

Implement Analytics.

Charts

Sales

Orders

Revenue

Customers

Products

Categories

Conversion

Traffic

Reports

Sales Report

Order Report

Revenue Report

Inventory Report

Customer Report

Export

PDF

Excel

CSV

Wait for approval before Step 11.

--------------------------------------------------

# STEP 11
STORE SETTINGS

Implement

Store Profile

Business Information

Store Banner

Logo

Store SEO

Shipping Settings

Tax Settings

Payment Settings

Notification Settings

Holiday Mode

Policies

Wait for approval before Step 12.

--------------------------------------------------

# STEP 12
UI POLISH

Improve UI only.

Do NOT change functionality.

Improve

Spacing

Typography

Cards

Tables

Charts

Forms

Loading Skeletons

Empty States

Error States

Toast Notifications

Dark Mode

Light Mode

Animations

Responsive Design

Accessibility

Performance

Reusable Components

Code Cleanup

--------------------------------------------------

FINAL RULES

Always work ONE STEP at a time.

Never jump to another step.

Never modify unrelated code.

Never remove existing functionality.

Always reuse existing components.

Always maintain backward compatibility.

Always write production-ready code.

After completing each step, stop and wait for my approval before continuing to the next step.





# MANDATORY ARCHITECTURE & DEVELOPMENT RULES

Before implementing any Seller Dashboard feature, complete the following foundational tasks.

--------------------------------------------------

## PHASE 0 - Authentication & Authorization (Highest Priority)

Implement a complete Role-Based Authentication and Authorization system before building any dashboard feature.

Roles:

- Super Admin
- Admin
- Seller
- Customer

Requirements:

- Secure Login
- Logout
- Refresh Token
- JWT Authentication
- Protected Routes
- Role-Based Route Guards
- Permission Middleware
- Session Management
- Remember Me
- Password Reset
- Email Verification (mock if unavailable)

Never allow unauthorized users to access Seller routes.

--------------------------------------------------
## PHASE 0 - 1
## Backend Demo Data

Create backend seed/demo data before building dashboard pages.

Create demo users:

Super Admin
Email: superadmin@example.com
Password: Admin@123

Admin
Email: admin@example.com
Password: Admin@123

Seller
Email: seller@example.com
Password: Seller@123

Customer
Email: customer@example.com
Password: Customer@123

Create demo data for:

- Products
- Categories
- Brands
- Orders
- Customers
- Reviews
- Inventory
- Wallet
- Revenue
- Notifications
- Coupons
- Analytics

The dashboard must display meaningful data immediately after login.

--------------------------------------------------

## PHASE 0 - 2
## Routing Rules

Every sidebar menu MUST have its own page.

Never leave any route empty.

Every route must:

- Load successfully
- Display its page
- Use the common Seller layout
- Handle loading state
- Handle empty state
- Handle error state

No broken links.

No 404 routes from the sidebar.

--------------------------------------------------

## PHASE 0 - 3
## Layout Rules

Seller Dashboard Layout:

--------------------------------------------------
Sidebar (Left)
Header (Top inside dashboard only)
Main Content
--------------------------------------------------

The Public Website Navbar must NEVER appear inside the Seller Dashboard.

The Seller Dashboard must have its own layout.

Dashboard Layout:

- Left Sidebar
- Dashboard Header
- Main Content
- Footer (optional)

Do NOT use the Home Page Navbar inside dashboard pages.

--------------------------------------------------

## PHASE 0 - 4
## Sidebar Navigation

Every menu item must navigate to a real page.

Example:

Dashboard
/products
/products/create
/products/categories
/orders
/orders/pending
/customers
/marketing/coupons
/finance/wallet
/analytics
/settings

Every page must already exist.

--------------------------------------------------

## PHASE 0 - 5
## Page Requirements

Every page should contain:

- Page Title
- Breadcrumb
- Action Buttons
- Search Bar
- Filter
- Table or Cards
- Pagination
- Loading Skeleton
- Empty State
- Error State

No blank pages.

--------------------------------------------------

## PHASE 0 - 6
## Backend Requirements

If backend endpoints do not exist:

Create them.

If models do not exist:

Create them.

If relationships do not exist:

Create them.

If seeders do not exist:

Create them.

If permissions do not exist:

Create them.

Never leave frontend waiting for unavailable APIs.

--------------------------------------------------

## PHASE 0 - 7
## API Rules

Every page must consume a working API.

Include:

GET

POST

PUT

PATCH

DELETE

Validation

Pagination

Filtering

Sorting

Search

Authentication

Authorization

--------------------------------------------------

## PHASE 0 - 8
## Database Rules

Create proper database relationships.

Example:

Seller

→ Products

→ Orders

→ Wallet

→ Withdrawals

→ Reviews

Product

→ Category

→ Brand

→ Images

→ Inventory

Order

→ Customer

→ Product

→ Payment

→ Shipping

--------------------------------------------------

## PHASE 0 - 9
## UI Rules

Professional SaaS Dashboard

Responsive

Desktop

Tablet

Mobile

Dark Mode Ready

Light Mode

Reusable Components

Consistent Design System

--------------------------------------------------

## PHASE 0 - 10
## Code Quality

Follow SOLID principles.

Keep code modular.

Avoid duplication.

Use reusable components.

Keep APIs clean.

Use best practices.

Production-ready code only.

--------------------------------------------------

## PHASE 0 - 11
## Final Rule

Before moving to the next development step:

✔ Verify every route works.
✔ Verify every page renders correctly.
✔ Verify APIs return data.
✔ Verify demo data is visible.
✔ Verify role permissions work.
✔ Verify no existing functionality is broken.

Stop after completing each step and wait for my approval before continuing.