import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Alabsglobalconcept collects, uses and protects your personal information.",
  alternates: { canonical: "/privacy" },
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy policy"
        description="Your trust matters. Here's how we handle the information you share with us."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Privacy" }]}
      />
      <section className="section-pad bg-white">
        <div className="container-page max-w-3xl space-y-8 text-sm leading-relaxed text-muted">
          <div>
            <h2 className="font-display text-lg font-bold text-deep-900">Information we collect</h2>
            <p className="mt-2">
              When you request a quote, use the solar calculator or contact us, we collect the details you
              provide — name, phone, email, location and information about your power needs. We may also
              collect basic analytics about site usage via cookies.
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-deep-900">How we use it</h2>
            <p className="mt-2">
              Solely to prepare quotes, schedule surveys, deliver equipment, provide after-sales support and
              improve our services. We do not sell your data. <span className="text-sun-600">[CONFIRM with legal review]</span>
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-deep-900">Contact</h2>
            <p className="mt-2">
              Questions about your data? Email <a href={`mailto:${siteConfig.email}`} className="font-semibold text-sun-600">{siteConfig.email}</a> or
              call {siteConfig.phone}.
            </p>
          </div>
          <p className="text-xs">Last updated: [CONFIRM DATE] · This policy is a template and requires legal review before launch.</p>
        </div>
      </section>
    </>
  );
}
