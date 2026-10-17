import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  BadgeCheck,
  Truck,
  Calculator,
  Sun,
  Home as HomeIcon,
  Building2,
  Package,
  Wrench,
  Lightbulb,
  Droplets,
  Cctv,
  CheckCircle2,
  ClipboardList,
  Ruler,
  HardHat,
  Headphones,
  Wallet,
  Sparkles,
  MapPin,
  Zap,
  Fuel,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { Counter, Reveal } from "@/components/motion/Motion";
import { SmartImage } from "@/components/media/SmartImage";
import { TestimonialsSlider } from "@/components/home/TestimonialsSlider";
import {
  getSiteSettings,
  getProducts,
  getFeaturedProjects,
  getTestimonials,
  getFaqs,
} from "@/lib/queries";
import { SERVICES } from "@/lib/data/services";
import { whatsappLink, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/site";
import { formatNaira } from "@/lib/utils";
import { IMAGES } from "@/lib/data/images";

export const metadata: Metadata = {
  title: "Solar Installation & CCTV Supply in Abuja | Power & Security for Homes & Businesses",
  description:
    "Alabsglobalconcept is a solar installation, equipment supply and CCTV company in Abuja, FCT. Panels, inverters, batteries, complete kits and CCTV cameras — certified installers, warranty-backed systems, nationwide delivery.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [settings, products, projects, testimonials, faqs] = await Promise.all([
    getSiteSettings(),
    getProducts({ featured: true }),
    getFeaturedProjects(3),
    getTestimonials(),
    getFaqs(),
  ]);

  const headline = settings.heroHeadline || "Cut Fuel Costs. Keep the Lights On. Stay Secure.";
  const subheadline =
    settings.heroSubheadline ||
    "Abuja's trusted solar installation, equipment supply and CCTV company.";
  const stats = [
    { label: "Projects Completed", value: settings.statProjects ?? 120, suffix: "+" },
    { label: "Happy Clients", value: settings.statClients ?? 95, suffix: "+" },
    { label: "kW Installed", value: settings.statKwInstalled ?? 350, suffix: "+" },
    { label: "Years of Experience", value: settings.statYears ?? 6, suffix: "" },
  ];

  const serviceIcons = [HomeIcon, Building2, Package, Wrench, Lightbulb, Droplets, Cctv];

  const homeFaqs = faqs.slice(0, 6).map((f) => ({ question: f.question, answer: f.answer }));

  // Simple fuel-vs-solar comparison placeholders [CONFIRM_PRICING_LOGIC]
  const monthlyGenerator = 120_000; // illustrative 5-yr fuel+servicing share
  const monthlySolarTopup = 0;

  return (
    <>
      {/* ---------------------------------------------------------------- HERO */}
      <section className="relative overflow-hidden bg-deep-950 text-white">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40" aria-hidden />
        <div className="absolute inset-0 sun-glow" aria-hidden />
        {/* Decorative sun */}
        <div
          className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-sun-400/20 blur-3xl"
          aria-hidden
        />
        <div className="container-page relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-2xl">
            <Reveal>
              <p className="eyebrow-dark">
                <Cctv className="h-3.5 w-3.5" aria-hidden />
                Solar &amp; CCTV Company in Abuja, FCT
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-5 text-display-2xl heading-display-dark">{headline}</h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
                {subheadline}
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/contact" size="lg" variant="primary">
                  Get a Free Quote <ArrowRight className="h-4 w-4" aria-hidden />
                </ButtonLink>
                <ButtonLink href="/solar-calculator" size="lg" variant="dark">
                  <Calculator className="h-4 w-4" aria-hidden /> Calculate Your System
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={0.32}>
              <ul className="mt-10 flex flex-wrap gap-3">
                {[
                  { icon: BadgeCheck, label: "Certified Installers" },
                  { icon: ShieldCheck, label: "Warranty-Backed" },
                  { icon: Truck, label: "Nationwide Delivery" },
                ].map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/85"
                  >
                    <Icon className="h-4 w-4 text-sun-400" aria-hidden />
                    {label}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Hero visual [REPLACE_IMAGE] */}
          <Reveal delay={0.15} className="relative">
            <div className="relative rounded-3xl border border-white/10 bg-white/5 p-3 backdrop-blur">
              <SmartImage
                src={IMAGES.hero}
                alt="Solar panels installed on a modern rooftop in Abuja, powering a family home"
                ratio="aspect-[4/3]"
                className="rounded-2xl"
                priority
              />
              <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-white/10 bg-deep-900/90 p-4 shadow-card-hover backdrop-blur sm:block">
                <p className="text-xs font-medium uppercase tracking-wider text-white/50">Typical home</p>
                <p className="mt-1 font-display text-2xl font-bold text-sun-400">5kVA</p>
                <p className="text-xs text-white/60">Silent backup, day & night</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ----------------------------------------------------------- TRUST BAR */}
      <section className="border-b border-slate-200 bg-white" aria-label="Company statistics">
        <div className="container-page grid grid-cols-2 divide-slate-200 py-10 md:grid-cols-4 md:divide-x">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} className="px-4 py-4 text-center">
              <p className="font-display text-display-md font-bold text-deep-900">
                <Counter to={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-sm font-medium text-muted">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------------- SERVICES */}
      <section className="section-pad bg-surface">
        <div className="container-page">
          <SectionHeading
            eyebrow="What we do"
            title="Solar & security services built for Nigerian realities"
            description="From compact home kits to commercial installations, street lighting and CCTV systems — we handle design, supply, installation and support end to end."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, i) => {
              const Icon = serviceIcons[i] ?? Sun;
              return (
                <Reveal key={service.slug} delay={i * 0.05}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="card card-hover group flex h-full flex-col p-7"
                  >
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sun-400/15 text-sun-600 transition group-hover:bg-sun-400 group-hover:text-deep-900">
                      <Icon className="h-5.5 w-5.5" aria-hidden />
                    </span>
                    <h3 className="mt-5 font-display text-lg font-bold text-deep-900">{service.shortName}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{service.tagline}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-sun-600">
                      Learn more
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- WHY CHOOSE US */}
      <section className="section-pad bg-deep-950 text-white">
        <div className="container-page grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              dark
              eyebrow="Why choose us"
              title="Quality equipment. Honest sizing. Support after handover."
              description="We're not a roadside panel shop. Every system we install is engineered for Abuja's sun, dust and outage patterns — and backed by people who pick up the phone."
            />
            <ul className="mt-10 space-y-5">
              {[
                {
                  icon: ShieldCheck,
                  title: "Genuine, warranty-backed equipment",
                  text: "Tier-1 panels, inverters and batteries with documented warranties.",
                },
                {
                  icon: HardHat,
                  title: "Expert, tidy installation",
                  text: "Certified installers who respect your roof, your time and your compound.",
                },
                {
                  icon: Headphones,
                  title: "After-sales support that answers",
                  text: "Troubleshooting, monitoring help and maintenance visits — we don't disappear after commissioning.",
                },
                {
                  icon: Wallet,
                  title: "Transparent pricing",
                  text: "Itemised quotes with no hidden charges. You'll know exactly what you're paying for.",
                },
                {
                  icon: Sparkles,
                  title: "Flexible payment options",
                  text: "Staged payments and instalment plans [CONFIRM] so cash flow doesn't block your upgrade.",
                },
              ].map(({ icon: Icon, title, text }, i) => (
                <Reveal key={title} delay={i * 0.05} className="flex gap-4">
                  <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sun-400/15 text-sun-400">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold text-white">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/65">{text}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
          <Reveal className="relative">
            <div className="grid gap-4">
              <SmartImage
                src={IMAGES.whyUs}
                alt="Certified technician installing solar panels on a residential rooftop in Abuja"
                ratio="aspect-[16/11]"
                className="rounded-3xl border border-white/10"
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="font-display text-2xl font-bold text-sun-400">1–3 days</p>
                  <p className="mt-1 text-xs text-white/60">Typical home install time</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="font-display text-2xl font-bold text-energy-400">25 yrs</p>
                  <p className="mt-1 text-xs text-white/60">Panel performance warranty [CONFIRM]</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------- FEATURED PRODUCTS */}
      <section className="section-pad bg-surface">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              align="left"
              eyebrow="Shop equipment"
              title="Featured products"
              description="Genuine panels, inverters, batteries and ready-to-install kits — available for Abuja delivery and nationwide shipping."
            />
            <ButtonLink href="/products" variant="outline" className="shrink-0">
              View full catalogue <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((p, i) => (
              <Reveal key={p.id} delay={i * 0.05}>
                <Link href={`/products/${p.slug}`} className="card card-hover group flex h-full flex-col overflow-hidden">
                  <SmartImage src={p.imageUrl} alt={p.name} ratio="aspect-[4/3]" sizes="(max-width:640px) 100vw, 25vw" />
                  <div className="flex flex-1 flex-col p-5">
                    {p.capacity && (
                      <span className="text-xs font-semibold uppercase tracking-wider text-sun-600">{p.capacity}</span>
                    )}
                    <h3 className="mt-1.5 font-display text-base font-bold leading-snug text-deep-900 group-hover:text-sun-700">
                      {p.name}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-muted">{p.shortDescription}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-sm font-bold text-deep-900">
                        {p.showPrice && p.priceNaira ? formatNaira(p.priceNaira) : "Contact for price"}
                      </span>
                      <span className="text-xs font-semibold text-sun-600">View →</span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- HOW IT WORKS */}
      <section className="section-pad bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="Our process"
            title="How it works"
            description="A clear, four-step path from first conversation to silent, reliable power — or a fully fitted CCTV system."
          />
          <ol className="relative mt-14 grid gap-8 md:grid-cols-4">
            <div className="absolute left-0 right-0 top-7 hidden h-0.5 bg-gradient-to-r from-sun-200 via-sun-400 to-energy-300 md:block" aria-hidden />
            {[
              {
                icon: ClipboardList,
                title: "Consultation",
                text: "Tell us your power needs, outage pain and budget — by phone, WhatsApp or the quote form.",
              },
              {
                icon: Ruler,
                title: "Site Survey & Design",
                text: "We inspect your roof, shading and load requirements, then engineer a right-sized system.",
              },
              {
                icon: HardHat,
                title: "Installation",
                text: "Certified installers mount panels, wire protection devices and commission your system — usually in 1–3 days.",
              },
              {
                icon: Headphones,
                title: "Support & Monitoring",
                text: "Training, monitoring setup and after-sales support so your system keeps performing for years.",
              },
            ].map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.08} className="relative">
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-deep-900 text-sun-400 shadow-card">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-widest text-sun-600">Step {i + 1}</p>
                <h3 className="mt-1 font-display text-lg font-bold text-deep-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* -------------------------------------------------- SAVINGS / IMPACT */}
      <section className="section-pad bg-surface">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <SectionHeading
            align="left"
            eyebrow="Fuel vs solar"
            title="Stop renting your power from the fuel tanker"
            description="Generators look cheap until you count five years of diesel, servicing and noise. Solar flips the economics — higher upfront, near-zero running cost."
          />
          <Reveal delay={0.1}>
            <div className="card overflow-hidden">
              <div className="grid grid-cols-2 divide-x divide-slate-200">
                <div className="p-6 md:p-8">
                  <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-600">
                    <Fuel className="h-3.5 w-3.5" aria-hidden /> Generator
                  </span>
                  <p className="mt-4 font-display text-3xl font-bold text-deep-900">
                    <Counter to={Math.round(monthlyGenerator / 1000)} suffix="k" />
                  </p>
                  <p className="text-sm text-muted">₦ / month (fuel + servicing, illustrative)</p>
                  <ul className="mt-4 space-y-1.5 text-sm text-muted">
                    <li>✕ Runs only when you refuel</li>
                    <li>✕ Noise, fumes & midnight trips</li>
                    <li>✕ Cost rises with fuel prices</li>
                  </ul>
                </div>
                <div className="bg-energy-500/5 p-6 md:p-8">
                  <span className="inline-flex items-center gap-2 rounded-full bg-energy-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-energy-700">
                    <Zap className="h-3.5 w-3.5" aria-hidden /> Solar
                  </span>
                  <p className="mt-4 font-display text-3xl font-bold text-deep-900">
                    <Counter to={Math.round(monthlySolarTopup / 1000)} suffix="k" />
                  </p>
                  <p className="text-sm text-muted">₦ fuel cost / month</p>
                  <ul className="mt-4 space-y-1.5 text-sm text-muted">
                    <li>✓ Silent power day & night</li>
                    <li>✓ Near-zero running cost</li>
                    <li>✓ Optional generator backup link</li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-slate-200 bg-white px-6 py-4 text-xs text-muted">
                Illustrative comparison only — actual savings depend on your usage, fuel prices and system size.
                <Link href="/blog/solar-vs-generator-true-cost-5-years" className="ml-1 font-semibold text-sun-600 underline underline-offset-2">
                  Read the full 5-year analysis →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------------- CCTV SPOTLIGHT */}
      <section className="section-pad bg-white">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <SmartImage
                src={IMAGES.cctv}
                alt="CCTV security cameras installed on a wall by Alabsglobalconcept"
                ratio="aspect-[4/3]"
                className="rounded-3xl"
              />
              <div className="absolute -bottom-5 -right-5 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-card-hover sm:block">
                <p className="text-xs font-medium uppercase tracking-wider text-muted">Remote viewing</p>
                <p className="mt-1 font-display text-2xl font-bold text-deep-900">On your phone</p>
                <p className="text-xs text-muted">Live feeds &amp; playback, anywhere</p>
              </div>
            </div>
          </Reveal>
          <div>
            <SectionHeading
              align="left"
              eyebrow="Power + security"
              title="CCTV supply & installation too"
              description="We don't just keep the lights on — we help you keep an eye on your property. We supply and install CCTV camera systems sized to your site, with phone viewing configured for you."
            />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Homes, shops, offices & estates",
                "2–16 camera systems (larger sites quoted)",
                "Phone viewing set up for you",
                "Clean cabling, NVR/DVR & storage sizing",
                "User training & after-sales support",
                "Free site assessment & camera plan",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-muted">
                  <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-sun-500" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/services/cctv-installation">
                Explore CCTV installation <ArrowRight className="h-4 w-4" aria-hidden />
              </ButtonLink>
              <ButtonLink href="/contact" variant="outline">
                Get a CCTV quote
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- FEATURED PROJECTS */}
      <section className="section-pad bg-deep-950 text-white">
        <div className="container-page">
          <SectionHeading
            dark
            eyebrow="Recent work"
            title="Projects across Abuja"
            description="Real installations for homes, clinics, offices and estates — designed for the loads that matter."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {projects.map((proj, i) => (
              <Reveal key={proj.id} delay={i * 0.07}>
                <Link href={`/projects/${proj.slug}`} className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-sun-400/40">
                  <SmartImage src={proj.coverImage} alt={proj.title} ratio="aspect-[16/11]" className="border-b border-white/10" />
                  <div className="p-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-sun-400">
                      {proj.category} · {proj.systemSizeKw}
                    </span>
                    <h3 className="mt-2 font-display text-lg font-bold leading-snug text-white group-hover:text-sun-300">
                      {proj.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-white/60">{proj.summary}</p>
                    <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-sun-400">
                      <MapPin className="h-3.5 w-3.5" aria-hidden /> {proj.location}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <ButtonLink href="/projects" variant="dark">
              View all projects <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- TESTIMONIALS */}
      <section className="section-pad bg-deep-900">
        <div className="container-page">
          <SectionHeading
            dark
            eyebrow="Client stories"
            title="Trusted by homes & businesses in Abuja"
          />
          <div className="mt-12">
            <TestimonialsSlider
              items={testimonials.map((t) => ({
                id: t.id,
                name: t.name,
                location: t.location,
                systemSize: t.systemSize,
                quote: t.quote,
                rating: t.rating,
              }))}
            />
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- FAQ */}
      <section className="section-pad bg-surface">
        <div className="container-page">
          <SectionHeading
            eyebrow="FAQ"
            title="Questions people ask us"
            description="Straight answers about sizing, batteries, warranties, CCTV and getting started."
          />
          <div className="mt-12">
            <FAQAccordion items={homeFaqs} />
          </div>
          <p className="mt-8 text-center text-sm text-muted">
            More questions?{" "}
            <Link href="/contact" className="font-semibold text-sun-600 underline underline-offset-2">
              Talk to our team
            </Link>{" "}
            or browse all FAQs on the contact page.
          </p>
        </div>
      </section>

      {/* ----------------------------------------------------------- FINAL CTA */}
      <section className="relative overflow-hidden bg-sun-400">
        <div className="absolute inset-0 pattern-grid opacity-30" aria-hidden />
        <div className="container-page relative flex flex-col items-center gap-8 py-16 text-center md:py-20 lg:flex-row lg:justify-between lg:text-left">
          <div className="max-w-2xl">
            <h2 className="text-display-md font-display font-bold tracking-tight text-deep-900">
              Ready for power that doesn&apos;t blink when AEDC does?
            </h2>
            <p className="mt-3 text-deep-900/80">
              Get a free, itemised quote for solar or CCTV — or size your solar system in 2 minutes
              with our calculator.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact" variant="secondary" size="lg">
              Get a Free Quote <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
            <ButtonLink
              href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
              variant="whatsapp"
              size="lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp Us
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
