import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/motion/Motion";
import { SmartImage } from "@/components/media/SmartImage";
import { getProjects } from "@/lib/queries";
import { PROJECT_CATEGORIES } from "@/lib/data/services";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Completed Solar Projects — Abuja Homes, Clinics, Offices & Estates",
  description:
    "Browse residential, commercial, industrial and institutional solar installations completed by Alabsglobalconcept across Abuja, FCT.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const active = searchParams.category || "all";
  const projects = await getProjects(
    active !== "all" ? { category: active } : undefined
  );

  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Projects that power real life"
        description="From 3-bedroom flats in Gwarinpa to clinics in Wuse II and estate street lighting in Lugbe — here's our recent work."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Projects" }]}
      />
      <section className="section-pad bg-surface">
        <div className="container-page">
          <div className="flex flex-wrap gap-2.5" role="navigation" aria-label="Project categories">
            <Link
              href="/projects"
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                active === "all"
                  ? "bg-deep-900 text-white"
                  : "border border-slate-300 bg-white text-deep-900 hover:border-sun-400"
              )}
            >
              All
            </Link>
            {PROJECT_CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/projects?category=${c.slug}`}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  active === c.slug
                    ? "bg-deep-900 text-white"
                    : "border border-slate-300 bg-white text-deep-900 hover:border-sun-400"
                )}
              >
                {c.label}
              </Link>
            ))}
          </div>

          {projects.length === 0 ? (
            <p className="mt-16 text-center text-muted">No projects in this category yet.</p>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.05}>
                  <Link href={`/projects/${p.slug}`} className="card card-hover group flex h-full flex-col overflow-hidden">
                    <SmartImage src={p.coverImage} alt={p.title} ratio="aspect-[16/11]" />
                    <div className="flex flex-1 flex-col p-6">
                      <span className="text-xs font-bold uppercase tracking-wider text-sun-600">
                        {p.category} · {p.systemSizeKw}
                      </span>
                      <h2 className="mt-2 font-display text-lg font-bold leading-snug text-deep-900 group-hover:text-sun-700">
                        {p.title}
                      </h2>
                      <p className="mt-2 flex-1 text-sm text-muted line-clamp-2">{p.summary}</p>
                      <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted">
                        <MapPin className="h-3.5 w-3.5 text-sun-500" aria-hidden />
                        {p.location}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
