# CONTENT_TODO — Replace before launch

Every item below appears as a literal placeholder in the codebase. Search for the token to find and replace it.

## Contact & company facts
- `[PHONE]` → real phone (`NEXT_PUBLIC_PHONE`)
- `[WHATSAPP_NUMBER]` → real WhatsApp number, format `234XXXXXXXXXX` (`NEXT_PUBLIC_WHATSAPP`)
- `[EMAIL]` → real email (`NEXT_PUBLIC_EMAIL`, `ADMIN_EMAIL`, `ADMIN_EMAIL_ALERTS`)
- `[OFFICE_ADDRESS]` → real Abuja office address (`NEXT_PUBLIC_ADDRESS`)
- `[BUSINESS_HOURS]` → real hours (`NEXT_PUBLIC_BUSINESS_HOURS`)
- `[INSTAGRAM]`, `[FACEBOOK]`, `[X/TWITTER]`, `[LINKEDIN]` → social URLs (`NEXT_PUBLIC_*`)
- Map pin in `app/contact/page.tsx` → `[CONFIRM]` exact geo coordinates (`lib/site.ts` → `geo`)

## Company claims (do NOT invent)
- `[CONFIRM]` founding year & story details (`app/about/page.tsx`)
- `[CONFIRM]` team member names & roles (`app/about/page.tsx`)
- `[CONFIRM]` certifications, partner & brand logos (`app/about/page.tsx`)
- `[CONFIRM]` warranty terms per product (`db/seed-data.ts`)
- `[CONFIRM]` brand names on products (`db/seed-data.ts`)
- `[CONFIRM]` financing/installment options (`app/page.tsx` Why Choose Us, FAQ)
- `[CONFIRM_AREAS]` service coverage beyond listed Abuja districts
- `[CONFIRM]` site survey scheduling times (FAQ answer)
- `[CONFIRM DATE]` privacy policy last-updated + legal review (`app/privacy/page.tsx`)

## Imagery — replace `[REPLACE_IMAGE]` placeholders
All photos currently render a branded placeholder. Add real WebP/AVIF files under `public/images/` and set URLs in:
- Hero & About photos (`app/page.tsx`, `app/about/page.tsx`)
- Project cover images (`db/seed-data.ts` → `seedProjects`, `public/images/projects/`)
- Product images (`db/seed-data.ts` → `seedProducts`, `public/images/products/`)
- Blog covers (`db/seed-data.ts` → `seedBlogPosts`, `public/images/blog/`)
- Team portraits (`app/about/page.tsx`)

## Pricing logic
- `[CONFIRM_PRICING_LOGIC]` in `lib/solar.ts` (`estimatePriceRange`) — replace ballpark ₦ constants with real, current pricing before showing the calculator range publicly (or hide the range until confirmed).

## Stats counters
Home-page stats default to sample numbers (`120 projects`, `95 clients`, `350 kW`, `6 years`) in `db/seed-data.ts` → `seedSettings`. Set real figures in **Admin → Site Settings** (or hide by setting accurate values).

## Testimonials
Seeded testimonials use realistic-but-sample names (`Mrs. Chidinma E.`, etc.). Replace with real client quotes (with permission) via **Admin → Testimonials**.

## Analytics
- `NEXT_PUBLIC_GA_ID` → real GA4 measurement ID
- `NEXT_PUBLIC_META_PIXEL_ID` → real Meta Pixel ID (wire pixel script if needed)

## Post-launch checklist
- [ ] All env vars set in Vercel
- [ ] Admin password rotated from seed value
- [ ] Google Business Profile claimed & linked
- [ ] Real photos uploaded; Lighthouse ≥ 90 re-checked
- [ ] Test quote form → lead appears in admin + email alert received
- [ ] Test calculator submission end-to-end
- [ ] Domain SSL active; canonical URLs point to production
- [ ] Privacy policy legally reviewed
