
# ArtHub – Online Art Marketplace (Frontend)

Live Site: [https://arthub-sigma.vercel.app/](https://arthub-sigma.vercel.app/)

## About
ArtHub is a full‑stack digital art marketplace that connects collectors with talented artists. This repository contains the **Next.js 16 frontend** built with HeroUI, Tailwind CSS, and Gravity Icons.

## Key Features
- **Role‑based dashboards** – Buyer, Artist, and Admin dashboards with full CRUD and analytics
- **User authentication** – Email/password and Google OAuth via Better Auth
- **JWT authorization** – Secure API access with role‑based middleware (admin, artist, user)
- **Stripe payments** – One‑time artwork purchases and subscription plans (Free, Pro, Premium)
- **Dynamic browsing** – Search, filter by category, price range, sort, and pagination
- **Comment system** – Purchase‑protected comments on artwork detail pages
- **Image uploads** – Profile and artwork images stored via imgBB API
- **Dark mode** – Global theme toggle with next‑themes
- **Responsive design** – Mobile‑first layout with a polished, recruiter‑friendly UI
- **Error boundary** – Friendly fallback UI for runtime crashes

## Tech Stack
- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI Library**: HeroUI (v3) + Tailwind CSS v4
- **Icons**: Gravity UI Icons
- **Authentication**: Better Auth (email/password + Google OAuth)
- **State Management**: React Context (JWT token)
- **HTTP Client**: Custom `fetchWithAuth` with proxy support
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Notifications**: react-hot-toast

## Project Structure
```
arthub/
├── src/
│   ├── app/                   # Next.js pages and layouts
│   ├── components/            # Reusable UI components
│   │   ├── dashboard/         # Dashboard widgets and tabs
│   │   └── ...                # Navbar, Footer, Cards, etc.
│   ├── context/               # React context providers (JWT, Theme)
│   ├── lib/                   # Utility functions, API helpers, auth config
│   └── data/                  # (Removed mock data – now dynamic)
├── public/                    # Static assets
├── tailwind.config.js
├── next.config.js
└── package.json
```

## Getting Started
1. **Clone the repo**
   ```bash
   git clone <client-repo-url>
   cd arthub
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Set up environment variables**
   Create a `.env` file in the root with the following variables:
   ```env
   NEXT_PUBLIC_BASE_URL=http://localhost:5000          # Backend API URL
   BETTER_AUTH_URL=http://localhost:3000               # Auth URL (frontend)
   BETTER_AUTH_SECRET=your-secret
   MONGO_DB_URI=your-mongodb-uri
   AUTH_DB_NAME=arthub_db
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   NEXT_PUBLIC_IMAGE_UPLOAD_API=your-imgbb-api-key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   JWT_SECRET=your-jwt-secret
   ```
4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Deployment
This project is deployed on Vercel. Ensure all environment variables are set in the Vercel dashboard.

## NPM Packages (Key)
- `next`, `react`, `react-dom`
- `@heroui/react`
- `tailwindcss`
- `@gravity-ui/icons`
- `next-themes`
- `better-auth`
- `react-hot-toast`
- `jsonwebtoken`
- `stripe` (client used only for publishable key)
```
