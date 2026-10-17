import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import {
  seedCategories,
  seedProducts,
  seedProjects,
  seedTestimonials,
  seedFaqs,
  seedBlogPosts,
  seedSettings,
} from "./seed-data";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("❌ DATABASE_URL is not set. Add it to .env (copy from .env.example).");
    process.exit(1);
  }

  const client = postgres(url, { max: 1, prepare: false });
  const db = drizzle(client, { schema });

  console.log("🌱 Seeding database…");

  // Admin is created by migration db/migrations/0001_seed_admin.sql

  // --- Categories ---------------------------------------------------------
  const catIdBySlug = new Map<string, string>();
  for (const cat of seedCategories) {
    const [row] = await db
      .insert(schema.productCategories)
      .values(cat)
      .onConflictDoUpdate({
        target: schema.productCategories.slug,
        set: { name: cat.name, description: cat.description, order: cat.order },
      })
      .returning({ id: schema.productCategories.id, slug: schema.productCategories.slug });
    catIdBySlug.set(cat.slug, row.id);
  }
  console.log(`📁 Categories: ${seedCategories.length}`);

  // --- Products -----------------------------------------------------------
  for (const p of seedProducts) {
    const { categorySlug, ...rest } = p;
    await db
      .insert(schema.products)
      .values({ ...rest, categoryId: catIdBySlug.get(categorySlug) ?? null })
      .onConflictDoUpdate({ target: schema.products.slug, set: rest });
  }
  console.log(`📦 Products: ${seedProducts.length}`);

  // --- Projects -----------------------------------------------------------
  for (const p of seedProjects) {
    await db
      .insert(schema.projects)
      .values(p)
      .onConflictDoUpdate({ target: schema.projects.slug, set: p });
  }
  console.log(`🏗️  Projects: ${seedProjects.length}`);

  // --- Testimonials (upsert by name) --------------------------------------
  const existingTestimonials = await db.select().from(schema.testimonials);
  if (existingTestimonials.length === 0) {
    await db.insert(schema.testimonials).values(seedTestimonials);
  }
  console.log(`💬 Testimonials: ${seedTestimonials.length}`);

  // --- FAQs ---------------------------------------------------------------
  const existingFaqs = await db.select().from(schema.faqs);
  if (existingFaqs.length === 0) {
    await db.insert(schema.faqs).values(seedFaqs);
  }
  console.log(`❓ FAQs: ${seedFaqs.length}`);

  // --- Blog posts ---------------------------------------------------------
  for (const post of seedBlogPosts) {
    await db
      .insert(schema.blogPosts)
      .values(post)
      .onConflictDoUpdate({ target: schema.blogPosts.slug, set: post });
  }
  console.log(`📝 Blog posts: ${seedBlogPosts.length}`);

  // --- Settings -----------------------------------------------------------
  await db
    .insert(schema.siteSettings)
    .values(seedSettings)
    .onConflictDoUpdate({ target: schema.siteSettings.id, set: seedSettings });
  console.log("⚙️  Site settings upserted");

  console.log("✅ Seed complete.");
  await client.end();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
