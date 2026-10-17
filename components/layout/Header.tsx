"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";
import { ButtonLink } from "@/components/ui/Button";
import { siteConfig, whatsappLink, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/site";
import { cn } from "@/lib/utils";

const serviceLinks = [
  { href: "/services", label: "All Services" },
  { href: "/services/residential-solar", label: "Residential Solar" },
  { href: "/services/commercial-industrial", label: "Commercial & Industrial" },
  { href: "/services/solar-equipment-supply", label: "Equipment Supply" },
  { href: "/services/maintenance-repairs", label: "Maintenance & Repairs" },
  { href: "/services/solar-street-lights", label: "Solar Street Lights" },
  { href: "/services/solar-water-pumps", label: "Solar Water Pumps" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-slate-200/80 bg-white/95 shadow-soft backdrop-blur-md"
          : "border-transparent bg-white"
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 py-3">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {siteConfig.nav.map((item) =>
            item.label === "Services" ? (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition",
                    isActive(item.href) ? "text-sun-600" : "text-deep-900/80 hover:text-deep-900"
                  )}
                  aria-expanded={servicesOpen}
                >
                  {item.label}
                  <ChevronDown className={cn("h-3.5 w-3.5 transition", servicesOpen && "rotate-180")} />
                </Link>
                {servicesOpen && (
                  <div className="absolute left-0 top-full z-50 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-card">
                    {serviceLinks.map((s) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        className="block rounded-lg px-3 py-2 text-sm text-deep-900/85 transition hover:bg-sun-50 hover:text-deep-900"
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition",
                  isActive(item.href) ? "text-sun-600" : "text-deep-900/80 hover:text-deep-900"
                )}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-deep-900 transition hover:text-sun-600"
          >
            <Phone className="h-4 w-4 text-sun-500" aria-hidden />
            <span className="sr-only sm:not-sr-only">Call</span>
          </a>
          <ButtonLink href="/contact" variant="primary" size="md">
            Get a Free Quote
          </ButtonLink>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-deep-900 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-4" aria-label="Mobile">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-4 py-3 text-base font-medium",
                  isActive(item.href) ? "bg-sun-50 text-sun-700" : "text-deep-900"
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <ButtonLink href="/contact" variant="primary" size="lg">
                Get a Free Quote
              </ButtonLink>
              <ButtonLink
                href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
                variant="whatsapp"
                size="lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat on WhatsApp
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
