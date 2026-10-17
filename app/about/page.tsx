import type { Metadata } from "next";
import { Target, Eye, HeartHandshake, MapPin, Truck, Award, Users } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Motion";
import { SmartImage } from "@/components/media/SmartImage";
import { ButtonLink } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";
import { IMAGES } from "@/lib/data/images";

export const metadata: Metadata = {
  title: "About Us — Solar Company in Abuja, FCT",
  description:
    "Learn about Alabsglobalconcept — an Abuja-rooted solar installation, equipment supply and CCTV installation company serving homes, businesses and institutions across Nigeria.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    icon: HeartHandshake,
    title: "Honesty over hype",
    text: "We size systems for your real loads — not the biggest invoice. If solar isn't the right fit yet, we'll say so.",
  },
  {
    icon: Award,
    title: "Quality without shortcuts",
    text: "Genuine equipment, proper protection devices, tidy workmanship. Your system should outlast the hype cycle.",
  },
  {
    icon: Users,
    title: "People-first support",
    text: "We explain things in plain language and stay reachable after commissioning. Your comfort with the system matters.",
  },
  {
    icon: Target,
    title: "Engineered for Nigeria",
    text: "Designs account for Abuja sun hours, dust, heat and real outage patterns — not idealised European conditions.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Abuja-rooted. Nigeria-ready."
        description="Alabsglobalconcept was built for one reason: to make dependable solar power and property security accessible to homes and businesses tired of unreliable grid supply and rising fuel costs."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      {/* Story */}
      <section className="section-pad bg-white">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <SmartImage
              src={IMAGES.aboutStory}
              alt="Alabsglobalconcept solar installation team at work in Abuja"
              ratio="aspect-[4/3]"
              className="rounded-3xl"
            />
          </Reveal>
          <div>
            <SectionHeading align="left" eyebrow="Our story" title="Power should be a given, not a gamble" />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">
              <p>
                Living and working in Abuja means planning life around AEDC outages — budgeting for fuel,
                tolerating generator noise, and losing productivity when the lights die mid-meeting or
                vaccines warm in a clinic fridge. We started {siteConfig.name} to change that equation.
              </p>
              <p>
                From our base in Abuja (FCT), we design, supply and install solar power systems for
                residential homes, commercial offices, clinics, schools, estates, farms and places of
                worship — plus CCTV camera supply and installation — with nationwide equipment
                delivery for clients beyond the FCT.
              </p>
              <p>
                <strong className="text-deep-900">Our promise is simple:</strong> honest advice, genuine
                equipment, clean installation, and a team that still answers the phone months after
                commissioning. <span className="text-sun-600">[CONFIRM founding year & story details]</span>
              </p>
            </div>
            <ButtonLink href="/contact" className="mt-8">
              Work with us
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="section-pad bg-surface">
        <div className="container-page grid gap-6 md:grid-cols-2">
          {[
            {
              icon: Target,
              title: "Our mission",
              text: "To deliver reliable, affordable and long-lasting solar power and security solutions — engineered for Nigerian conditions and backed by genuine after-sales support.",
            },
            {
              icon: Eye,
              title: "Our vision",
              text: "A Nigeria where homes and businesses run on clean, silent power and feel secure — without fear of outages, fuel price shocks or break-ins.",
            },
          ].map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <div className="card h-full p-8">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sun-400/15 text-sun-600">
                  <Icon className="h-5.5 w-5.5" aria-hidden />
                </span>
                <h2 className="mt-5 font-display text-xl font-bold text-deep-900">{title}</h2>
                <p className="mt-3 text-base leading-relaxed text-muted">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="section-pad bg-deep-950 text-white">
        <div className="container-page">
          <SectionHeading dark eyebrow="Our values" title="How we show up on every job" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.06}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6">
                  <Icon className="h-6 w-6 text-sun-400" aria-hidden />
                  <h3 className="mt-4 font-display text-base font-bold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team placeholders */}
      <section className="section-pad bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="Our team"
            title="The people behind the panels"
            description="Certified installers, engineers and support staff who treat your property like their own. [CONFIRM team names & roles before launch]"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "[Team Member]", role: "Founder / Lead Engineer [CONFIRM]", img: IMAGES.team[0] },
              { name: "[Team Member]", role: "Installation Supervisor [CONFIRM]", img: IMAGES.team[1] },
              { name: "[Team Member]", role: "Sales & Quotations [CONFIRM]", img: IMAGES.team[2] },
              { name: "[Team Member]", role: "After-Sales Support [CONFIRM]", img: IMAGES.team[3] },
            ].map((m, i) => (
              <Reveal key={m.role} delay={i * 0.05}>
                <div className="card overflow-hidden">
                  <SmartImage src={m.img} alt={`Portrait of ${m.name}`} ratio="aspect-square" />
                  <div className="p-5 text-center">
                    <h3 className="font-display text-base font-bold text-deep-900">{m.name}</h3>
                    <p className="mt-1 text-sm text-muted">{m.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section className="section-pad bg-surface">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Service coverage"
              title="Proudly serving Abuja — and shipping nationwide"
              description="We install across Abuja and its satellite towns, and supply equipment to clients throughout Nigeria."
            />
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {siteConfig.areasServed.map((area) => (
                <li
                  key={area}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-deep-900"
                >
                  <MapPin className="h-3.5 w-3.5 text-sun-500" aria-hidden />
                  {area}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted">
              Outside these areas or outside the FCT?{" "}
              <strong className="text-deep-900">[CONFIRM_AREAS]</strong> — we deliver equipment nationwide and
              can arrange installation projects across Nigeria on request.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-energy-500/10 px-4 py-3 text-sm font-medium text-energy-800">
              <Truck className="h-4 w-4" aria-hidden />
              Nationwide equipment delivery available
            </div>
          </div>
          <Reveal delay={0.1}>
            <div className="card h-full p-8">
              <h3 className="font-display text-lg font-bold text-deep-900">Certifications & partners</h3>
              <p className="mt-2 text-sm text-muted">
                Manufacturer authorisations, installer certifications and partner logos go here.{" "}
                <span className="text-sun-600">[CONFIRM — add real logos only]</span>
              </p>
              <div className="mt-6 grid grid-cols-3 gap-4">
                {["[Logo]", "[Logo]", "[Logo]", "[Logo]", "[Logo]", "[Logo]"].map((l, i) => (
                  <div
                    key={i}
                    className="flex h-20 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-surface text-xs font-semibold text-slate-400"
                  >
                    {l}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
