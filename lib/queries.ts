import { cache } from "react";
import { db } from "@/db";
import { schema } from "@/db";
import { desc, eq, asc, and, ilike, or, count, gte } from "drizzle-orm";
import {
  seedCategories,
  seedProducts,
  seedProjects,
  seedTestimonials,
  seedFaqs,
  seedBlogPosts,
  seedSettings,
} from "@/db/seed-data";

/**
 * Query layer. Every getter tries the database first and falls back to seed
 * content so the site renders fully in local dev without Neon configured.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type ProductRow = {
  id: string;
  name: string;
  slug: string;
  categoryId: string | null;
  brand: string | null;
  capacity: string | null;
  shortDescription: string | null;
  description: string | null;
  features: string[] | null;
  specs: Record<string, string> | null;
  warranty: string | null;
  priceNaira: number | null;
  showPrice: boolean;
  imageUrl: string | null;
  gallery: string[] | null;
  featured: boolean;
  inStock: boolean;
};

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order: number;
};

// ---------------------------------------------------------------------------
// Fallback mappers (seed → query shapes)
// ---------------------------------------------------------------------------
function fallbackCategories(): CategoryRow[] {
  return seedCategories.map((c, i) => ({
    id: `seed-cat-${c.slug}`,
    name: c.name,
    slug: c.slug,
    description: c.description,
    order: c.order ?? i,
  }));
}

function fallbackProducts(): ProductRow[] {
  const catBySlug = new Map(fallbackCategories().map((c) => [c.slug, c.id]));
  return seedProducts.map((p) => ({
    id: `seed-prod-${p.slug}`,
    name: p.name,
    slug: p.slug,
    categoryId: catBySlug.get(p.categorySlug) ?? null,
    brand: p.brand,
    capacity: p.capacity,
    shortDescription: p.shortDescription,
    description: p.description,
    features: p.features,
    specs: p.specs,
    warranty: p.warranty,
    priceNaira: p.priceNaira,
    showPrice: p.showPrice,
    imageUrl: p.imageUrl,
    gallery: p.gallery ?? [],
    featured: p.featured,
    inStock: p.inStock,
  }));
}

function fallbackProjects() {
  return seedProjects.map((p, i) => ({
    id: `seed-proj-${i}`,
    ...p,
    gallery: p.gallery ?? [],
    equipment: p.equipment ?? [],
  }));
}

function fallbackTestimonials() {
  return seedTestimonials.map((t, i) => ({ id: `seed-t-${i}`, ...t }));
}

function fallbackFaqs() {
  return seedFaqs.map((f, i) => ({ id: `seed-f-${i}`, ...f }));
}

function fallbackBlogPosts() {
  return seedBlogPosts.map((b, i) => ({
    id: `seed-b-${i}`,
    ...b,
    createdAt: b.publishedAt,
  }));
}

function fallbackSettings() {
  return {
    id: "singleton",
    announcementText: seedSettings.announcementText,
    announcementLink: seedSettings.announcementLink,
    announcementEnabled: seedSettings.announcementEnabled,
    heroHeadline: seedSettings.heroHeadline,
    heroSubheadline: seedSettings.heroSubheadline,
    statProjects: seedSettings.statProjects,
    statClients: seedSettings.statClients,
    statKwInstalled: seedSettings.statKwInstalled,
    statYears: seedSettings.statYears,
    contactPhone: null as string | null,
    contactWhatsapp: null as string | null,
    contactEmail: null as string | null,
    contactAddress: null as string | null,
    businessHours: null as string | null,
    socialInstagram: null as string | null,
    socialFacebook: null as string | null,
    socialX: null as string | null,
    socialLinkedin: null as string | null,
  };
}

// ---------------------------------------------------------------------------
// Public getters
// ---------------------------------------------------------------------------
export const getSiteSettings = cache(async () => {
  if (!db) return fallbackSettings();
  try {
    const [row] = await db.select().from(schema.siteSettings).limit(1);
    return row ?? fallbackSettings();
  } catch {
    return fallbackSettings();
  }
});

export const getCategories = cache(async (): Promise<CategoryRow[]> => {
  if (!db) return fallbackCategories();
  try {
    const rows = await db
      .select()
      .from(schema.productCategories)
      .orderBy(asc(schema.productCategories.order));
    return rows.length ? rows : fallbackCategories();
  } catch {
    return fallbackCategories();
  }
});

export const getProducts = cache(
  async (opts?: { category?: string; featured?: boolean; search?: string }): Promise<ProductRow[]> => {
    let rows: ProductRow[] | null = null;
    if (db) {
      try {
        const conds = [];
        if (opts?.featured) conds.push(eq(schema.products.featured, true));
        if (opts?.category) {
          const [cat] = await db
            .select()
            .from(schema.productCategories)
            .where(eq(schema.productCategories.slug, opts.category))
            .limit(1);
          if (cat) conds.push(eq(schema.products.categoryId, cat.id));
        }
        if (opts?.search) {
          const q = `%${opts.search}%`;
          conds.push(
            or(ilike(schema.products.name, q), ilike(schema.products.shortDescription ?? schema.products.name, q))
          );
        }
        rows = await db
          .select()
          .from(schema.products)
          .where(conds.length ? and(...conds) : undefined)
          .orderBy(desc(schema.products.featured), asc(schema.products.name));
      } catch {
        rows = null;
      }
    }
    let result = rows && rows.length ? rows : fallbackProducts();
    if (!db || !rows?.length) {
      // apply filters on fallback
      if (opts?.featured) result = result.filter((p) => p.featured);
      if (opts?.category) {
        const catId = fallbackCategories().find((c) => c.slug === opts.category)?.id;
        result = result.filter((p) => p.categoryId === catId);
      }
      if (opts?.search) {
        const q = opts.search.toLowerCase();
        result = result.filter(
          (p) => p.name.toLowerCase().includes(q) || (p.shortDescription ?? "").toLowerCase().includes(q)
        );
      }
    }
    return result;
  }
);

export const getProductBySlug = cache(async (slug: string) => {
  if (db) {
    try {
      const [row] = await db.select().from(schema.products).where(eq(schema.products.slug, slug)).limit(1);
      if (row) return row as ProductRow;
    } catch {
      /* fall through */
    }
  }
  return fallbackProducts().find((p) => p.slug === slug) ?? null;
});

export const getRelatedProducts = cache(async (product: ProductRow, limit = 4) => {
  const all = await getProducts();
  const related = all.filter((p) => p.id !== product.id && p.categoryId === product.categoryId);
  const fill = all.filter((p) => p.id !== product.id && p.categoryId !== product.categoryId);
  return [...related, ...fill].slice(0, limit);
});

export const getProjects = cache(async (opts?: { category?: string }) => {
  let rows: Array<{
    id: string;
    title: string;
    slug: string;
    category: string;
    location: string | null;
    systemSizeKw: string | null;
    equipment: string[] | null;
    challenge: string | null;
    solution: string | null;
    summary: string | null;
    coverImage: string | null;
    gallery: string[] | null;
    testimonial: string | null;
    testimonialAuthor: string | null;
    featured: boolean;
    completedAt: Date | null;
  }> | null = null;
  if (db) {
    try {
      rows = await db
        .select()
        .from(schema.projects)
        .where(opts?.category ? eq(schema.projects.category, opts.category) : undefined)
        .orderBy(desc(schema.projects.completedAt));
    } catch {
      rows = null;
    }
  }
  let result = rows && rows.length ? rows : fallbackProjects();
  if ((!db || !rows?.length) && opts?.category) {
    result = result.filter((p) => p.category === opts.category);
  }
  return result;
});

export const getProjectBySlug = cache(async (slug: string) => {
  if (db) {
    try {
      const [row] = await db.select().from(schema.projects).where(eq(schema.projects.slug, slug)).limit(1);
      if (row) return row;
    } catch {
      /* fall through */
    }
  }
  return fallbackProjects().find((p) => p.slug === slug) ?? null;
});

export const getFeaturedProjects = cache(async (limit = 3) => {
  const all = await getProjects();
  const featured = all.filter((p) => p.featured);
  return (featured.length ? featured : all).slice(0, limit);
});

export const getTestimonials = cache(async () => {
  if (db) {
    try {
      const rows = await db
        .select()
        .from(schema.testimonials)
        .where(eq(schema.testimonials.published, true))
        .orderBy(asc(schema.testimonials.order));
      if (rows.length) return rows;
    } catch {
      /* fall through */
    }
  }
  return fallbackTestimonials();
});

export const getFaqs = cache(async () => {
  if (db) {
    try {
      const rows = await db
        .select()
        .from(schema.faqs)
        .where(eq(schema.faqs.published, true))
        .orderBy(asc(schema.faqs.order));
      if (rows.length) return rows;
    } catch {
      /* fall through */
    }
  }
  return fallbackFaqs();
});

export const getBlogPosts = cache(async () => {
  if (db) {
    try {
      const rows = await db
        .select()
        .from(schema.blogPosts)
        .where(eq(schema.blogPosts.published, true))
        .orderBy(desc(schema.blogPosts.publishedAt));
      if (rows.length) return rows;
    } catch {
      /* fall through */
    }
  }
  return fallbackBlogPosts();
});

export const getBlogPostBySlug = cache(async (slug: string) => {
  if (db) {
    try {
      const [row] = await db.select().from(schema.blogPosts).where(eq(schema.blogPosts.slug, slug)).limit(1);
      if (row) return row;
    } catch {
      /* fall through */
    }
  }
  return fallbackBlogPosts().find((p) => p.slug === slug) ?? null;
});

// ---------------------------------------------------------------------------
// Admin-only getters
// ---------------------------------------------------------------------------
export type LeadRow = typeof schema.leads.$inferSelect;

export async function adminListLeads(opts?: {
  status?: string;
  search?: string;
  limit?: number;
}): Promise<LeadRow[]> {
  if (!db) return [];
  try {
    const conds = [];
    if (opts?.status && opts.status !== "all") {
      conds.push(eq(schema.leads.status, opts.status as never));
    }
    if (opts?.search) {
      const q = `%${opts.search}%`;
      conds.push(or(ilike(schema.leads.name, q), ilike(schema.leads.phone, q), ilike(schema.leads.email ?? schema.leads.phone, q)));
    }
    return await db
      .select()
      .from(schema.leads)
      .where(conds.length ? and(...conds) : undefined)
      .orderBy(desc(schema.leads.createdAt))
      .limit(opts?.limit ?? 200);
  } catch {
    return [];
  }
}

export async function adminGetLead(id: string) {
  if (!db) return null;
  try {
    const [lead] = await db.select().from(schema.leads).where(eq(schema.leads.id, id)).limit(1);
    if (!lead) return null;
    const notes = await db
      .select()
      .from(schema.leadNotes)
      .where(eq(schema.leadNotes.leadId, id))
      .orderBy(desc(schema.leadNotes.createdAt));
    return { lead, notes };
  } catch {
    return null;
  }
}

export async function adminStats() {
  const empty = { leadsTotal: 0, leadsThisWeek: 0, leadsWon: 0, byStatus: {} as Record<string, number> };
  if (!db) return empty;
  try {
    const [total] = await db.select({ value: count() }).from(schema.leads);
    const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000);
    const [thisWeek] = await db.select({ value: count() }).from(schema.leads).where(gte(schema.leads.createdAt, weekAgo));
    const [won] = await db.select({ value: count() }).from(schema.leads).where(eq(schema.leads.status, "won"));
    const statusRows = await db.select({
      status: schema.leads.status,
      n: count(),
    }).from(schema.leads).groupBy(schema.leads.status);
    const byStatus: Record<string, number> = {};
    for (const r of statusRows) byStatus[r.status] = r.n;
    return {
      leadsTotal: total?.value ?? 0,
      leadsThisWeek: thisWeek?.value ?? 0,
      leadsWon: won?.value ?? 0,
      byStatus,
    };
  } catch {
    return empty;
  }
}

export const adminListProducts = cache(async () => {
  if (!db) return fallbackProducts();
  try {
    const rows = await db.select().from(schema.products).orderBy(desc(schema.products.createdAt));
    return rows.length ? rows : fallbackProducts();
  } catch {
    return fallbackProducts();
  }
});

export const adminListProjects = cache(async () => {
  if (!db) return fallbackProjects();
  try {
    const rows = await db.select().from(schema.projects).orderBy(desc(schema.projects.createdAt));
    return rows.length ? rows : fallbackProjects();
  } catch {
    return fallbackProjects();
  }
});

export const adminListTestimonials = cache(async () => {
  if (!db) return fallbackTestimonials();
  try {
    const rows = await db.select().from(schema.testimonials).orderBy(asc(schema.testimonials.order));
    return rows.length ? rows : fallbackTestimonials();
  } catch {
    return fallbackTestimonials();
  }
});

export const adminListFaqs = cache(async () => {
  if (!db) return fallbackFaqs();
  try {
    const rows = await db.select().from(schema.faqs).orderBy(asc(schema.faqs.order));
    return rows.length ? rows : fallbackFaqs();
  } catch {
    return fallbackFaqs();
  }
});

export const adminListBlogPosts = cache(async () => {
  if (!db) return fallbackBlogPosts();
  try {
    const rows = await db.select().from(schema.blogPosts).orderBy(desc(schema.blogPosts.createdAt));
    return rows.length ? rows : fallbackBlogPosts();
  } catch {
    return fallbackBlogPosts();
  }
});
