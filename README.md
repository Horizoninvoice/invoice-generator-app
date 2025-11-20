# Horizon Invoice Generator

A modern, cloud-based invoice generation platform built with React, Vite, and Supabase.

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payment**: Razorpay
- **Monetization**: Google AdSense
- **Icons**: Lucide React
- **PDF**: React-PDF

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Razorpay account (for payments)
- Google AdSense account (optional)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd horizon-invoice-generator
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_GOOGLE_ADSENSE_ID=your_adsense_id
```

4. Run the development server
```bash
npm run dev
```

5. Build for production
```bash
npm run build
```

## Features

- ✅ User authentication (Signup/Login)
- ✅ Customer management
- ✅ Product management
- ✅ Invoice creation
- ✅ Multiple invoice templates
- ✅ Theme system (4 themes + dark/light mode)
- ✅ Subscription management (Free/Pro/Max)
- ✅ Payment processing (Razorpay)
- ✅ AdSense integration

## Project Structure

```
src/
├── components/     # Reusable components
├── contexts/      # React contexts (Auth, Theme)
├── lib/          # Utilities and configurations
├── pages/        # Page components
└── main.tsx      # Entry point
```

## License

MIT

