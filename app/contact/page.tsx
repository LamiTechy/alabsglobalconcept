import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { ButtonLink } from "@/components/ui/Button";
import { getFaqs } from "@/lib/queries";
import { siteConfig, whatsappLink, DEFAULT_WHATSAPP_MESSAGE, buildAbsoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & Get a Free Quote — Solar Company in Abuja",
  description:
    "Request a free solar quote in Abuja. Call, WhatsApp or fill our multi-step-friendly form — certified installers, warranty-backed systems, honest pricing.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const faqs = await getFaqs();
  const mapEmbedUrl = `https://www.google.com/maps?q=${siteConfig.geo.lat},${siteConfig.geo.lng}&z=14&output=embed`;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    description: siteConfig.description,
    url: buildAbsoluteUrl(),
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
      addressLocality: "Abuja",
      addressRegion: "FCT",
      addressCountry: "NG",
    },
    geo: { "@type": "GeoCoordinates", latitude: siteConfig.geo.lat, longitude: siteConfig.geo.lng },
    openingHours: siteConfig.hours,
    areaServed: [
      { "@type": "City", name: "Abuja" },
      { "@type": "AdministrativeArea", name: "Federal Capital Territory" },
      { "@type": "Country", name: "Nigeria" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <PageHero
        eyebrow="Contact"
        title="Get your free solar quote"
        description="Tell us about your power needs — we'll respond with honest sizing advice and a clear, itemised quote. No pressure, no hidden charges."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <section className="section-pad bg-surface">
        <div className="container-page grid gap-10 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="card p-6 md:p-8">
              <h2 className="font-display text-xl font-bold text-deep-900">Request a quote</h2>
              <p className="mt-2 text-sm text-muted">
                Fields marked * are required. Prefer chat?{" "}
                <a
                  href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-energy-600 underline underline-offset-2"
                >
                  Message us on WhatsApp
                </a>{" "}
                — you can send your electricity bill or roof photos there.
              </p>
              <div className="mt-6">
                <QuoteForm source="contact" />
              </div>
            </div>
          </div>

          {/* Details */}
          <aside className="space-y-5 lg:col-span-2">
            <div className="card p-6">
              <h2 className="font-display text-lg font-bold text-deep-900">Reach us directly</h2>
              <ul className="mt-5 space-y-4 text-sm">
                <li className="flex gap-3">
                  <Phone className="mt-0.5 h-4.5 w-4.5 shrink-0 text-sun-500" aria-hidden />
                  <div>
                    <p className="font-semibold text-deep-900">Phone</p>
                    <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="text-muted hover:text-sun-600">
                      {siteConfig.phone}
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <MessageCircle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-energy-500" aria-hidden />
                  <div>
                    <p className="font-semibold text-deep-900">WhatsApp</p>
                    <a
                      href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted hover:text-energy-600"
                    >
                      Chat with us now
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-0.5 h-4.5 w-4.5 shrink-0 text-sun-500" aria-hidden />
                  <div>
                    <p className="font-semibold text-deep-900">Email</p>
                    <a href={`mailto:${siteConfig.email}`} className="text-muted hover:text-sun-600">
                      {siteConfig.email}
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-4.5 w-4.5 shrink-0 text-sun-500" aria-hidden />
                  <div>
                    <p className="font-semibold text-deep-900">Office</p>
                    <p className="text-muted">{siteConfig.address}</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Clock className="mt-0.5 h-4.5 w-4.5 shrink-0 text-sun-500" aria-hidden />
                  <div>
                    <p className="font-semibold text-deep-900">Business hours</p>
                    <p className="text-muted">{siteConfig.hours}</p>
                  </div>
                </li>
              </ul>
              <ButtonLink
                href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
                variant="whatsapp"
                className="mt-6 w-full"
                target="_blank"
                rel="noopener noreferrer"
              >
                Start a WhatsApp chat
              </ButtonLink>
            </div>

            <div className="card overflow-hidden">
              <div className="p-5">
                <h2 className="font-display text-base font-bold text-deep-900">Find our office</h2>
                <p className="mt-1 text-xs text-muted">Abuja, FCT — [CONFIRM exact map pin]</p>
              </div>
              <div className="relative h-64 w-full bg-deep-100">
                <iframe
                  title={`Map showing ${siteConfig.name} office in Abuja`}
                  src={mapEmbedUrl}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="rounded-2xl border border-energy-200 bg-energy-50 p-5 text-sm text-energy-900">
              <p className="font-bold">What happens after you submit?</p>
              <ol className="mt-2 list-decimal space-y-1 pl-4 text-energy-800">
                <li>We review your request (usually same day).</li>
                <li>We call/message to confirm details.</li>
                <li>Free site survey where needed.</li>
                <li>You receive a clear, itemised quote.</li>
              </ol>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-page">
          <h2 className="text-center font-display text-display-md font-bold text-deep-900">
            Frequently asked questions
          </h2>
          <div className="mt-10">
            <FAQAccordion items={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
          </div>
        </div>
      </section>
    </>
  );
}
