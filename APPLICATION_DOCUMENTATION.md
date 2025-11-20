# Horizon Invoice Generator - Complete Application Documentation

## 📋 Table of Contents
1. [Core Idea & Concept](#core-idea--concept)
2. [Application Architecture](#application-architecture)
3. [Database Design](#database-design)
4. [Technology Stack](#technology-stack)
5. [Features & Functionality](#features--functionality)
6. [Payment Integration (Razorpay)](#payment-integration-razorpay)
7. [AdSense Integration](#adsense-integration)
8. [Theme System](#theme-system)
9. [Invoice Templates](#invoice-templates)
10. [User Management & Authentication](#user-management--authentication)
11. [Deployment & Configuration](#deployment--configuration)

---

## 🎯 Core Idea & Concept

### Vision
**Horizon** is a modern, cloud-based invoice generation platform designed to help small businesses, freelancers, and entrepreneurs create professional invoices quickly and efficiently. The application provides a freemium model with subscription-based premium features.

### Target Audience
- Small business owners
- Freelancers and consultants
- Entrepreneurs
- Service providers
- E-commerce businesses

### Value Proposition
1. **Free Tier**: Basic invoice generation with limited templates
2. **Pro Tier**: Monthly subscription (₹149/month) with advanced features
3. **Max Tier**: One-time lifetime payment (₹1,499) with all features unlocked
4. **Personalized**: Custom enterprise solutions (contact: horizoninvoicegen@gmail.com)

### Business Model
- **Free Plan**: 1 template, ads displayed, limited resources
- **Pro Plan**: 4 templates, all features, no ads, monthly subscription
- **Max Plan**: All templates, all features, no ads, lifetime access
- **Revenue Streams**: 
  - Subscription fees (Pro & Max)
  - Google AdSense (Free users)
  - Enterprise custom solutions

---

## 🏗️ Application Architecture

### Tech Stack Overview
- **Frontend Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS with custom theme system
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Payment Gateway**: Razorpay
- **Monetization**: Google AdSense
- **Deployment**: Vercel (recommended)

### Architecture Pattern
```
┌─────────────────────────────────────────┐
│         Client (Browser)                 │
│  ┌───────────────────────────────────┐  │
│  │   Next.js App Router              │  │
│  │   - Server Components              │  │
│  │   - Client Components              │  │
│  │   - API Routes                     │  │
│  └───────────────────────────────────┘  │
└───────────────┬───────────────────────┘
                │
    ┌───────────┴───────────┐
    │                       │
┌───▼────┐          ┌───────▼──────┐
│Supabase│          │   Razorpay    │
│  Auth  │          │   Payment     │
│  DB    │          │   Gateway     │
│Storage │          └───────────────┘
└────────┘
```

### File Structure
```
invoice/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── payment/       # Payment processing
│   │   └── profile/       # Profile management
│   ├── dashboard/         # User dashboard
│   ├── invoices/          # Invoice management
│   ├── customers/         # Customer management
│   ├── products/          # Product management
│   └── ...
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── ui/               # UI components
│   ├── invoices/         # Invoice-related components
│   └── theme/            # Theme components
├── lib/                   # Utilities and helpers
│   ├── supabase/         # Supabase configuration
│   ├── hooks/            # Custom React hooks
│   └── currency.ts       # Currency utilities
└── public/               # Static assets
```

---

## 🗄️ Database Design

### Database: Supabase (PostgreSQL)

### Tables Overview

#### 1. **customers**
Stores customer information for invoice generation.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| name | VARCHAR(255) | Customer name |
| email | VARCHAR(255) | Customer email |
| phone | VARCHAR(50) | Contact number |
| address | TEXT | Full address |
| city | VARCHAR(100) | City |
| state | VARCHAR(100) | State/Province |
| zip_code | VARCHAR(20) | Postal code |
| country | VARCHAR(100) | Country (default: 'USA') |
| tax_id | VARCHAR(100) | Tax identification number |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### 2. **products**
Stores product/service catalog.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| name | VARCHAR(255) | Product name |
| description | TEXT | Product description |
| price | DECIMAL(10,2) | Unit price |
| tax_rate | DECIMAL(5,2) | Tax percentage (default: 0) |
| unit | VARCHAR(50) | Unit of measurement |
| sku | VARCHAR(100) | Stock keeping unit |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### 3. **invoices**
Main invoice table storing invoice metadata.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| invoice_number | VARCHAR(100) | Unique invoice number |
| customer_id | UUID | Foreign key to customers |
| issue_date | DATE | Invoice issue date |
| due_date | DATE | Payment due date |
| status | VARCHAR(20) | Status: draft, sent, paid, overdue, cancelled |
| subtotal | DECIMAL(10,2) | Subtotal amount |
| tax_amount | DECIMAL(10,2) | Total tax amount |
| discount_amount | DECIMAL(10,2) | Discount amount |
| total_amount | DECIMAL(10,2) | Final total amount |
| currency | VARCHAR(3) | Currency code (default: 'USD') |
| notes | TEXT | Additional notes |
| terms | TEXT | Terms and conditions |
| template | VARCHAR(50) | Invoice template name |
| logo_url | TEXT | Company logo URL |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### 4. **invoice_items**
Stores line items for each invoice.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| invoice_id | UUID | Foreign key to invoices |
| product_id | UUID | Foreign key to products (nullable) |
| description | TEXT | Item description |
| quantity | DECIMAL(10,2) | Quantity |
| unit_price | DECIMAL(10,2) | Unit price |
| tax_rate | DECIMAL(5,2) | Tax rate for this item |
| line_total | DECIMAL(10,2) | Line total (quantity × unit_price + tax) |
| created_at | TIMESTAMP | Creation timestamp |

#### 5. **payments**
Tracks payment records (for future payment tracking features).

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| invoice_id | UUID | Foreign key to invoices (nullable) |
| amount | DECIMAL(10,2) | Payment amount |
| payment_method | VARCHAR(50) | Payment method |
| payment_date | DATE | Payment date |
| transaction_id | VARCHAR(255) | Transaction reference |
| status | VARCHAR(20) | Status: pending, completed, failed, refunded |
| notes | TEXT | Payment notes |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### 6. **user_profiles**
Extended user profile with subscription and business information.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users (unique) |
| role | VARCHAR(20) | User role: free, pro, max |
| subscription_type | VARCHAR(50) | Subscription type: free, pro_monthly, max_lifetime |
| subscription_id | VARCHAR(255) | Payment subscription ID |
| subscription_status | VARCHAR(50) | Subscription status |
| subscription_end_date | TIMESTAMP | Subscription expiration date |
| country | VARCHAR(2) | Country code (default: 'IN') |
| currency | VARCHAR(3) | Currency code (default: 'INR') |
| logo_url | TEXT | Shop/business logo URL |
| shop_name | VARCHAR(255) | Business/shop name |
| shop_address | TEXT | Business address |
| shop_email | VARCHAR(255) | Business contact email |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### Database Features

#### Row Level Security (RLS)
All tables have RLS enabled with policies ensuring users can only access their own data:
- **SELECT**: Users can only view their own records
- **INSERT**: Users can only create records with their user_id
- **UPDATE**: Users can only update their own records
- **DELETE**: Users can only delete their own records

#### Indexes
Performance indexes on frequently queried columns:
- `user_id` on all user-owned tables
- `customer_id` on invoices
- `invoice_id` on invoice_items

#### Triggers
- **Auto-update timestamps**: `updated_at` automatically updates on record modification
- **User profile creation**: Automatically creates user profile on signup via `handle_new_user()` function

#### Foreign Key Relationships
```
auth.users
  └── user_profiles (1:1)
  └── customers (1:many)
  └── products (1:many)
  └── invoices (1:many)
  └── payments (1:many)

customers
  └── invoices (1:many)

products
  └── invoice_items (1:many)

invoices
  └── invoice_items (1:many)
  └── payments (1:many)
```

---

## 💳 Payment Integration (Razorpay)

### Overview
Razorpay is integrated for processing subscription payments for Pro and Max plans.

### Payment Flow

```
1. User clicks "Upgrade" → Selects plan (Pro/Max)
2. Frontend calls /api/payment/create
3. Backend creates Razorpay order
4. Frontend opens Razorpay checkout
5. User completes payment
6. Razorpay webhook → /api/payment/webhook
7. Backend verifies payment and updates user profile
8. Frontend verifies payment → /api/payment/verify
9. User account upgraded
```

### API Endpoints

#### 1. `/api/payment/create` (POST)
Creates a Razorpay order for the selected plan.

**Request:**
```json
{
  "plan": "pro" | "max"
}
```

**Response:**
```json
{
  "orderId": "order_xxx",
  "amount": 14900,
  "currency": "INR",
  "keyId": "rzp_test_xxx"
}
```

**Process:**
1. Authenticates user
2. Validates plan selection
3. Fetches user's currency from profile
4. Creates Razorpay order with metadata (user_id, plan, subscription_type)
5. Returns order details for frontend

#### 2. `/api/payment/webhook` (POST)
Handles Razorpay webhook events for payment status updates.

**Events Handled:**
- `payment.captured`: Updates user profile with subscription
- `payment.failed`: Logs failed payment
- `subscription.cancelled`: Handles subscription cancellation

**Security:**
- Verifies webhook signature using HMAC SHA256
- Uses `RAZORPAY_WEBHOOK_SECRET` for verification

**Process:**
1. Verifies webhook signature
2. Parses event payload
3. Extracts user_id and plan from order notes
4. Updates `user_profiles` table:
   - **Pro**: Sets role='pro', subscription_type='pro_monthly', end_date=30 days
   - **Max**: Sets role='max', subscription_type='max_lifetime', no end_date

#### 3. `/api/payment/verify` (POST)
Client-side payment verification endpoint.

**Request:**
```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx"
}
```

**Response:**
```json
{
  "message": "Payment verified successfully",
  "subscription": "pro_monthly"
}
```

**Process:**
1. Verifies payment signature using Razorpay SDK
2. Confirms payment status
3. Returns success message

### Pricing

| Plan | Price (INR) | Price (Paise) | Billing |
|------|------------|---------------|---------|
| Pro | ₹149 | 14,900 | Monthly |
| Max | ₹1,499 | 149,900 | One-time (Lifetime) |

### Currency Support
- Automatically detects user's country during signup
- Maps country to currency (40+ countries supported)
- Uses user's currency for payment processing
- Default: INR (Indian Rupee)

### Subscription Management

#### Pro Plan (Monthly)
- Subscription renews every 30 days
- `subscription_end_date` set to 30 days from payment
- Auto-downgrade to free if payment fails

#### Max Plan (Lifetime)
- One-time payment
- No expiration date
- Permanent access to all features

---

## 📢 AdSense Integration

### Overview
Google AdSense is integrated to monetize the free tier of the application.

### Implementation

#### 1. Script Loading (`app/layout.tsx`)
```typescript
{adsenseId && (
  <Script
    async
    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
    strategy="afterInteractive"
    crossOrigin="anonymous"
  />
)}
```

#### 2. AdSense Component (`components/layout/AdSense.tsx`)
- Only displays ads for free users
- Hidden for Pro and Max subscribers
- Uses dynamic import for performance
- Responsive ad format

#### 3. Ad Placement
- **Homepage**: Below hero section
- **Dashboard**: Top of page (for free users only)
- **Other pages**: Strategic placement without disrupting UX

### Configuration

**Environment Variable:**
```
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-xxxxxxxxxxxxx
```

**Ad Format:**
- Type: Auto ads (responsive)
- Display: Block format
- Responsive: Full-width responsive

### Ad Display Logic
```typescript
if (isPro || isMax || loading) return null  // Hide ads for paid users
```

### Revenue Model
- Free users see ads → AdSense revenue
- Pro/Max users → No ads → Subscription revenue
- Dual monetization strategy

---

## 🎨 Theme System

### Theme Architecture
The application supports 4 distinct color themes with dark/light mode:

1. **Minimalist** (Default Recommended)
   - Clean, simple design
   - Neutral colors
   - Professional appearance

2. **Classic Neutrals**
   - Traditional business look
   - Gray and blue tones
   - Corporate feel

3. **Earthy Modern**
   - Warm, natural colors
   - Earth tones
   - Modern aesthetic

4. **Serene Coastline**
   - Ocean-inspired palette
   - Calm, soothing colors
   - Fresh appearance

### Implementation

#### CSS Variables (`app/globals.css`)
```css
:root {
  --primary-50: #...;
  --primary-100: #...;
  /* ... */
}
```

#### Theme Provider (`components/theme/ThemeProvider.tsx`)
- Manages theme state
- Provides theme context
- Handles theme persistence

#### Color Scheme Provider (`components/theme/ColorSchemeProvider.tsx`)
- Manages dark/light mode
- Syncs with system preferences
- Provides color scheme context

#### Theme Selector (`app/settings/page.tsx`)
- Dropdown to select theme
- Real-time theme switching
- Persists selection

### Dark Mode
- Automatic system detection
- Manual toggle available
- Theme-aware components
- Smooth transitions

---

## 📄 Invoice Templates

### Available Templates

#### 1. **Professional Template** (Free)
- Dark header with golden accents
- Modern layout
- Clean typography
- Professional appearance

#### 2. **Default Template** (Free)
- Standard invoice layout
- Simple design
- Easy to read

#### 3. **Modern Template** (Pro)
- Contemporary design
- Bold typography
- Color accents

#### 4. **Classic Template** (Pro)
- Traditional layout
- Formal appearance
- Business-oriented

#### 5. **Minimal Template** (Pro)
- Minimalist design
- Clean lines
- Focus on content

### Template Features
- **4 Color Variations**: Each template has 4 color theme variations
- **Distinct Structures**: Different field placements and layouts
- **Responsive Design**: Works on all screen sizes
- **PDF Export**: All templates support PDF export
- **Logo Support**: Custom business logos
- **Customization**: Shop name, address, email, country

### Template Access Control
- **Free Users**: Professional, Default (2 templates)
- **Pro Users**: All 5 templates
- **Max Users**: All 5 templates

### Template Rendering
- Server-side rendering for PDF generation
- Client-side preview for live editing
- Dynamic template switching
- Template-specific styling

---

## 👤 User Management & Authentication

### Authentication Flow

#### Signup
1. User provides email, password, country
2. Supabase Auth creates user account
3. `handle_new_user()` trigger creates user profile
4. Default role: 'free'
5. Country → Currency mapping applied

#### Login
1. Email/password authentication via Supabase
2. Session management via Supabase Auth
3. Protected routes redirect to login if not authenticated

#### Profile Management
- **Shop Details**: Name, address, email
- **Logo Upload**: Supabase Storage integration
- **Country Selection**: Auto-updates currency
- **Account Type**: Display subscription status

### User Roles

| Role | Features | Templates | Ads |
|------|----------|-----------|-----|
| Free | Basic features | 2 | Yes |
| Pro | All features | 5 | No |
| Max | All features | 5 | No |

### User Profile Fields
- `role`: free, pro, max
- `subscription_type`: free, pro_monthly, max_lifetime
- `subscription_status`: active, canceled, expired
- `subscription_end_date`: Expiration date (null for Max)
- `country`: Country code
- `currency`: Currency code
- `logo_url`: Business logo
- `shop_name`: Business name
- `shop_address`: Business address
- `shop_email`: Business email

---

## 🚀 Deployment & Configuration

### Environment Variables

#### Required
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# AdSense (Optional)
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=your_adsense_id
```

### Deployment Steps

#### 1. Supabase Setup
- Create Supabase project
- Run `lib/supabase/schema.sql` in SQL Editor
- Enable Storage bucket: `user-uploads`
- Configure RLS policies

#### 2. Razorpay Setup
- Create Razorpay account
- Get API keys (Key ID & Secret)
- Configure webhook URL: `https://your-domain.com/api/payment/webhook`
- Set webhook events: `payment.captured`, `payment.failed`
- Copy webhook secret

#### 3. AdSense Setup
- Create Google AdSense account
- Add website domain
- Get Publisher ID
- Wait for approval (1-2 days)

#### 4. Vercel Deployment
- Connect GitHub repository
- Add environment variables
- Deploy
- Configure custom domain (optional)

### Performance Optimizations

#### Build Optimizations
- Turbopack enabled for faster dev builds
- Dynamic imports for heavy components
- Code splitting
- Optimized icon imports
- Tailwind CSS purging

#### Runtime Optimizations
- Server-side rendering for static content
- Client-side rendering for interactive components
- Caching user data (5-second cache)
- Optimized database queries
- Image optimization

### Security Features
- Row Level Security (RLS) on all tables
- Authentication required for all protected routes
- Webhook signature verification
- Payment signature verification
- Environment variable protection
- HTTPS enforced

---

## 📊 Features Summary

### Core Features
✅ User authentication (Signup/Login)  
✅ Customer management (CRUD)  
✅ Product management (CRUD)  
✅ Invoice creation with live preview  
✅ Multiple invoice templates  
✅ PDF export  
✅ Excel export  
✅ Invoice status tracking  
✅ Currency support (40+ countries)  
✅ Dark/Light mode  
✅ 4 color themes  
✅ Responsive design  

### Pro/Max Features
✅ All invoice templates (5 total)  
✅ No advertisements  
✅ Advanced customization  
✅ Priority support  
✅ Unlimited invoices  

### Business Features
✅ Shop logo upload  
✅ Business information management  
✅ Country-based currency  
✅ Subscription management  
✅ Payment processing  

---

## 🔐 Security Considerations

1. **Authentication**: Supabase Auth with secure session management
2. **Authorization**: RLS policies ensure data isolation
3. **Payment Security**: Razorpay signature verification
4. **Webhook Security**: HMAC signature verification
5. **Environment Variables**: Sensitive data in environment variables
6. **HTTPS**: Enforced in production
7. **Input Validation**: Server-side validation on all inputs
8. **SQL Injection Prevention**: Parameterized queries via Supabase

---

## 📈 Future Enhancements

### Planned Features
- Email invoice delivery
- Recurring invoices
- Payment reminders
- Advanced reporting
- Multi-currency invoices
- Invoice templates marketplace
- Mobile app
- API access for integrations
- Team collaboration
- Client portal

---

## 📞 Support & Contact

- **Email**: horizoninvoicegen@gmail.com
- **Website**: [Your deployed URL]
- **Documentation**: This file

---

## 📝 License

[Specify your license here]

---

**Last Updated**: [Current Date]  
**Version**: 1.0.0  
**Maintained by**: Horizon Team

