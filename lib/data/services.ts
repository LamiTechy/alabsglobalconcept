/**
 * Service definitions (static copy). Dynamic service pages render from this
 * map so content stays consistent and easy to edit.
 */

export type ServiceDef = {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  overview: string;
  whoFor: string[];
  includes: string[];
  systemSizes: string;
  process: string[];
  faqs: { q: string; a: string }[];
};

export const SERVICES: ServiceDef[] = [
  {
    slug: "residential-solar",
    name: "Residential Solar Installation",
    shortName: "Residential Solar",
    tagline: "Silent, reliable power for your home — through every AEDC outage.",
    overview:
      "We design and install home solar systems that keep fans, lights, TVs, fridges, freezers and small pumps running when the grid goes quiet. Every home is different — roof size, shading, family habits and budget all shape the design. We survey first, size honestly, and install cleanly so you get a system that matches real life in Abuja, not a brochure.",
    whoFor: [
      "Homeowners tired of generator noise and fuel costs",
      "Families dealing with frequent AEDC outages",
      "Estates and duplexes needing whole-home backup",
      "Renters and landlords planning phased upgrades",
    ],
    includes: [
      "Free consultation & load assessment",
      "On-site survey and shade analysis",
      "Custom system design (panels, inverter, batteries)",
      "Professional rooftop installation & wiring",
      "Protection devices: breakers, surge protection, earthing",
      "Commissioning, monitoring setup & user training",
      "After-sales support and troubleshooting",
    ],
    systemSizes:
      "Typical homes run 3kVA–10kVA (1.5kW–5kW arrays) depending on appliances. A 3-bedroom flat often starts at 3kVA–5kVA; homes with ACs and pumps move to 7.5kVA–10kVA+.",
    process: ["Consultation", "Site survey & design", "Installation", "Support & monitoring"],
    faqs: [
      {
        q: "How long does a home installation take?",
        a: "Most residential installs complete in 1–3 days once equipment is on site.",
      },
      {
        q: "Will it look neat on my roof?",
        a: "Yes — we use proper mounting structures and route cables cleanly. Your roof and aesthetics matter to us.",
      },
    ],
  },
  {
    slug: "commercial-industrial",
    name: "Commercial & Industrial Solar",
    shortName: "Commercial & Industrial",
    tagline: "Cut diesel spend. Keep operations running. Scale as you grow.",
    overview:
      "Offices, clinics, schools, shops, warehouses and light-industrial sites lose money every time power drops. We build commercial systems with hybrid inverters, generator auto-transfer and monitoring so critical loads stay online — and your diesel bill shrinks. We work around your operating hours to minimise disruption.",
    whoFor: [
      "Offices and co-working spaces",
      "Clinics, hospitals and pharmacies (cold chain priority)",
      "Schools, churches and mosques",
      "Shops, supermarkets and cold rooms",
      "Warehouses and light-industrial facilities",
    ],
    includes: [
      "Load audit of critical and non-critical circuits",
      "System design with demand and diversity factors",
      "Hybrid inverter & expandable battery banks",
      "Generator auto-transfer integration",
      "Three-phase options where required [CONFIRM]",
      "Remote monitoring and SLA-based support plans",
    ],
    systemSizes:
      "From 5kVA for small shops to 100kVA+ for larger facilities. Common commercial installs: 10kVA–30kVA with 5kW–15kW arrays.",
    process: ["Load audit", "Design & proposal", "Phased installation", "Monitoring & SLA support"],
    faqs: [
      {
        q: "Can you install without closing my business?",
        a: "Yes — we phase installations around your hours and isolate circuits safely.",
      },
      {
        q: "Do you handle three-phase systems?",
        a: "Yes, including three-phase hybrid inverters and commercial arrays [CONFIRM specs].",
      },
    ],
  },
  {
    slug: "solar-equipment-supply",
    name: "Solar Equipment Supply",
    shortName: "Equipment Supply",
    tagline: "Genuine panels, inverters, batteries and accessories — nationwide delivery.",
    overview:
      "Already have an installer, or prefer to buy equipment directly? We supply genuine, warranty-backed solar equipment — panels, inverters, lithium and tubular batteries, MPPT controllers, complete kits and accessories — with honest guidance on what fits your project. Delivery across Abuja and nationwide shipping.",
    whoFor: [
      "End users buying direct",
      "Electrical contractors and installers",
      "Developers and estate managers",
      "Anyone who wants genuine products with clear warranties",
    ],
    includes: [
      "Curated Tier-1 panels and inverters [CONFIRM brands]",
      "Lithium (LiFePO4) and tubular battery options",
      "MPPT/PWM charge controllers",
      "Complete kits from 1kVA to 20kVA+",
      "Cables, breakers, surge protection, mounting structures",
      "Nationwide dispatch and Abuja delivery",
    ],
    systemSizes:
      "Single components or complete kits sized 1kVA to 20kVA+. Custom commercial packs available on request.",
    process: ["Product consultation", "Quote & availability", "Payment & dispatch", "Delivery/pickup"],
    faqs: [
      {
        q: "Are your products original with warranty?",
        a: "Yes — we supply genuine products with manufacturer-backed warranties. Documentation is provided per item.",
      },
      { q: "Do you deliver outside Abuja?", a: "Yes — nationwide delivery across Nigeria." },
    ],
  },
  {
    slug: "maintenance-repairs",
    name: "Maintenance & Repairs",
    shortName: "Maintenance & Repairs",
    tagline: "Protect your investment with professional servicing and rapid repairs.",
    overview:
      "Solar systems are low-maintenance — but not zero-maintenance. Dust reduces panel output; connections loosen; batteries age. We offer scheduled maintenance visits, fault diagnosis and repairs for systems installed by us or by others (where parts allow).",
    whoFor: [
      "Existing solar system owners",
      "Facilities managers with multiple sites",
      "Anyone noticing reduced backup time or error codes",
    ],
    includes: [
      "Panel cleaning and output check",
      "Connection & torque inspection",
      "Battery health assessment",
      "Inverter fault diagnosis",
      "Component replacement (where available)",
      "System performance report",
    ],
    systemSizes: "Any size — residential to commercial.",
    process: ["Booking & triage", "On-site diagnosis", "Repair/servicing", "Report & handover"],
    faqs: [
      {
        q: "How often should panels be cleaned?",
        a: "Every 1–3 months in Abuja's dusty conditions; more often during harmattan.",
      },
      {
        q: "My system was installed by another company — can you service it?",
        a: "Often yes. Contact us with your system details and we'll assess parts availability.",
      },
    ],
  },
  {
    slug: "solar-street-lights",
    name: "Solar Street Lights",
    shortName: "Solar Street Lights",
    tagline: "Light your estate, roads and facilities — zero electricity bills.",
    overview:
      "Solar street lights mount quickly (no trenching, no grid extension fees) and run dusk-to-dawn on their own panels and batteries. We supply all-in-one and split systems for estates, car parks, perimeters and rural roads across Abuja and Nigeria.",
    whoFor: [
      "Estate associations and developers",
      "Schools, churches and mosques",
      "Farms and industrial perimeters",
      "Local government and community projects",
    ],
    includes: [
      "Site assessment and lighting plan",
      "All-in-one or split solar street lights",
      "Pole supply & mounting [CONFIRM]",
      "Motion-sensor configuration",
      "Community/user training",
    ],
    systemSizes:
      "60W–200W LED units with matching panels and LiFePO4 batteries. Multi-light projects quoted per site.",
    process: ["Site survey", "Lighting design", "Supply & installation", "Handover"],
    faqs: [
      {
        q: "Do they work on cloudy days?",
        a: "Yes — with properly sized batteries they provide 2–3 nights of autonomy even after low-sun days.",
      },
    ],
  },
  {
    slug: "solar-water-pumps",
    name: "Solar Water Pumping",
    shortName: "Solar Water Pumps",
    tagline: "Pump water with sunshine — no diesel, no noise.",
    overview:
      "Solar-powered water pumping for farms, estates, boreholes and livestock. We size arrays to your daily water demand and pump head, so water flows when the sun shines — often enough to eliminate diesel pumping entirely.",
    whoFor: [
      "Farms and agribusinesses",
      "Estates with borehole supply",
      "Schools, clinics and communities",
      "Ranching and livestock operations",
    ],
    includes: [
      "Water demand & head assessment",
      "Solar pump & controller selection",
      "Panel array sizing and mounting",
      "Pump installation & commissioning",
      "Optional buffer tank strategy",
    ],
    systemSizes:
      "From small 12V surface pumps to multi-kW submersible systems. Sized to litres/day and dynamic head.",
    process: ["Demand assessment", "Pump & array selection", "Installation", "Commissioning"],
    faqs: [
      {
        q: "Does pumping stop at night?",
        a: "Direct-drive solar pumps follow the sun. We design buffer storage (tanks) so water is available 24/7.",
      },
    ],
  },
  {
    slug: "cctv-installation",
    name: "CCTV Supply & Installation",
    shortName: "CCTV Installation",
    tagline: "Keep an eye on your home, shop or site — from anywhere.",
    overview:
      "We supply and install CCTV camera systems for homes, shops, offices and facilities across Abuja and Nigeria. From a single front-door camera to multi-camera setups with phone viewing, we size the system to your site, run clean cabling, configure recording properly and train you on daily use — so you get footage when it matters, not just cameras on the wall.",
    whoFor: [
      "Homeowners and estates wanting visible deterrence",
      "Shops, supermarkets and warehouses",
      "Offices and business premises",
      "Farms, factories and perimeters",
    ],
    includes: [
      "Free site assessment and camera placement plan",
      "HD/IP cameras matched to location and lighting",
      "NVR/DVR supply with storage sized to your retention needs",
      "Professional cabling, conduit and neat mounting",
      "Remote viewing setup on your phone (iOS/Android)",
      "User training and after-sales support",
    ],
    systemSizes:
      "2–16 camera systems as standard; larger projects (estates, warehouses) quoted per site. Options from 2MP–8MP cameras with 1–8TB storage depending on how long you want footage kept.",
    process: ["Site survey", "Camera design & quote", "Supply & installation", "Training & support"],
    faqs: [
      {
        q: "Can I watch the cameras from my phone?",
        a: "Yes — we configure remote viewing on your phone so you can check live feeds and playback from anywhere.",
      },
      {
        q: "How long is footage kept?",
        a: "It depends on camera count, storage size and frame rate — typically 14–30 days with the drives we supply. We size storage to your needs.",
      },
    ],
  },
];

export function getService(slug: string) {
  return SERVICES.find((s) => s.slug === slug) ?? null;
}

export const PROJECT_CATEGORIES = [
  { slug: "residential", label: "Residential" },
  { slug: "commercial", label: "Commercial" },
  { slug: "industrial", label: "Industrial" },
  { slug: "institutional", label: "Institutional" },
] as const;
