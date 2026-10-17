# Alabsglobalconcept — Solar Installation & Supply Website

Production-grade, conversion-driven website and lightweight admin system for **Alabsglobalconcept**, a solar installation and equipment supply company based in **Abuja (FCT), Nigeria**.

## Stack

- **Next.js 14 (App Router) + TypeScript**
- **Tailwind CSS** with custom design tokens (`app/globals.css`, `tailwind.config.ts`)
- **Neon (serverless Postgres)** + **Drizzle ORM** (migrations in `db/migrations`)
- **Admin auth:** custom JWT (`jose`) + `bcryptjs`, httpOnly secure cookies
- **Forms:** React Hook Form + Zod (shared schemas in `lib/validation.ts`)
- **Animation:** Framer Motion · **Icons:** Lucide
- **Email:** Brevo (gracefully skipped when unconfigured)
- **Deploy:** Vercel

## Quick start

```bash
# 1. Install
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env — at minimum set DATABASE_URL, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD

# 3. Push schema to Neon
npm run db:generate   # already generated → db/migrations/0000_init.sql
npm run db:migrate    # apply migrations (or: npm run db:push for dev)

# 4. Seed sample content (admin comes from migration 0001_seed_admin)
npm run db:seed

# 5. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin at `/admin/login`.

> **No database yet?** The site still runs: public pages render rich sample content from `db/seed-data.ts`. Quote forms log to the server console until `DATABASE_URL` is set.

## Neon setup

1. Create a project at [neon.tech](https://neon.tech).
2. Copy the **pooled** connection string into `DATABASE_URL` (keep `sslmode=require`).
3. Run `npm run db:migrate` then `npm run db:seed`.

## Admin

- URL: `/admin/login`
- Seeded by migration `db/migrations/0001_seed_admin.sql` (default `admin@alabsglobalconcept.com` / `Admin123`)
- Modules: Overview · Leads/Quotes (pipeline, search, CSV export) · Products (CRUD) · Projects (CRUD) · Testimonials · FAQs · Blog · Site settings (announcement bar, hero, stats)
- Every new lead triggers an email alert to `ADMIN_EMAIL_ALERTS` (requires `BREVO_SMTP_USER` / `BREVO_SMTP_PASS`)

**Rotate the seeded admin password after first login** (update hash via SQL).

## Deploying to Vercel

1. Push this repo to GitHub/GitLab.
2. In Vercel: **Add New Project** → import repo (framework auto-detected: Next.js).
3. Add all variables from `.env.example` in **Project → Settings → Environment Variables** (set `NEXT_PUBLIC_SITE_URL` to your production domain).
4. Deploy. Then connect your custom domain under **Settings → Domains** and point DNS (A/CNAME) as Vercel instructs.
5. After the first production deploy, re-run migrations against Neon (`npm run db:migrate` locally against the prod URL, or via a one-off CI step) and seed if needed.

## Editing content

| What | Where |
|---|---|
| Public copy (services, FAQ seed) | `db/seed-data.ts`, `lib/data/services.ts` |
| Design tokens / palette | `app/globals.css`, `tailwind.config.ts` |
| Contact info & socials | `.env` (`NEXT_PUBLIC_*`) |
| Announcement bar / hero / stats | Admin → Site Settings (DB), seed fallback in `db/seed-data.ts` |
| Appliance presets (calculator) | `lib/solar.ts` |
| Sizing formulas | `lib/solar.ts` (fully commented) |

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run db:generate` | Generate SQL migration from schema |
| `npm run db:migrate` | Apply migrations |
| `npm run db:push` | Push schema without migration files (dev) |
| `npm run db:seed` | Seed sample content (admin comes from `db:migrate`) |
| `npm run db:studio` | Drizzle Studio (DB GUI) |

## Google Business Profile

After launch, claim/create your **Google Business Profile** for the Abuja office address and link the website. Add the map embed URL used in `app/contact/page.tsx` as reference for the pin location `[CONFIRM]`.

## Security notes

- All inputs validated server-side with Zod (`lib/validation.ts`)
- Admin JWT in httpOnly, secure, sameSite=lax cookies; bcrypt (12 rounds)
- Honeypot + fixed-window rate limiting on lead forms and login
- Secrets only in env — never in client bundles
- `/admin/*` disallowed in `robots.txt`

See **CONTENT_TODO.md** for every placeholder that must be replaced before launch.
