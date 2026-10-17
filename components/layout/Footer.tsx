import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Linkedin, Twitter } from "lucide-react";
import { Logo } from "./Logo";
import { siteConfig } from "@/lib/site";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-deep-950 text-white/80">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo dark />
          <p className="mt-5 max-w-sm text-sm leading-relaxed">
            Alabsglobalconcept designs, supplies and installs dependable solar power systems for homes,
            businesses and institutions across Abuja, FCT and Nigeria. Quality equipment, expert
            installation, honest after-sales support.
          </p>
          <div className="mt-6 flex gap-3">
            {[
              { href: siteConfig.socials.instagram, label: "Instagram", Icon: Instagram },
              { href: siteConfig.socials.facebook, label: "Facebook", Icon: Facebook },
              { href: siteConfig.socials.x, label: "X (Twitter)", Icon: Twitter },
              { href: siteConfig.socials.linkedin, label: "LinkedIn", Icon: Linkedin },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/70 transition hover:border-sun-400/50 hover:bg-white/5 hover:text-sun-300"
              >
                <Icon className="h-4 w-4" aria-hidden />
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">Quick Links</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {siteConfig.nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="transition hover:text-sun-300">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">Services</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              ["Residential Solar", "/services/residential-solar"],
              ["Commercial & Industrial", "/services/commercial-industrial"],
              ["Solar Equipment Supply", "/services/solar-equipment-supply"],
              ["Maintenance & Repairs", "/services/maintenance-repairs"],
              ["Solar Street Lights", "/services/solar-street-lights"],
              ["Solar Water Pumps", "/services/solar-water-pumps"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="transition hover:text-sun-300">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sun-400" aria-hidden />
              <span>{siteConfig.address}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-sun-400" aria-hidden />
              <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="hover:text-sun-300">
                {siteConfig.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-sun-400" aria-hidden />
              <a href={`mailto:${siteConfig.email}`} className="hover:text-sun-300">
                {siteConfig.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-sun-400" aria-hidden />
              <span>{siteConfig.hours}</span>
            </li>
          </ul>
          <div className="mt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/90">Newsletter</h4>
            <p className="mt-1 text-xs text-white/60">Solar tips & offers — no spam.</p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/55 sm:flex-row">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>
            Solar installation & supply · Abuja, FCT · Nationwide delivery{" "}
            <Link href="/admin/login" className="ml-2 underline decoration-dotted hover:text-white/80">
              Admin
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
