export const siteConfig = {
  name: "Alabsglobalconcept",
  tagline: "Solar Installation & Supply in Abuja",
  description:
    "Alabsglobalconcept designs, supplies and installs dependable solar power systems and CCTV camera systems for homes, businesses and institutions across Abuja, FCT and Nigeria.",
  phone: process.env.NEXT_PUBLIC_PHONE || "+234XXXXXXXXXX",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "234XXXXXXXXXX",
  email: process.env.NEXT_PUBLIC_EMAIL || "info@alabsglobalconcept.com",
  address:
    process.env.NEXT_PUBLIC_ADDRESS ||
    "Plot 000, Example Street, Maitama, Abuja, FCT",
  hours: process.env.NEXT_PUBLIC_BUSINESS_HOURS || "Mon–Sat, 8am – 6pm",
  socials: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM || "#",
    facebook: process.env.NEXT_PUBLIC_FACEBOOK || "#",
    x: process.env.NEXT_PUBLIC_X || "#",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN || "#",
  },
  nav: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/products", label: "Products" },
    { href: "/projects", label: "Projects" },
    { href: "/solar-calculator", label: "Solar Calculator" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ],
  /** [CONFIRM] — Abuja office geo coordinates (Maitama approx.) */
  geo: { lat: 9.0876, lng: 7.4951 },
  /** [CONFIRM_AREAS] — districts served in Abuja */
  areasServed: [
    "Maitama",
    "Asokoro",
    "Wuse",
    "Wuse II",
    "Garki",
    "Jabi",
    "Gwarinpa",
    "Life Camp",
    "Katampe",
    "Mabushi",
    "Lugbe",
    "Apo",
    "Kubwa",
    "Nyanya",
    "Kurudu",
    "Galadimawa",
  ],
} as const;

export function buildAbsoluteUrl(path = "") {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

export function whatsappLink(message: string) {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hello Alabsglobalconcept! I'd like a free solar or CCTV quote for my home or business in Abuja.";
