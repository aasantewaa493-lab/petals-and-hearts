# Petals & Hearts

A premium floral e-commerce storefront and studio operations console. The working brand name is taken from this project folder. Official logo, telephone, email, social handles, and street address remain placeholders in `src/config/brand.ts`.

## Stack

- Next.js 16 (App Router) and TypeScript
- Tailwind CSS 4
- Prisma 6 with SQLite for local development
- Auth.js (credentials + JWT)
- Paystack-ready payment interface with a local mock
- Vitest for pricing, delivery, and order-status logic

PostgreSQL is the intended production database. A `docker-compose.yml` file is included. Local SQLite is used so the store runs without Docker.

## First run

```bash
npm install
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo accounts (local only)

| Role | Email | Password |
|---|---|---|
| Administrator | `admin@localhost` | `ChangeMeNow!Admin` |
| Customer | `customer@localhost` | `Customer123!` |

Change these before any shared or production environment.

Demo promotion code: `DEMO10` (10% off merchandise over GH₵200). It is labelled as demo data.

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run db:setup` | Generate client, push schema, seed demo catalogue |
| `npm run test` | Unit tests |
| `npm run lint` | ESLint |
| `npm run build` | Production build |
| `npm run test:e2e` | Playwright journeys (requires the app and browsers) |

## Environment

Copy `.env.example` to `.env`. Required variables:

- `DATABASE_URL` — SQLite file or PostgreSQL URL
- `AUTH_SECRET` — random 32+ byte secret
- `NEXT_PUBLIC_SITE_URL` — public origin
- `PAYMENT_PROVIDER` — `mock` or `paystack`

Paystack, Resend, and image hosting stay unused until their keys are set. The mock payment page never marks an order paid unless you confirm it, and production must not use `PAYMENT_PROVIDER=mock`.

## What works locally

- Homepage, shop, categories, collections, occasions, search
- Product detail, custom bouquet builder, cart, wishlist
- Guest and account checkout with delivery-zone validation
- Mock payment verification, then a real order record
- Order tracking, account history, password reset tokens
- Newsletter and contact forms (persisted in the database)
- Admin dashboard: products, orders, inventory, reviews, content, reports

Catalogue products are **demo data**. Do not present them as live studio inventory.

## Production notes

1. Switch Prisma `provider` to `postgresql` and set `DATABASE_URL`.
2. Set `PAYMENT_PROVIDER=paystack` and Paystack keys.
3. Configure Resend for transactional email.
4. Replace brand placeholders and product photography.
5. Create a real administrator and disable the seed passwords.
6. Deploy to Vercel or an equivalent Node host.

## Money

All amounts are integer Ghana pesewas. Display uses `formatMoney`. The browser is never trusted for prices, discounts, or totals.
