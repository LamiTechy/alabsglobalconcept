import type { MetadataRoute } from "next";
import { buildAbsoluteUrl, siteConfig } from "@/lib/site";
import { getBlogPosts, getProducts, getProjects } from "@/lib/queries";
import { SERVICES } from "@/lib/data/services";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = buildAbsoluteUrl();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    ...["/about", "/services", "/products", "/projects", "/solar-calculator", "/blog", "/contact"].map(
      (path) => ({
        url: `${base}${path}`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })
    ),
  ];

  const serviceRoutes = SERVICES.map((s) => ({
    url: `${base}/services/${s.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  let projectRoutes: MetadataRoute.Sitemap = [];
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const [products, projects, posts] = await Promise.all([
      getProducts(),
      getProjects(),
      getBlogPosts(),
    ]);
    productRoutes = products.map((p) => ({
      url: `${base}/products/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
    projectRoutes = projects.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
    blogRoutes = posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    /* database unavailable — static routes only */
  }

  void siteConfig;
  return [...staticRoutes, ...serviceRoutes, ...productRoutes, ...projectRoutes, ...blogRoutes];
}
