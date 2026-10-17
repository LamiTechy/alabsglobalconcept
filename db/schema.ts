import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  pgEnum,
  varchar,
  index,
  uniqueIndex,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "site_survey",
  "quoted",
  "won",
  "lost",
]);

export const propertyTypeEnum = pgEnum("property_type", [
  "residential",
  "commercial",
  "industrial",
  "institutional",
  "estate",
  "other",
]);

export const sourceEnum = pgEnum("lead_source", ["quote_form", "calculator", "contact", "whatsapp"]);

const createdAt = timestamp("created_at", { withTimezone: true })
  .default(sql`now()`)
  .notNull();
const updatedAt = timestamp("updated_at", { withTimezone: true })
  .default(sql`now()`)
  .notNull();

function uid() {
  return sql`gen_random_uuid()::text`;
}

// ---------------------------------------------------------------------------
// admins
// ---------------------------------------------------------------------------
export const admins = pgTable(
  "admins",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(uid()),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    role: varchar("role", { length: 32 }).notNull().default("admin"),
    createdAt,
    updatedAt,
  },
  (t) => ({
    emailIdx: uniqueIndex("admins_email_idx").on(t.email),
  })
);

// ---------------------------------------------------------------------------
// leads + notes
// ---------------------------------------------------------------------------
export const leads = pgTable(
  "leads",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(uid()),
    name: varchar("name", { length: 160 }).notNull(),
    phone: varchar("phone", { length: 40 }).notNull(),
    email: varchar("email", { length: 255 }),
    state: varchar("state", { length: 80 }),
    city: varchar("city", { length: 120 }),
    propertyType: propertyTypeEnum("property_type").notNull().default("residential"),
    serviceNeeded: varchar("service_needed", { length: 160 }),
    monthlySpend: integer("monthly_spend"),
    preferredContact: varchar("preferred_contact", { length: 20 }).default("phone"),
    message: text("message"),
    fileUrl: text("file_url"),
    status: leadStatusEnum("status").notNull().default("new"),
    source: sourceEnum("source").notNull().default("quote_form"),
    calculatorPayload: jsonb("calculator_payload"),
    userAgent: text("user_agent"),
    createdAt,
    updatedAt,
  },
  (t) => ({
    statusIdx: index("leads_status_idx").on(t.status),
    createdIdx: index("leads_created_at_idx").on(t.createdAt),
  })
);

export const leadNotes = pgTable(
  "lead_notes",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(uid()),
    leadId: varchar("lead_id", { length: 36 })
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    author: varchar("author", { length: 120 }).default("admin"),
    createdAt,
  },
  (t) => ({
    leadIdx: index("lead_notes_lead_idx").on(t.leadId),
  })
);

// ---------------------------------------------------------------------------
// catalogue
// ---------------------------------------------------------------------------
export const productCategories = pgTable(
  "product_categories",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(uid()),
    name: varchar("name", { length: 120 }).notNull(),
    slug: varchar("slug", { length: 140 }).notNull().unique(),
    description: text("description"),
    order: integer("order").notNull().default(0),
    createdAt,
    updatedAt,
  }
);

export const products = pgTable(
  "products",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(uid()),
    name: varchar("name", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 220 }).notNull().unique(),
    categoryId: varchar("category_id", { length: 36 }).references(
      (): AnyPgColumn => productCategories.id,
      { onDelete: "set null" }
    ),
    brand: varchar("brand", { length: 120 }),
    capacity: varchar("capacity", { length: 80 }),
    shortDescription: text("short_description"),
    description: text("description"),
    features: jsonb("features").$type<string[]>().default([]),
    specs: jsonb("specs").$type<Record<string, string>>().default({}),
    warranty: varchar("warranty", { length: 160 }),
    priceNaira: integer("price_naira"),
    showPrice: boolean("show_price").notNull().default(false),
    imageUrl: text("image_url"),
    gallery: jsonb("gallery").$type<string[]>().default([]),
    featured: boolean("featured").notNull().default(false),
    inStock: boolean("in_stock").notNull().default(true),
    createdAt,
    updatedAt,
  },
  (t) => ({
    categoryIdx: index("products_category_idx").on(t.categoryId),
    featuredIdx: index("products_featured_idx").on(t.featured),
  })
);

// ---------------------------------------------------------------------------
// projects
// ---------------------------------------------------------------------------
export const projects = pgTable(
  "projects",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(uid()),
    title: varchar("title", { length: 220 }).notNull(),
    slug: varchar("slug", { length: 240 }).notNull().unique(),
    category: varchar("category", { length: 40 }).notNull().default("residential"),
    location: varchar("location", { length: 160 }),
    systemSizeKw: text("system_size_kw"),
    equipment: jsonb("equipment").$type<string[]>().default([]),
    challenge: text("challenge"),
    solution: text("solution"),
    summary: text("summary"),
    coverImage: text("cover_image"),
    gallery: jsonb("gallery").$type<string[]>().default([]),
    testimonial: text("testimonial"),
    testimonialAuthor: varchar("testimonial_author", { length: 160 }),
    featured: boolean("featured").notNull().default(false),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt,
    updatedAt,
  },
  (t) => ({
    categoryIdx: index("projects_category_idx").on(t.category),
  })
);

// ---------------------------------------------------------------------------
// social proof / content
// ---------------------------------------------------------------------------
export const testimonials = pgTable("testimonials", {
  id: varchar("id", { length: 36 }).primaryKey().default(uid()),
  name: varchar("name", { length: 160 }).notNull(),
  location: varchar("location", { length: 160 }),
  systemSize: varchar("system_size", { length: 80 }),
  quote: text("quote").notNull(),
  rating: integer("rating").notNull().default(5),
  published: boolean("published").notNull().default(true),
  order: integer("order").notNull().default(0),
  createdAt,
  updatedAt,
});

export const faqs = pgTable("faqs", {
  id: varchar("id", { length: 36 }).primaryKey().default(uid()),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: varchar("category", { length: 80 }).default("general"),
  published: boolean("published").notNull().default(true),
  order: integer("order").notNull().default(0),
  createdAt,
  updatedAt,
});

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(uid()),
    title: varchar("title", { length: 240 }).notNull(),
    slug: varchar("slug", { length: 260 }).notNull().unique(),
    excerpt: text("excerpt"),
    content: text("content").notNull(),
    coverImage: text("cover_image"),
    author: varchar("author", { length: 160 }).default("Alabsglobalconcept"),
    tags: jsonb("tags").$type<string[]>().default([]),
    published: boolean("published").notNull().default(true),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt,
    updatedAt,
  },
  (t) => ({
    publishedIdx: index("blog_published_idx").on(t.published),
  })
);

// ---------------------------------------------------------------------------
// settings + calculator leads
// ---------------------------------------------------------------------------
export const siteSettings = pgTable("site_settings", {
  id: varchar("id", { length: 36 }).primaryKey().default("singleton"),
  announcementText: text("announcement_text"),
  announcementLink: text("announcement_link"),
  announcementEnabled: boolean("announcement_enabled").notNull().default(false),
  heroHeadline: text("hero_headline"),
  heroSubheadline: text("hero_subheadline"),
  statProjects: integer("stat_projects"),
  statClients: integer("stat_clients"),
  statKwInstalled: integer("stat_kw_installed"),
  statYears: integer("stat_years"),
  contactPhone: varchar("contact_phone", { length: 40 }),
  contactWhatsapp: varchar("contact_whatsapp", { length: 40 }),
  contactEmail: varchar("contact_email", { length: 255 }),
  contactAddress: text("contact_address"),
  businessHours: varchar("business_hours", { length: 120 }),
  socialInstagram: text("social_instagram"),
  socialFacebook: text("social_facebook"),
  socialX: text("social_x"),
  socialLinkedin: text("social_linkedin"),
  updatedAt,
});

export const calculatorSubmissions = pgTable(
  "calculator_submissions",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(uid()),
    name: varchar("name", { length: 160 }),
    phone: varchar("phone", { length: 40 }),
    email: varchar("email", { length: 255 }),
    location: varchar("location", { length: 160 }),
    appliances: jsonb("appliances"),
    totals: jsonb("totals"),
    recommendation: jsonb("recommendation"),
    backupHours: integer("backup_hours"),
    convertedToLeadId: varchar("converted_to_lead_id", { length: 36 }).references(
      (): AnyPgColumn => leads.id,
      { onDelete: "set null" }
    ),
    createdAt,
  },
  (t) => ({
    createdIdx: index("calc_subs_created_idx").on(t.createdAt),
  })
);
