"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { schema } from "@/db";
import { getSession, createSessionToken, setSessionCookie, clearSessionCookie } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export type AdminActionResult = { ok: boolean; message: string; errors?: Record<string, string[]> };

export async function adminLoginAction(_prev: AdminActionResult | null, formData: FormData): Promise<AdminActionResult> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const limit = rateLimit(`login:${email || "anon"}`, 5, 60000);
  if (!limit.ok) {
    return { ok: false, message: `Too many attempts. Try again in ${limit.retryAfterSeconds}s.` };
  }

  if (!process.env.JWT_SECRET) {
    return {
      ok: false,
      message: "JWT_SECRET is not configured. Add it to your environment (see .env.example).",
    };
  }
  if (!db) {
    return {
      ok: false,
      message: "Database is not configured. Set DATABASE_URL and run npm run db:seed first.",
    };
  }

  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) {
    return { ok: false, message: "Enter a valid email and password (min 8 characters)." };
  }

  try {
    const [admin] = await db
      .select()
      .from(schema.admins)
      .where(eq(schema.admins.email, parsed.data.email))
      .limit(1);

    if (!admin) {
      return { ok: false, message: "Invalid email or password." };
    }

    const valid = await bcrypt.compare(parsed.data.password, admin.passwordHash);
    if (!valid) {
      return { ok: false, message: "Invalid email or password." };
    }

    const token = await createSessionToken({
      sub: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });
    if (!token) {
      return { ok: false, message: "Session secret not configured (JWT_SECRET)." };
    }
    await setSessionCookie(token);
  } catch (err) {
    console.error("Login error", err);
    return { ok: false, message: "Login failed. Check your database connection." };
  }

  redirect("/admin");
}

export async function adminLogoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/admin/login");
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

// --- Lead management ---------------------------------------------------------
export async function updateLeadStatusAction(input: { id: string; status: string }): Promise<AdminActionResult> {
  const session = await getSession();
  if (!session) return { ok: false, message: "Unauthorized" };
  if (!db) return { ok: false, message: "Database not configured" };
  try {
    await db
      .update(schema.leads)
      .set({ status: input.status as never, updatedAt: new Date() })
      .where(eq(schema.leads.id, input.id));
    revalidatePath("/admin/leads");
    return { ok: true, message: "Status updated" };
  } catch (err) {
    console.error(err);
    return { ok: false, message: "Failed to update status" };
  }
}

export async function addLeadNoteAction(input: { leadId: string; body: string }): Promise<AdminActionResult> {
  const session = await getSession();
  if (!session) return { ok: false, message: "Unauthorized" };
  if (!db) return { ok: false, message: "Database not configured" };
  if (!input.body.trim()) return { ok: false, message: "Note cannot be empty" };
  try {
    await db.insert(schema.leadNotes).values({
      leadId: input.leadId,
      body: input.body.trim(),
      author: session.name,
    });
    revalidatePath("/admin/leads");
    return { ok: true, message: "Note added" };
  } catch (err) {
    console.error(err);
    return { ok: false, message: "Failed to add note" };
  }
}

// --- Product CRUD ------------------------------------------------------------
export async function upsertProductAction(formData: FormData): Promise<AdminActionResult> {
  const session = await getSession();
  if (!session) return { ok: false, message: "Unauthorized" };
  if (!db) return { ok: false, message: "Database not configured" };

  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  if (!name || !slug) return { ok: false, message: "Name and slug are required" };

  let features: string[] = [];
  let specs: Record<string, string> = {};
  try {
    features = String(formData.get("features") || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  } catch {
    features = [];
  }
  try {
    specs = JSON.parse(String(formData.get("specs") || "{}") || "{}");
  } catch {
    return { ok: false, message: "Specs must be valid JSON" };
  }

  const values = {
    name,
    slug,
    categoryId: (String(formData.get("categoryId") || "") || null) as string | null,
    brand: String(formData.get("brand") || "") || null,
    capacity: String(formData.get("capacity") || "") || null,
    shortDescription: String(formData.get("shortDescription") || "") || null,
    description: String(formData.get("description") || "") || null,
    features,
    specs,
    warranty: String(formData.get("warranty") || "") || null,
    priceNaira: formData.get("priceNaira") ? Number(formData.get("priceNaira")) : null,
    showPrice: formData.get("showPrice") === "on",
    imageUrl: String(formData.get("imageUrl") || "") || null,
    featured: formData.get("featured") === "on",
    inStock: formData.get("inStock") === "on",
    updatedAt: new Date(),
  };

  try {
    if (id) {
      await db.update(schema.products).set(values).where(eq(schema.products.id, id));
    } else {
      await db.insert(schema.products).values(values);
    }
    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { ok: true, message: id ? "Product updated" : "Product created" };
  } catch (err) {
    console.error(err);
    return { ok: false, message: "Save failed (is the slug unique?)" };
  }
}

export async function deleteProductAction(id: string): Promise<AdminActionResult> {
  const session = await getSession();
  if (!session) return { ok: false, message: "Unauthorized" };
  if (!db) return { ok: false, message: "Database not configured" };
  try {
    await db.delete(schema.products).where(eq(schema.products.id, id));
    revalidatePath("/admin/products");
    return { ok: true, message: "Deleted" };
  } catch {
    return { ok: false, message: "Delete failed" };
  }
}

// --- Testimonial / FAQ / Blog / Project / Settings (minimal) ----------------
export async function togglePublishedAction(
  table: "testimonials" | "faqs" | "blog_posts",
  id: string,
  published: boolean
): Promise<AdminActionResult> {
  const session = await getSession();
  if (!session) return { ok: false, message: "Unauthorized" };
  if (!db) return { ok: false, message: "Database not configured" };
  try {
    const t =
      table === "testimonials"
        ? schema.testimonials
        : table === "faqs"
          ? schema.faqs
          : schema.blogPosts;
    await db.update(t).set({ published, updatedAt: new Date() }).where(eq(t.id, id));
    revalidatePath("/admin");
    return { ok: true, message: published ? "Published" : "Unpublished" };
  } catch (err) {
    console.error(err);
    return { ok: false, message: "Update failed" };
  }
}

export async function upsertFaqAction(formData: FormData): Promise<AdminActionResult> {
  const session = await getSession();
  if (!session) return { ok: false, message: "Unauthorized" };
  if (!db) return { ok: false, message: "Database not configured" };
  const id = String(formData.get("id") || "");
  const question = String(formData.get("question") || "").trim();
  const answer = String(formData.get("answer") || "").trim();
  if (!question || !answer) return { ok: false, message: "Question and answer are required" };
  const values = { question, answer, category: String(formData.get("category") || "general"), updatedAt: new Date() };
  try {
    if (id) await db.update(schema.faqs).set(values).where(eq(schema.faqs.id, id));
    else await db.insert(schema.faqs).values(values);
    revalidatePath("/admin/faqs");
    revalidatePath("/contact");
    return { ok: true, message: id ? "FAQ updated" : "FAQ created" };
  } catch {
    return { ok: false, message: "Save failed" };
  }
}

export async function deleteFaqAction(id: string): Promise<AdminActionResult> {
  const session = await getSession();
  if (!session) return { ok: false, message: "Unauthorized" };
  if (!db) return { ok: false, message: "Database not configured" };
  await db.delete(schema.faqs).where(eq(schema.faqs.id, id));
  revalidatePath("/admin/faqs");
  return { ok: true, message: "Deleted" };
}

export async function upsertTestimonialAction(formData: FormData): Promise<AdminActionResult> {
  const session = await getSession();
  if (!session) return { ok: false, message: "Unauthorized" };
  if (!db) return { ok: false, message: "Database not configured" };
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const quote = String(formData.get("quote") || "").trim();
  if (!name || !quote) return { ok: false, message: "Name and quote are required" };
  const values = {
    name,
    quote,
    location: String(formData.get("location") || "") || null,
    systemSize: String(formData.get("systemSize") || "") || null,
    rating: Number(formData.get("rating") || 5),
    published: formData.get("published") === "on",
    order: Number(formData.get("order") || 0),
    updatedAt: new Date(),
  };
  try {
    if (id) await db.update(schema.testimonials).set(values).where(eq(schema.testimonials.id, id));
    else await db.insert(schema.testimonials).values(values);
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { ok: true, message: id ? "Updated" : "Created" };
  } catch {
    return { ok: false, message: "Save failed" };
  }
}

export async function deleteTestimonialAction(id: string): Promise<AdminActionResult> {
  const session = await getSession();
  if (!session) return { ok: false, message: "Unauthorized" };
  if (!db) return { ok: false, message: "Database not configured" };
  await db.delete(schema.testimonials).where(eq(schema.testimonials.id, id));
  revalidatePath("/admin/testimonials");
  return { ok: true, message: "Deleted" };
}

export async function upsertBlogAction(formData: FormData): Promise<AdminActionResult> {
  const session = await getSession();
  if (!session) return { ok: false, message: "Unauthorized" };
  if (!db) return { ok: false, message: "Database not configured" };
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const content = String(formData.get("content") || "").trim();
  if (!title || !slug || !content) return { ok: false, message: "Title, slug and content are required" };
  const published = formData.get("published") === "on";
  const values = {
    title,
    slug,
    content,
    excerpt: String(formData.get("excerpt") || "") || null,
    coverImage: String(formData.get("coverImage") || "") || null,
    author: String(formData.get("author") || "Alabsglobalconcept"),
    tags: String(formData.get("tags") || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    published,
    publishedAt: published ? new Date() : null,
    updatedAt: new Date(),
  };
  try {
    if (id) await db.update(schema.blogPosts).set(values).where(eq(schema.blogPosts.id, id));
    else await db.insert(schema.blogPosts).values(values);
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { ok: true, message: id ? "Updated" : "Created" };
  } catch {
    return { ok: false, message: "Save failed (unique slug?)" };
  }
}

export async function deleteBlogAction(id: string): Promise<AdminActionResult> {
  const session = await getSession();
  if (!session) return { ok: false, message: "Unauthorized" };
  if (!db) return { ok: false, message: "Database not configured" };
  await db.delete(schema.blogPosts).where(eq(schema.blogPosts.id, id));
  revalidatePath("/admin/blog");
  return { ok: true, message: "Deleted" };
}

export async function upsertProjectAction(formData: FormData): Promise<AdminActionResult> {
  const session = await getSession();
  if (!session) return { ok: false, message: "Unauthorized" };
  if (!db) return { ok: false, message: "Database not configured" };
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  if (!title || !slug) return { ok: false, message: "Title and slug are required" };
  const parseList = (v: string) =>
    v
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  const values = {
    title,
    slug,
    category: String(formData.get("category") || "residential"),
    location: String(formData.get("location") || "") || null,
    systemSizeKw: String(formData.get("systemSizeKw") || "") || null,
    equipment: parseList(String(formData.get("equipment") || "")),
    challenge: String(formData.get("challenge") || "") || null,
    solution: String(formData.get("solution") || "") || null,
    summary: String(formData.get("summary") || "") || null,
    coverImage: String(formData.get("coverImage") || "") || null,
    testimonial: String(formData.get("testimonial") || "") || null,
    testimonialAuthor: String(formData.get("testimonialAuthor") || "") || null,
    featured: formData.get("featured") === "on",
    updatedAt: new Date(),
  };
  try {
    if (id) await db.update(schema.projects).set(values).where(eq(schema.projects.id, id));
    else await db.insert(schema.projects).values(values);
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    return { ok: true, message: id ? "Updated" : "Created" };
  } catch {
    return { ok: false, message: "Save failed (unique slug?)" };
  }
}

export async function deleteProjectAction(id: string): Promise<AdminActionResult> {
  const session = await getSession();
  if (!session) return { ok: false, message: "Unauthorized" };
  if (!db) return { ok: false, message: "Database not configured" };
  await db.delete(schema.projects).where(eq(schema.projects.id, id));
  revalidatePath("/admin/projects");
  return { ok: true, message: "Deleted" };
}

export async function saveSettingsAction(formData: FormData): Promise<AdminActionResult> {
  const session = await getSession();
  if (!session) return { ok: false, message: "Unauthorized" };
  if (!db) return { ok: false, message: "Database not configured" };
  const num = (k: string) => (formData.get(k) ? Number(formData.get(k)) : null);
  const values = {
    announcementText: String(formData.get("announcementText") || "") || null,
    announcementLink: String(formData.get("announcementLink") || "") || null,
    announcementEnabled: formData.get("announcementEnabled") === "on",
    heroHeadline: String(formData.get("heroHeadline") || "") || null,
    heroSubheadline: String(formData.get("heroSubheadline") || "") || null,
    statProjects: num("statProjects"),
    statClients: num("statClients"),
    statKwInstalled: num("statKwInstalled"),
    statYears: num("statYears"),
    contactPhone: String(formData.get("contactPhone") || "") || null,
    contactWhatsapp: String(formData.get("contactWhatsapp") || "") || null,
    contactEmail: String(formData.get("contactEmail") || "") || null,
    contactAddress: String(formData.get("contactAddress") || "") || null,
    businessHours: String(formData.get("businessHours") || "") || null,
    socialInstagram: String(formData.get("socialInstagram") || "") || null,
    socialFacebook: String(formData.get("socialFacebook") || "") || null,
    socialX: String(formData.get("socialX") || "") || null,
    socialLinkedin: String(formData.get("socialLinkedin") || "") || null,
    updatedAt: new Date(),
  };
  try {
    await db
      .insert(schema.siteSettings)
      .values({ id: "singleton", ...values })
      .onConflictDoUpdate({ target: schema.siteSettings.id, set: values });
    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");
    return { ok: true, message: "Settings saved" };
  } catch (err) {
    console.error(err);
    return { ok: false, message: "Save failed" };
  }
}
