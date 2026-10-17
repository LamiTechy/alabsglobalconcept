import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Calculator } from "@/components/calculator/Calculator";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Motion";

export const metadata: Metadata = {
  title: "Free Solar Calculator — Size Your System in 2 Minutes",
  description:
    "Estimate the inverter, battery and panel size for your home or business in Abuja. Interactive solar sizing calculator with instant results and free quote follow-up.",
  alternates: { canonical: "/solar-calculator" },
};

export default function SolarCalculatorPage() {
  return (
    <>
      <PageHero
        eyebrow="Signature tool"
        title="Solar system calculator"
        description="Pick your appliances, set your backup hours, and get an instant recommendation for inverter size, battery capacity and panel count — tuned for Abuja conditions."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Solar Calculator" }]}
      />
      <section className="section-pad bg-surface">
        <div className="container-page">
          <Calculator />
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="How it works"
            title="Three steps to a smarter solar budget"
            description="Our calculator uses real engineering formulas — not marketing fluff — so you walk into any conversation informed."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "List your loads",
                text: "Select appliances, quantities and daily usage hours — or add your own custom entries.",
              },
              {
                step: "02",
                title: "Choose backup hours",
                text: "Tell us how many hours of battery power you want during an outage. We scale storage accordingly.",
              },
              {
                step: "03",
                title: "Get your recommendation",
                text: "See suggested inverter kVA, battery kWh and panel count, then send the result straight to our team.",
              },
            ].map((s, i) => (
              <Reveal key={s.step} delay={i * 0.07}>
                <div className="card h-full p-7">
                  <span className="font-display text-4xl font-bold text-sun-400/40">{s.step}</span>
                  <h3 className="mt-3 font-display text-lg font-bold text-deep-900">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
