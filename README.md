# Ghaya Travel Platform

A production-ready travel booking platform for Ghaya Travel built with Next.js 14, TypeScript, Tailwind CSS, Prisma, and PostgreSQL. It delivers localized marketing pages, flight search with seat selection, unified booking wizard, payments abstraction, admin dashboard, and automated notifications.

## Features

- ✅ App Router, React Server Components, next-intl (ar/en) with RTL support.
- 🎨 Tailwind CSS with shadcn/ui design tokens using off-white/lebny/dark-orange palette.
- 🛳 Travel packages module with itineraries, add-ons, reviews, wishlist, and SEO metadata.
- ✈️ In-site flight search, seat map selection, and mock Duffel provider to ticket bookings.
- 💳 Payments abstraction (Stripe, PayPal, Fawry mock) and multi-currency pricing.
- 📄 Booking wizard with PDF invoice generation and messaging via email/WhatsApp.
- 🔐 next-auth with credentials + Google/Facebook, RBAC, and secure middleware headers.
- 🗺 Google Maps embeds, virtual tour slot, and blog/SEO utilities (sitemap, JSON-LD).
- 🧪 Jest unit tests and Playwright smoke test, GitHub Actions CI, Husky + lint-staged.
- 🐳 Dockerfile & docker-compose for local deployment.

## Getting Started

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Configure environment**
   - Copy `.env.example` to `.env` and fill provider keys. Leave blank to use safe mocks.
   - Update `DATABASE_URL` to point to PostgreSQL (use `docker-compose up db` for local).

3. **Database setup**
   ```bash
   pnpm prisma migrate deploy
   pnpm prisma db seed
   ```

4. **Run development server**
   ```bash
   pnpm dev
   ```
   The app is available at [http://localhost:3000](http://localhost:3000).

5. **Run tests & lint**
   ```bash
   pnpm lint
   pnpm test
   pnpm e2e # requires `pnpm dev`
   ```

6. **Build for production**
   ```bash
   pnpm build && pnpm start
   ```

## Scripts

- `pnpm dev` – Start dev server
- `pnpm build` / `pnpm start` – Production build
- `pnpm lint` – ESLint
- `pnpm test` – Jest unit tests
- `pnpm e2e` – Playwright tests
- `pnpm db:seed` – Seed database with sample content

## Troubleshooting

- Ensure PostgreSQL is running and credentials match `DATABASE_URL`.
- When provider keys are missing, the app logs warnings and falls back to mock data.
- Delete `.next` and rerun `pnpm dev` if Tailwind classes seem stale.
- For Docker, run `docker-compose up --build`.

## License

MIT © Ghaya Travel
