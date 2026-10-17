/**
 * Seed/sample content used both by `npm run db:seed` and as a static fallback
 * when the database is not configured (local dev without Neon).
 * Replace sample copy/images with real company data — see CONTENT_TODO.md.
 */
import { IMAGES } from "@/lib/data/images";

export type SeedProduct = {
  name: string;
  slug: string;
  categorySlug: string;
  brand: string | null;
  capacity: string;
  shortDescription: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  warranty: string;
  priceNaira: number | null;
  showPrice: boolean;
  imageUrl: string;
  gallery?: string[];
  featured: boolean;
  inStock: boolean;
};

export type SeedProject = {
  title: string;
  slug: string;
  category: string;
  location: string;
  systemSizeKw: string;
  equipment: string[];
  challenge: string;
  solution: string;
  summary: string;
  testimonial: string;
  testimonialAuthor: string;
  coverImage: string;
  gallery: string[];
  featured: boolean;
  completedAt: Date;
};

export const seedCategories: Array<{
  name: string;
  slug: string;
  description: string;
  order: number;
}> = [
  { name: "Solar Panels", slug: "solar-panels", description: "High-efficiency monocrystalline and polycrystalline panels for homes and businesses.", order: 1 },
  { name: "Inverters", slug: "inverters", description: "Pure sine wave and hybrid inverters from 1kVA to 20kVA+.", order: 2 },
  { name: "Batteries", slug: "batteries", description: "Lithium (LiFePO4) and tubular deep-cycle batteries.", order: 3 },
  { name: "Complete Kits", slug: "complete-kits", description: "Ready-to-install solar kits sized for typical Nigerian homes and shops.", order: 4 },
  { name: "Solar Street Lights", slug: "solar-street-lights", description: "All-in-one and split solar street lighting for estates, roads and facilities.", order: 5 },
  { name: "Accessories", slug: "accessories", description: "Cables, breakers, mounting structures, surge protection and more.", order: 6 },
  { name: "Charge Controllers", slug: "charge-controllers", description: "MPPT and PWM charge controllers to protect your battery bank.", order: 7 },
  { name: "CCTV Cameras", slug: "cctv-cameras", description: "CCTV cameras, NVR/DVR recorders and accessories for homes, shops and offices.", order: 8 },
];

export const seedProducts: SeedProduct[] = [
  { name: "550W Monocrystalline Solar Panel", slug: "550w-mono-solar-panel", categorySlug: "solar-panels", brand: "Tier-1 Manufacturer", capacity: "550W", shortDescription: "High-efficiency 550W monocrystalline panel with strong low-light performance — ideal for Nigerian rooftops.", description: "A robust 550W monocrystalline module engineered for high irradiance environments like Abuja. Half-cut cells and multi-busbar technology deliver better shading tolerance and long-term output. Frames and glass are built to handle harmattan dust and tropical heat.", features: ["550W rated output", "High module efficiency >21%", "Excellent low-light & high-temperature performance", "Anti-reflective, easy-clean glass", "25-year performance warranty"], specs: { "Rated Power": "550W", "Cell Type": "Monocrystalline, 144 half-cut", "Efficiency": "≥21.3%", "Open Circuit Voltage": "49.8V", "Short Circuit Current": "13.9A", "Dimensions": "2278 × 1134 × 35 mm", "Weight": "28.5 kg" }, warranty: "25-year product & performance warranty", priceNaira: null, showPrice: false, imageUrl: IMAGES.products.panel550, featured: true, inStock: true },
  { name: "450W Monocrystalline Solar Panel", slug: "450w-mono-solar-panel", categorySlug: "solar-panels", brand: "Tier-1 Manufacturer", capacity: "450W", shortDescription: "Compact 450W mono panel — a great fit for residential rooftops with limited space.", description: "Space-efficient 450W monocrystalline panel for homes that need strong output without a large roof footprint. Paired with MPPT controllers, it charges battery banks quickly even on hazy days.", features: ["450W rated output", "Compact footprint, high watts-per-m²", "Corrosion-resistant frame", "25-year performance warranty"], specs: { "Rated Power": "450W", "Cell Type": "Monocrystalline", "Efficiency": "≥20.8%", "Dimensions": "2094 × 1038 × 35 mm", "Weight": "23 kg" }, warranty: "25-year performance warranty", priceNaira: null, showPrice: false, imageUrl: IMAGES.products.panel450, featured: false, inStock: true },
  { name: "5kVA/48V Pure Sine Wave Inverter", slug: "5kva-48v-pure-sine-inverter", categorySlug: "inverters", brand: "Tier-1 Brand", capacity: "5kVA / 48V", shortDescription: "48V hybrid/pure sine wave inverter — runs fans, TVs, fridge, freezer, pumps and low-draw ACs.", description: "A 5kVA 48V pure sine wave inverter sized for typical 3–4 bedroom homes in Abuja. Clean sine wave output protects sensitive electronics; wide PV input supports generous panel arrays.", features: ["5kVA / 4000W continuous", "48V battery bank", "Pure sine wave output", "MPPT charge controller built-in", "LCD monitoring & app/USB connectivity", "Generator auto-transfer ready"], specs: { "Rated Power": "5kVA / 4000W", "Battery Voltage": "48V", "Waveform": "Pure sine wave" }, warranty: "2–5 years depending on brand", priceNaira: null, showPrice: false, imageUrl: IMAGES.products.inverter5, featured: true, inStock: true },
  { name: "10kVA/48V Hybrid Inverter", slug: "10kva-48v-hybrid-inverter", categorySlug: "inverters", brand: "Tier-1 Brand", capacity: "10kVA / 48V", shortDescription: "10kVA hybrid inverter for large homes, offices, clinics and small shops.", description: "Handles bigger loads — multiple ACs, freezers, office equipment — with hybrid solar/battery/grid logic and strong surge capacity for compressor startup.", features: ["10kVA capacity", "Hybrid solar/battery/grid operation", "High surge for ACs & freezers", "Parallel expansion options", "Remote monitoring"], specs: { "Rated Power": "10kVA", "Battery Voltage": "48V", "Waveform": "Pure sine wave" }, warranty: "2–5 years", priceNaira: null, showPrice: false, imageUrl: IMAGES.products.inverter10, featured: true, inStock: true },
  { name: "LiFePO4 48V 100Ah Lithium Battery (5.12kWh)", slug: "lifepo4-48v-100ah-battery", categorySlug: "batteries", brand: "Tier-1 Brand", capacity: "48V 100Ah / 5.12kWh", shortDescription: "Long-life LiFePO4 battery — 6000+ cycles, fast charging, maintenance-free.", description: "Lithium iron phosphate battery with built-in BMS. Charges faster, lasts far longer than tubular, and keeps deep daily cycling without babysitting water levels. Ideal where outage frequency is high.", features: ["5.12kWh usable capacity", "6000+ cycles @ 80% DoD", "Built-in BMS with Bluetooth", "10-year design life", "Maintenance-free"], specs: { "Nominal Voltage": "48V", "Capacity": "100Ah", "Energy": "5.12kWh", "Cycles": "6000+", "Weight": "≈48 kg", "Communication": "RS485/CAN" }, warranty: "5–10 years", priceNaira: null, showPrice: false, imageUrl: IMAGES.products.batteryLithium, featured: true, inStock: true },
  { name: "12V 200Ah Tubular Deep-Cycle Battery", slug: "12v-200ah-tubular-battery", categorySlug: "batteries", brand: "Tier-1 Brand", capacity: "12V 200Ah", shortDescription: "Proven tubular battery for budget-conscious systems with 2–3 day autonomy.", description: "Heavy-duty tubular plate battery a familiar sight across Nigerian solar homes. Lower upfront cost than lithium; needs periodic distilled-water top-ups. Best where daily cycling is moderate.", features: ["200Ah tubular plates", "Deep-cycle design", "Robust for Nigerian conditions", "2–3 year design life"], specs: { "Nominal Voltage": "12V", "Capacity": "200Ah", "Type": "Tubular deep cycle", "Weight": "≈55 kg" }, warranty: "12–24 months", priceNaira: null, showPrice: false, imageUrl: IMAGES.products.batteryTubular, featured: false, inStock: true },
  { name: "3kVA Complete Solar Kit (Home Starter)", slug: "3kva-complete-solar-kit", categorySlug: "complete-kits", brand: "Alabsglobalconcept", capacity: "3kVA", shortDescription: "Everything for a typical flat: inverter, panels, battery, controller, cables, breakers and installation-ready accessories.", description: "A pre-matched 3kVA kit that comfortably runs fans, lights, TVs, decoder, laptop and a small fridge through typical Abuja outages. We size panels for local sun hours and include protection devices.", features: ["3kVA/24V pure sine inverter", "3 × 550W panels (1.65kW)", "2 × 12V 200Ah batteries (or lithium upgrade)", "MPPT controller, DC cables, AC breakers, surge protection", "Installation available in Abuja"], specs: { "Inverter": "3kVA pure sine", "Panels": "1.65kW array", "Battery Bank": "24V 200Ah (4.8kWh nominal)", "Backup (typical load)": "4–7 hours [survey-dependent]" }, warranty: "Per component warranty", priceNaira: null, showPrice: false, imageUrl: IMAGES.products.kit3, featured: true, inStock: true },
  { name: "5kVA Complete Solar Kit (Family Home)", slug: "5kva-complete-solar-kit", categorySlug: "complete-kits", brand: "Alabsglobalconcept", capacity: "5kVA", shortDescription: "Our most popular family-home kit — 5kVA inverter, generous panels and lithium-ready battery bank.", description: "Sized for 3–4 bedroom homes: multiple fans, several TVs, fridge, freezer and a small pumping machine. Lithium battery option for longer life and deeper daily cycling.", features: ["5kVA/48V pure sine inverter", "4–5 × 550W panels", "Lithium 48V 100Ah or tubular option", "Full protection & mounting accessories", "Professional installation & commissioning"], specs: { "Inverter": "5kVA pure sine", "Panels": "2.2–2.75kW array", "Battery": "48V bank", "Backup (typical load)": "6–10 hours [survey-dependent]" }, warranty: "Per component warranty", priceNaira: null, showPrice: false, imageUrl: IMAGES.products.kit5, featured: true, inStock: true },
  { name: "10kVA Complete Solar Kit (Business)", slug: "10kva-complete-solar-kit", categorySlug: "complete-kits", brand: "Alabsglobalconcept", capacity: "10kVA", shortDescription: "Commercial-grade kit for offices, clinics, schools and shops with serious daytime loads.", description: "10kVA hybrid system with large panel array and expandable lithium bank — designed for businesses tired of diesel costs. Auto-transfer keeps critical loads alive through AEDC outages.", features: ["10kVA hybrid inverter", "5–7 × 555W+ panels", "Expandable lithium bank", "Generator auto-transfer", "Monitoring & after-sales support"], specs: { "Inverter": "10kVA hybrid", "Panels": "2.75–3.85kW", "Battery": "48V lithium bank", "Expandable": "Yes" }, warranty: "Per component warranty", priceNaira: null, showPrice: false, imageUrl: IMAGES.products.kit10, featured: false, inStock: true },
  { name: "100W All-in-One Solar Street Light", slug: "100w-all-in-one-street-light", categorySlug: "solar-street-lights", brand: "Tier-1 Brand", capacity: "100W LED", shortDescription: "Integrated LED street light with panel, lithium battery and motion sensor — no trenching required.", description: "All-in-one unit that mounts on a pole and lights up estates, car parks and perimeters without digging cable trenches. Motion sensor stretches battery through the night.", features: ["100W LED, dusk-to-dawn", "Integrated PV + LiFePO4 battery", "PIR motion sensing", "IP65 weatherproof", "5-year design life"], specs: { "LED Power": "100W", "Battery": "LiFePO4", "Sensor": "PIR motion", "IP Rating": "IP65" }, warranty: "2–5 years", priceNaira: null, showPrice: false, imageUrl: IMAGES.products.streetLight, featured: false, inStock: true },
  { name: "60A MPPT Charge Controller", slug: "60a-mppt-charge-controller", categorySlug: "charge-controllers", brand: "Tier-1 Brand", capacity: "60A / 12–48V", shortDescription: "60A MPPT controller squeezes more energy from your panels and protects your batteries.", description: "Maximum Power Point Tracking charges up to 30% faster than PWM in mixed light. Essential for lithium banks with precise charge profiles and temperature compensation.", features: ["60A continuous", "12/24/36/48V auto recognition", "MPPT tracking algorithm", "LCD display & load terminal", "Temperature sensor included"], specs: { "Current": "60A", "System Voltage": "12–48V", "Efficiency": "≥98%" }, warranty: "2–3 years", priceNaira: null, showPrice: false, imageUrl: IMAGES.products.mppt, featured: false, inStock: true },
  { name: "Solar Installation Accessories Pack", slug: "solar-accessories-pack", categorySlug: "accessories", brand: "Alabsglobalconcept", capacity: "Per system size", shortDescription: "MC4 connectors, solar cable, AC/DC breakers, surge protectors, grounding kit and mounting hardware.", description: "We never cut corners on the small parts. This pack scales with your system and includes everything between panels and inverter — rated for outdoor UV exposure and tropical conditions.", features: ["4/6mm² solar DC cable", "MC4-compatible connectors", "AC & DC breakers", "Type 2 surge protection", "Earthing & grounding kit", "Roof mounting rails/clamps"], specs: { "Included": "Scaled to system size", "Cable Rating": "UV-resistant, 1500V DC" }, warranty: "6–12 months on accessories", priceNaira: null, showPrice: false, imageUrl: IMAGES.products.accessories, featured: false, inStock: true },
  { name: "4MP Bullet CCTV Camera", slug: "4mp-bullet-cctv-camera", categorySlug: "cctv-cameras", brand: null, capacity: "4MP / IP66", shortDescription: "Weatherproof outdoor bullet camera with sharp day/night footage and IR night vision.", description: "A 4MP bullet camera for gates, fences, shops and building exteriors. Infrared night vision keeps watch after dark, the IP66 housing handles Abuja dust and rain, and footage records to an NVR with viewing on your phone. We supply, mount and configure it for you.", features: ["4MP sharp video", "Infrared night vision up to 30m", "IP66 weatherproof housing", "Records to NVR with phone viewing", "Professional mounting & configuration"], specs: { "Resolution": "4MP", "Night Vision": "IR up to 30m", "Housing": "IP66 weatherproof", "Power": "12V DC / PoE" }, warranty: "1-year warranty", priceNaira: null, showPrice: false, imageUrl: IMAGES.products.cctvBullet, featured: false, inStock: true },
  { name: "4MP Dome CCTV Camera", slug: "4mp-dome-cctv-camera", categorySlug: "cctv-cameras", brand: null, capacity: "4MP / Indoor", shortDescription: "Discreet dome camera for ceilings in shops, offices, lobbies and homes.", description: "A compact 4MP dome camera that blends into ceilings while covering rooms, reception areas and shop floors. Wide-angle view, IR night vision and clean recording to an NVR — supplied, mounted and configured by our team.", features: ["4MP sharp video", "Wide-angle ceiling coverage", "IR night vision", "Discreet vandal-resistant dome", "Professional mounting & configuration"], specs: { "Resolution": "4MP", "Mounting": "Ceiling", "Night Vision": "IR", "Power": "12V DC / PoE" }, warranty: "1-year warranty", priceNaira: null, showPrice: false, imageUrl: IMAGES.products.cctvDome, featured: false, inStock: true },
  { name: "8-Channel CCTV Kit (4 Cameras + NVR)", slug: "8-channel-cctv-kit", categorySlug: "cctv-cameras", brand: "Alabsglobalconcept", capacity: "4 cameras / 1TB", shortDescription: "Complete starter kit: 4 cameras, 8-channel NVR, storage, cabling and professional installation.", description: "Everything needed to secure a home, shop or small office: four cameras (bullet or dome mix), an 8-channel NVR with storage sized for roughly two weeks of recording, cables and connectors, plus phone viewing set up during installation. Expandable to 8 cameras later.", features: ["4 × 4MP cameras (bullet/dome mix)", "8-channel NVR with 1TB storage", "Cables, connectors & power supply", "Phone viewing configured for you", "Installation & user training included"], specs: { "Cameras": "4 × 4MP", "Recorder": "8-channel NVR", "Storage": "1TB (≈2 weeks typical)", "Expandable": "Up to 8 cameras" }, warranty: "1-year warranty on kit", priceNaira: null, showPrice: false, imageUrl: IMAGES.products.cctvKit, featured: false, inStock: true },
];

export const seedProjects: SeedProject[] = [
  { title: "4.5kW Residential Solar System — Gwarinpa, Abuja", slug: "4-5kw-residential-gwarinpa", category: "residential", location: "Gwarinpa, Abuja FCT", systemSizeKw: "4.5kW", equipment: ["5kVA pure sine inverter", "8 × 550W panels", "48V 100Ah lithium battery", "60A MPPT controller"], challenge: "Family of six endured 8–12 hours of daily AEDC outages; generator fuel alone was draining the monthly budget.", solution: "Rooftop 4.5kW array with lithium storage sized for evening loads — fans, lights, TVs, fridge and freezer. Commissioned in two days with monitoring app configured.", summary: "The home now runs through typical outages without starting the generator, cutting fuel spend dramatically.", testimonial: "We used to budget for fuel every week. Since the system was installed we only top up occasionally — and the lights never go off.", testimonialAuthor: "Mr. Ade", coverImage: IMAGES.projects.gwarinpa, gallery: [IMAGES.projects.gwarinpa, IMAGES.hero], featured: true, completedAt: new Date("2025-11-15") },
  { title: "10kW Hybrid System for Private Clinic — Wuse II, Abuja", slug: "10kw-clinic-wuse-2", category: "institutional", location: "Wuse II, Abuja FCT", systemSizeKw: "10kW", equipment: ["10kVA hybrid inverter", "12 × 555W panels", "2 × 48V 100Ah lithium batteries", "Generator auto-transfer switch"], challenge: "Consulting rooms, cold storage for vaccines and front-desk systems could not tolerate outages during clinic hours.", solution: "Hybrid 10kW system with priority loads wired for cold chain and consulting, plus auto-transfer to existing generator as backup.", summary: "Vaccine cold storage and critical clinic loads stay online through grid failures — day or night.", testimonial: "Downtime during consultations used to be a daily headache. Now patient care continues without interruption.", testimonialAuthor: "Dr. B. Okafor", coverImage: IMAGES.projects.clinic, gallery: [IMAGES.projects.clinic], featured: true, completedAt: new Date("2025-09-02") },
  { title: "Solar System for Boutique Office — Maitama, Abuja", slug: "solar-office-maitama", category: "commercial", location: "Maitama, Abuja FCT", systemSizeKw: "8kW", equipment: ["10kVA hybrid inverter", "10 × 550W panels", "Lithium battery bank", "Monitoring system"], challenge: "A 12-person office relied on a noisy, fuel-hungry generator that interrupted client meetings.", solution: "Silent 8kW rooftop system covering lighting, ACs on a rotation plan, workstations and networking gear.", summary: "Meetings continue quietly through outages; diesel spend dropped to occasional backup only.", testimonial: "", testimonialAuthor: "", coverImage: IMAGES.projects.office, gallery: [], featured: true, completedAt: new Date("2025-06-20") },
  { title: "Estate Street Lighting — Lugbe, Abuja", slug: "estate-street-lighting-lugbe", category: "institutional", location: "Lugbe, Abuja FCT", systemSizeKw: "3kW total (24 street lights)", equipment: ["24 × 100W all-in-one solar street lights", "Pole mounting hardware"], challenge: "Dark estate roads created safety concerns and the community could not afford grid extension fees.", solution: "24 all-in-one solar street lights along major roads and junctions — installed without trenching in four days.", summary: "Estate roads are lit from dusk to dawn with zero electricity bills for the community.", testimonial: "Security improved immediately. Residents notice the difference every evening.", testimonialAuthor: "Estate Chairman", coverImage: IMAGES.projects.street, gallery: [], featured: false, completedAt: new Date("2025-04-10") },
  { title: "5kVA Shop & Cold Room Kit — Nyanya, Abuja", slug: "5kva-shop-cold-room-nyanya", category: "commercial", location: "Nyanya, Abuja FCT", systemSizeKw: "5kW", equipment: ["5kVA pure sine inverter", "8 × 550W panels", "48V lithium battery", "Backup generator link"], challenge: "A provisions shop with a small cold room lost stock whenever AEDC supply dropped.", solution: "Daytime-heavy array charges batteries fast; evening backup covers cold room and lighting until late.", summary: "Cold room inventory is preserved through outages and the owner sleeps better at night.", testimonial: "", testimonialAuthor: "", coverImage: IMAGES.projects.shop, gallery: [], featured: false, completedAt: new Date("2025-02-18") },
  { title: "15kW Farm Solar Water Pumping — Katampe outskirts, FCT", slug: "15kw-farm-water-pumping", category: "industrial", location: "Katampe outskirts, FCT", systemSizeKw: "15kW", equipment: ["Solar pump inverter/controller", "28 × 550W panels", "Surface pump"], challenge: "A small farm spent heavily on diesel to pump water for irrigation and livestock.", solution: "Direct-drive solar pumping array sized to peak midday demand, with a buffer tank strategy to reduce storage needs.", summary: "Pumping now follows the sun — no diesel, no noise, reliable water for the farm.", testimonial: "", testimonialAuthor: "", coverImage: IMAGES.projects.farm, gallery: [], featured: false, completedAt: new Date("2024-10-05") },
];

export const seedTestimonials = [
  { name: "Mrs. Chidinma E.", location: "Gwarinpa, Abuja", systemSize: "4.5kW", quote: "From the site survey to commissioning, everything was professional. We now go through outages without thinking about fuel.", rating: 5, published: true, order: 1 },
  { name: "Dr. B. Okafor", location: "Wuse II, Abuja", systemSize: "10kW", quote: "Our clinic cold storage and consulting rooms stay powered. The team understood medical priorities and wired accordingly.", rating: 5, published: true, order: 2 },
  { name: "Alhaji Musa I.", location: "Lugbe, Abuja", systemSize: "5kVA", quote: "Transparent pricing and honest advice — they sized my system properly instead of overselling capacity I didn't need.", rating: 5, published: true, order: 3 },
  { name: "Ngozi A.", location: "Life Camp, Abuja", systemSize: "3kVA", quote: "I started with a smaller kit and upgraded later. The after-sales support team answers promptly whenever I have questions.", rating: 5, published: true, order: 4 },
  { name: "Tunde O.", location: "Kubwa, Abuja", systemSize: "8kW", quote: "Installation was tidy and completed when they said it would. Neighbors have already asked for their number.", rating: 5, published: true, order: 5 },
  { name: "Grace & Peter U.", location: "Apo, Abuja", systemSize: "5kVA", quote: "The calculator gave us a realistic picture before we committed. Final design after the survey matched almost exactly.", rating: 5, published: true, order: 6 },
];

export const seedFaqs = [
  { question: "What size solar system do I need for a 3-bedroom flat?", answer: "A typical 3-bedroom flat in Abuja runs well on a 3kVA–5kVA system depending on whether you want to power fans, lights, TV, decoder, laptop, fridge and freezer — and for how many hours of backup. ACs and pumping machines push you into 5kVA+ with a larger panel array. Use our Solar Calculator for an instant estimate, then we confirm with a site survey.", category: "sizing", order: 1 },
  { question: "Lithium vs tubular batteries — which should I choose?", answer: "Lithium (LiFePO4) costs more upfront but lasts far longer (thousands of cycles vs a few hundred), charges faster, needs no water top-ups, and handles deep daily cycling — perfect for places with frequent outages like Abuja. Tubular batteries are cheaper to buy and still work well for moderate daily cycling on a budget. We'll recommend based on your outage pattern and budget.", category: "batteries", order: 2 },
  { question: "How long do solar batteries last?", answer: "Quality lithium batteries typically deliver 10+ years or 5000–6000+ cycles at partial depth of discharge. Tubular batteries usually last 2–4 years in active Nigerian use. Usage depth, temperature and charging habits all affect lifespan — we design systems so batteries aren't stressed daily.", category: "batteries", order: 3 },
  { question: "What warranty do you offer?", answer: "Panels commonly carry 25-year performance warranties, inverters 2–5 years, and lithium batteries 5–10 years depending on brand. Every system we install includes after-sales support and troubleshooting. Written warranty terms are shared before you pay.", category: "warranty", order: 4 },
  { question: "How long does installation take?", answer: "Most residential systems are installed and commissioned within 1–3 days after equipment arrives and the site survey is done. Larger commercial or multi-building projects can take 3–7 days. We schedule around your convenience and keep the site clean.", category: "process", order: 5 },
  { question: "Can solar run my AC, freezer or water pump?", answer: "Yes — with correct sizing. A single 1.5HP inverter AC needs a system designed around its startup surge (typically 5kVA+ inverter and generous battery/panel capacity). Freezers and submersible pumps are also feasible. Tell us your exact appliances in the calculator or quote form and we'll size honestly rather than overselling.", category: "sizing", order: 6 },
  { question: "How much maintenance does a solar system need?", answer: "Very little. Panels need occasional cleaning (every 1–3 months in dusty conditions), connections should be checked annually, and tubular batteries need distilled water top-ups. Lithium systems are essentially maintenance-free. We offer maintenance visits and remote monitoring options.", category: "maintenance", order: 7 },
  { question: "Do you offer financing or installment payments?", answer: "Payment structure and any installment options depend on the project. Many clients pay in stages: deposit → equipment delivery → commissioning. Ask about current options when you request a quote and we'll explain what's available.", category: "payment", order: 8 },
  { question: "Do you deliver outside Abuja?", answer: "Yes. We're based in Mararaba (Karu LGA, Nasarawa State) and regularly install across Abuja and its satellite towns — Gwarinpa, Kubwa, Lugbe, Nyanya, Life Camp, Katampe and more. We also supply and ship equipment nationwide across Nigeria. Installation outside the Abuja metro can be arranged.", category: "delivery", order: 9 },
  { question: "What happens on cloudy or rainy days?", answer: "Solar panels still produce power on cloudy days — just at reduced output. Systems are designed with battery storage and appropriate panel headroom so you ride through low-sun days. For extended harmattan or rainy spells, a generator link (auto-transfer) can top up batteries. We size for Abuja's real climate, not brochure sunshine.", category: "sizing", order: 10 },
  { question: "How do I get a site survey?", answer: "Easy — request a free quote via the Contact page, call us, or message us on WhatsApp. We'll schedule a visit to inspect your roof orientation, shading, load requirements and recommend the right system. Surveys within Abuja metro are typically scheduled within a few days.", category: "process", order: 11 },
  { question: "Do you also supply and install CCTV cameras?", answer: "Yes — we supply and install CCTV camera systems for homes, shops, offices and estates, from single front-door cameras to multi-camera systems with phone viewing. Mention CCTV when you request a quote or message us on WhatsApp and we'll design a system for your site.", category: "cctv", order: 0 },
];

export const seedBlogPosts: Array<{
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  tags: string[];
  published: boolean;
  publishedAt: Date;
}> = [
  {
    title: "How to Size a Solar System in Nigeria (Without Overspending)",
    slug: "how-to-size-a-solar-system-in-nigeria",
    excerpt: "A practical, no-jargon guide to calculating your daily energy needs, picking the right inverter size, and avoiding the two most common sizing mistakes we see in Abuja homes.",
    content: `# How to Size a Solar System in Nigeria

Sizing a solar system correctly is the difference between a quiet, reliable power setup and an expensive disappointment. Here's how we approach it for homes and businesses across Abuja.

## Step 1: List your loads

Write down every appliance you want powered, its wattage, and how many hours it runs per day. A 120W fan running 8 hours = 960Wh per day. Add them all up to get your daily energy in watt-hours (divide by 1000 for kWh).

## Step 2: Size the battery

Battery capacity (kWh) = daily energy ÷ depth of discharge. If you use lithium at 80% usable depth: a 5kWh daily need requires roughly 6.3kWh of nameplate storage. For long Abuja outages, add a buffer for 1.5–2 days of autonomy.

## Step 3: Size the inverter

Your inverter must handle the simultaneous load AND the surge current of motors (fridges, ACs, pumps). Sum the wattages of everything that runs at once, then pick an inverter with comfortable headroom — typically 25–50% above that total.

## Step 4: Size the panel array

Panels (kW) = daily kWh ÷ peak sun hours ÷ system losses. Abuja averages roughly 4.5–5.5 effective peak sun hours depending on season. Using 4.5 and 20% losses gives a conservative, all-season design.

## The two mistakes to avoid

1. **Buying by inverter size alone.** A 5kVA inverter with a weak battery bank dies in an hour. Capacity is a system, not a single box.
2. **Ignoring startup surge.** Compressors (ACs, freezers) need 2–3× their running watts for a moment. Undersized inverters trip exactly when you need them most.

## Next step

Try our Solar Calculator for an instant estimate based on your actual appliances, then request a site survey so we can confirm roof space, shading and final design.

*Final system design always follows a professional site survey.*
`,
    coverImage: IMAGES.blog.sizing,
    author: "Alabsglobalconcept Team",
    tags: ["sizing", "guide", "abuja"],
    published: true,
    publishedAt: new Date("2025-08-12"),
  },
  {
    title: "Lithium vs Tubular Batteries: Which Is Right for Your Abuja Home?",
    slug: "lithium-vs-tubular-batteries",
    excerpt: "Lithium costs more upfront but lasts years longer. Tubular is cheaper today. We break down real costs, cycle life, maintenance and which makes sense for Nigeria's outage reality.",
    content: `# Lithium vs Tubular Batteries

The battery is often the biggest single cost in a solar system — and the component most people get wrong. Let's compare lithium (LiFePO4) and tubular lead-acid honestly for Nigerian conditions.

## Upfront cost

Tubular batteries are cheaper to buy. A 12V 200Ah tubular unit costs a fraction of a 48V 100Ah lithium pack. If budget is the only constraint, tubular wins the sticker price.

## Lifetime cost

Lithium typically delivers 5000–6000+ cycles at 80% depth of discharge. Tubular deep-cycle units manage a few hundred to ~1500 cycles depending on quality and care. Over 7–10 years you may replace tubular 2–4 times while the lithium pack keeps going.

## Maintenance

Tubular batteries need distilled-water top-ups every few weeks in active use — miss this and lifespan drops sharply. Lithium is sealed and maintenance-free with a built-in BMS.

## Performance

Lithium accepts faster charge (shorter solar/generator top-up windows), sustains voltage better as it discharges, and handles deep daily cycling without complaint. Tubular sags under heavy load and dislikes being drained deep every day.

## So which should you choose?

- **Choose lithium** if outages are frequent/deep, you cycle daily, you want low maintenance, and you plan to keep the system 7+ years.
- **Choose tubular** if your budget is tight today, cycling is light/moderate, and you're okay with maintenance and earlier replacement.

Not sure? Run your numbers in our Solar Calculator and request a quote — we'll recommend based on your real outage pattern, not a sales script.
`,
    coverImage: IMAGES.blog.batteries,
    author: "Alabsglobalconcept Team",
    tags: ["batteries", "lithium", "tubular"],
    published: true,
    publishedAt: new Date("2025-09-05"),
  },
  {
    title: "Solar vs Generator: The True 5-Year Cost for Abuja Homes",
    slug: "solar-vs-generator-true-cost-5-years",
    excerpt: "Fuel, servicing, oil changes, noise, fumes — a generator's real price tag is much higher than its sticker. Here's an honest 5-year comparison with solar for a typical Abuja household.",
    content: `# Solar vs Generator: The True 5-Year Cost

Many Abuja households run generators 4–8 hours daily during AEDC outages. The purchase price of a generator looks cheap until you count five years of real ownership.

## The costs people forget

- **Fuel:** diesel/petrol spend compounds fast. A modest generator burning several litres over long outages can quietly cost hundreds of thousands of naira monthly.
- **Servicing:** oil changes, filters, spark plugs, and eventual major overhauls.
- **Waste:** oil disposal and carbon monoxide risk indoors.
- **Noise & fumes:** quality-of-life costs that don't show on any invoice.

## What solar actually costs

A properly sized solar+battery system has a higher upfront cost but near-zero fuel cost, minimal servicing (panel cleaning, occasional checks), and silent operation. Batteries absorb outages day and night without anyone refuelling at midnight.

## A simplified comparison

| | Generator (5 yrs) | Solar + battery (5 yrs) |
|---|---|---|
| Upfront | Lower | Higher |
| Fuel | Heavy, ongoing | ₦0 |
| Servicing | Frequent | Minimal |
| Noise/fumes | Yes | None |
| Resilience | Depends on fuel supply | Battery + optional gen backup |

*Numbers vary with fuel prices, usage hours and system size — treat this as a framework, not a quote.*

## The hybrid sweet spot

You don't have to choose forever. Many clients install solar with **generator auto-transfer**: solar handles daily outages silently; the generator only kicks in for rare extended bad-weather stretches. Fuel spend collapses even if the generator stays as insurance.

## Next step

Request a free quote and tell us your monthly power spend — we'll model a system that beats your current generator economics honestly.
`,
    coverImage: IMAGES.blog.vsGenerator,
    author: "Alabsglobalconcept Team",
    tags: ["cost", "generator", "solar"],
    published: true,
    publishedAt: new Date("2025-10-01"),
  },
];

export const seedSettings = {
  id: "singleton",
  announcementText: "Free site survey for solar and CCTV installations in Abuja this month — limited slots.",
  announcementLink: "/contact",
  announcementEnabled: true,
  heroHeadline: "Cut Fuel Costs. Keep the Lights On. Stay Secure.",
  heroSubheadline:
    "Abuja's trusted solar installation, equipment supply and CCTV company. Quality panels, inverters, batteries and cameras — expertly installed, warranty-backed, and supported after the job is done.",
  statProjects: 120,
  statClients: 95,
  statKwInstalled: 350,
  statYears: 6,
};
