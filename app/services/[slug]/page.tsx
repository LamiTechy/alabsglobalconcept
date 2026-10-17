import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { Reveal } from "@/components/motion/Motion";
import { ButtonLink } from "@/components/ui/Button";
import { SmartImage } from "@/components/media/SmartImage";
import { SERVICES, getService } from "@/lib/data/services";
import { getProducts } from "@/lib/queries";
import { whatsappLink } from "@/lib/site";
import { formatNaira } from "@/lib/utils";
import { IMAGES } from "@/lib/data/images";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const service = getService(params.slug);
  if (!service) return { title: "Service not found" };
  return {
    title: `${service.name} in Abuja`,
    description: service.tagline,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const service = getService(params.slug);
  if (!service) notFound();

  const products = await getProducts();
  const related = products.slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={service.shortName}
        title={service.name}
        description={service.tagline}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.shortName },
        ]}
      />

      <section className="section-pad bg-white">
        <div className="container-page grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Reveal>
              <h2 className="font-display text-display-sm font-bold text-deep-900">Overview</h2>
              <p className="mt-4 text-base leading-relaxed text-muted">{service.overview}</p>
            </Reveal>

            <Reveal className="mt-12" delay={0.05}>
              <h2 className="font-display text-display-sm font-bold text-deep-900">Who it&apos;s for</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {service.whoFor.map((w) => (
                  <li key={w} className="flex items-start gap-2.5 text-sm text-muted">
                    <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-energy-500" aria-hidden />
                    {w}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="mt-12" delay={0.08}>
              <h2 className="font-display text-display-sm font-bold text-deep-900">What&apos;s included</h2>
              <ul className="mt-4 grid gap-3">
                {service.includes.map((inc) => (
                  <li key={inc} className="flex items-start gap-2.5 text-sm text-muted">
                    <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-sun-500" aria-hidden />
                    {inc}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="mt-12" delay={0.1}>
              <div className="card bg-sun-50 p-6">
                <h2 className="font-display text-base font-bold text-deep-900">Typical system sizes</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{service.systemSizes}</p>
              </div>
            </Reveal>

            <Reveal className="mt-12" delay={0.12}>
              <h2 className="font-display text-display-sm font-bold text-deep-900">Our process</h2>
              <ol className="mt-5 grid gap-4 sm:grid-cols-4">
                {service.process.map((step, i) => (
                  <li key={step} className="rounded-xl border border-slate-200 bg-white p-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-sun-600">
                      Step {i + 1}
                    </span>
                    <p className="mt-1.5 font-display text-sm font-bold text-deep-900">{step}</p>
                  </li>
                ))}
              </ol>
            </Reveal>

            {service.faqs.length > 0 && (
              <Reveal className="mt-12" delay={0.14}>
                <h2 className="mb-6 font-display text-display-sm font-bold text-deep-900">
                  FAQs — {service.shortName}
                </h2>
                <FAQAccordion items={service.faqs.map((f) => ({ question: f.q, answer: f.a }))} />
              </Reveal>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="card sticky top-24 p-6">
              <h2 className="font-display text-lg font-bold text-deep-900">Ready to start?</h2>
              <p className="mt-2 text-sm text-muted">
                Get a free, itemised quote or message us on WhatsApp — we typically respond the same day.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                <ButtonLink href="/contact" className="w-full">
                  Get a Free Quote <ArrowRight className="h-4 w-4" aria-hidden />
                </ButtonLink>
                <ButtonLink
                  href={whatsappLink(`Hello! I'm interested in your ${service.shortName} service.`)}
                  variant="whatsapp"
                  className="w-full"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp about this service
                </ButtonLink>
              </div>
              <div className="mt-6 border-t border-slate-100 pt-5">
                <SmartImage
                  src={service.slug === "cctv-installation" ? IMAGES.cctvSidebar : IMAGES.serviceSidebar}
                  alt={`${service.shortName} installation by Alabsglobalconcept`}
                  ratio="aspect-[4/3]"
                  className="rounded-xl"
                />
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Related products */}
      <section className="section-pad bg-surface">
        <div className="container-page">
          <SectionHeading align="left" eyebrow="Equipment" title="Related products" />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {related.map((p) => (
              <a
                key={p.id}
                href={`/products/${p.slug}`}
                className="card card-hover group flex flex-col overflow-hidden"
              >
                <SmartImage src={p.imageUrl} alt={p.name} ratio="aspect-[4/3]" />
                <div className="p-5">
                  <h3 className="font-display text-base font-bold text-deep-900 group-hover:text-sun-700">
                    {p.name}
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-deep-900">
                    {p.showPrice && p.priceNaira ? formatNaira(p.priceNaira) : "Contact for price"}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
