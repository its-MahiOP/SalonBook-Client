# SalonBook — Client

A complete salon appointment booking front end built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4** and **Better Auth**.

Guests can browse the service menu, check live availability, request an appointment and pay online. Customers manage their own bookings and profile; salon administrators manage services, approve appointments, block abusive accounts and review revenue.

---

## Project Links

- **Live Website Link:** [https://salonbook-client.vercel.app](https://salonbook-client.vercel.app) *(update with your live deployed URL)*
- **Client Repository Link:** [https://github.com/its-MahiOP/SalonBook-Client](https://github.com/its-MahiOP/SalonBook-Client)
- **Server Repository Link:** [https://github.com/its-MahiOP/SalonBook-Server](https://github.com/its-MahiOP/SalonBook-Server)

---

## Features

### Public site

- Salon-branded landing page with hero, category shortcuts, featured services, testimonials and calls to action
- Service catalogue with keyword search, category filter, price/duration sorting and pagination-free responsive grid
- Service detail pages with live available time slots for the selected date
- About, Contact, Privacy Policy and Terms of Service pages
- Fully responsive layout with a persistent navbar/footer, dark mode and accessible focus states
- Custom 404, error boundary and loading UI
- SEO metadata, `robots.txt` and `sitemap.xml`

### Authentication

- Email + password sign up / sign in
- Google OAuth sign in
- Avatar upload during sign up (ImgBB)
- Forced `customer` role on public registration — no way to self-register as admin
- Session-based route protection in the server components, plus an edge cookie guard for faster redirects

### Customer dashboard

- Overview with upcoming bookings and lifetime spend
- Appointment list with status filters, cancellation and "Pay now" for pending payments
- Payment history with Stripe receipt links
- Profile editing: name, phone, avatar (upload or URL) and password change

### Admin dashboard

- Overview with revenue, bookings and customer metrics
- Service CRUD with image upload, publish/unpublish and delete confirmation
- Appointment approval and cancellation
- Customer directory with block/unblock
- Contact-form inbox with mark-as-read
- Transaction reporting
- Admin profile

### Payments

- Stripe Checkout is created by the API; the client never handles card data
- The success page polls the API until the **verified webhook** marks the appointment as paid
- Friendly pending state while Stripe confirms, and a cancellation page for abandoned checkouts

---

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16.4 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4, Base UI, Lucide icons |
| Auth | Better Auth 1.7 (MongoDB adapter, JWT plugin, Google provider) |
| Data | Express API consumed with a typed `fetch` wrapper |
| Toasts | Sonner |
| Uploads | ImgBB via a server-side route (API key never reaches the browser) |
| Payments | Stripe Checkout |

---

## Getting started

### 1. Prerequisites

- Node.js 20+
- A MongoDB database (Atlas or local)
- The **SalonBook Server** running on `http://localhost:5000`

### 2. Install

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Fill in:

| Variable | Purpose |
| --- | --- |
| `BETTER_AUTH_SECRET` | Session/JWT signing secret (`npx auth secret`) |
| `DB_URI` | MongoDB connection string (same DB as the server) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
| `IMGBB_API_KEY` | Image uploads for services and avatars |
| `NEXT_PUBLIC_SERVER_BASE_URL` | Express API URL, e.g. `http://localhost:5000` |
| `NEXT_PUBLIC_APP_URL` | Public URL of this app, used in metadata |
| `ADMIN_*` | Used only by the admin seed script |

Google OAuth redirect URI:

```
http://localhost:3000/api/auth/callback/google
```

### 4. Run

```bash
npm run dev
```

Open <http://localhost:3000>.

---

## Demo accounts

After running the server seed script and the client admin seed:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@salonbook.com` | `SalonBook123` |
| Customer | `mary.customer@example.com` | `Password123` |

Create the admin account first (sign up normally), then promote it:

```bash
npm run seed:admin
```

> These credentials are demo values only. Change them before deploying.

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Start the production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npm run format` | Prettier |
| `npm run seed:admin` | Promote the configured account to admin |

---

## Project structure

```
app/
  (public)          home, services, about, contact, privacy, terms
  sign-in/sign-up   auth pages
  dashboard/
    customer/       bookings, payments, profile
    admin/          services, appointments, customers, messages, transactions, profile
  payment/          Stripe success and cancel screens
  api/auth/         Better Auth handler + token endpoint
  api/upload/       ImgBB proxy (server-only key)
components/
  layout/           navbar, footer, shell, logo
  ui/               design-system primitives
  services/         catalogue and cards
  booking/          availability + booking panel
  dashboard/        shell, appointment cards, profile form
  admin/            service table and form
lib/                auth, API client, formatting, types, hooks
scripts/            admin seed
```

---

## Security notes

- The Express API verifies the Better Auth JWT against the public JWKS and re-reads the user from MongoDB, so role and blocked status cannot be spoofed client-side.
- Dashboard layouts re-check the session and role on the server for every request, so private pages survive refresh and direct navigation.
- `IMGBB_API_KEY` is only read server-side; browsers upload through `/api/upload`.
- Appointment payment status is only set to `paid` by the Stripe webhook on the API — never by the browser.
- `.env` files are git-ignored; only `.env.example` is committed.

---

## Deployment checklist

1. Deploy the API first and note its public URL.
2. Set `NEXT_PUBLIC_SERVER_BASE_URL`, `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to production URLs.
3. Add the production Google redirect URI.
4. Add the production domain to the server's `CLIENT_URL`.
5. Run `npm run build` locally before deploying to catch type errors.

---

## License

Built as a portfolio/assignment project. You are free to adapt it for learning purposes.
