# Free Invoice Generator App

A complete invoice generator application built with Next.js 14, Supabase, and Tailwind CSS.

## Features

- User authentication with Supabase
- Customer management (CRUD)
- Product management (CRUD)
- Invoice management (CRUD)
- PDF generation
- Google AdSense integration
- Role-based access (Free vs Pro)
- Payment integration (Razorpay)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=your_adsense_id
```

3. Set up Supabase database (see database schema in `lib/supabase/schema.sql`)

4. Run the development server:
```bash
npm run dev
```

## Database Schema

See `lib/supabase/schema.sql` for the complete database schema and RLS policies.

