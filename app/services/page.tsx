import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/motion/Motion";
import { ButtonLink } from "@/components/ui/Button";
import { SERVICES } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Solar & Security Services in Abuja — Installation, Supply, Maintenance",
  description:
    "Residential and commercial solar installation, equipment supply, maintenance & repairs, solar street lights, solar water pumps and CCTV installation — serving Abuja, FCT and Nigeria.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="End-to-end solar & security services"
        description="One team for design, supply, installation and support — whether you need a home backup system, a commercial power upgrade or a CCTV setup."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
      />
      <section className="section-pad bg-surface">
        <div className="container-page grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.05}>
              <Link
                href={`/services/${s.slug}`}
                className="card card-hover group flex h-full flex-col p-7"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-sun-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-3 font-display text-xl font-bold text-deep-900 group-hover:text-sun-700">
                  {s.name}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{s.tagline}</p>
                <p className="mt-5 text-sm leading-relaxed text-muted/90 line-clamp-3">{s.overview}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-sun-600">
                  View service details
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-14 text-center">
          <ButtonLink href="/contact" size="lg">
            Not sure which service you need? Talk to us
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
