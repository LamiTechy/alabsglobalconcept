import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Quote, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/motion/Motion";
import { SmartImage } from "@/components/media/SmartImage";
import { ButtonLink } from "@/components/ui/Button";
import { getProjectBySlug } from "@/lib/queries";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.summary || `${project.title} — solar installation by Alabsglobalconcept, Abuja.`,
    alternates: { canonical: `/projects/${project.slug}` },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  const gallery = project.gallery?.length
    ? project.gallery
    : project.coverImage
      ? [project.coverImage]
      : [];

  return (
    <>
      <PageHero
        eyebrow={`${project.category} project · ${project.systemSizeKw ?? ""}`}
        title={project.title}
        description={project.summary || undefined}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects" },
          { label: project.title },
        ]}
      />

      <section className="section-pad bg-white">
        <div className="container-page grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <Reveal>
              <SmartImage
                src={gallery[0] ?? null}
                alt={`${project.title} — completed installation`}
                ratio="aspect-[16/10]"
                className="rounded-3xl"
                priority
              />
            </Reveal>

            {project.challenge && (
              <Reveal>
                <h2 className="font-display text-display-sm font-bold text-deep-900">The challenge</h2>
                <p className="mt-3 text-base leading-relaxed text-muted">{project.challenge}</p>
              </Reveal>
            )}
            {project.solution && (
              <Reveal>
                <h2 className="font-display text-display-sm font-bold text-deep-900">Our solution</h2>
                <p className="mt-3 text-base leading-relaxed text-muted">{project.solution}</p>
              </Reveal>
            )}

            {gallery.length > 1 && (
              <Reveal>
                <h2 className="font-display text-display-sm font-bold text-deep-900">Gallery</h2>
                <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
                  {gallery.map((img, i) => (
                    <SmartImage
                      key={i}
                      src={img}
                      alt={`${project.title} photo ${i + 1}`}
                      ratio="aspect-[4/3]"
                      className="rounded-2xl"
                      sizes="(max-width:768px) 50vw, 33vw"
                    />
                  ))}
                </div>
              </Reveal>
            )}

            {project.testimonial && (
              <Reveal>
                <figure className="rounded-3xl border border-sun-200 bg-sun-50 p-8">
                  <Quote className="h-7 w-7 text-sun-500" aria-hidden />
                  <blockquote className="mt-3 font-display text-lg leading-relaxed text-deep-900">
                    “{project.testimonial}”
                  </blockquote>
                  {project.testimonialAuthor && (
                    <figcaption className="mt-4 text-sm font-semibold text-muted">
                      — {project.testimonialAuthor}
                    </figcaption>
                  )}
                </figure>
              </Reveal>
            )}
          </div>

          <aside className="space-y-6">
            <div className="card p-6">
              <h2 className="font-display text-lg font-bold text-deep-900">Project facts</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                  <dt className="text-muted">Location</dt>
                  <dd className="text-right font-semibold text-deep-900">{project.location}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                  <dt className="text-muted">System size</dt>
                  <dd className="font-semibold text-deep-900">{project.systemSizeKw}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                  <dt className="text-muted">Category</dt>
                  <dd className="font-semibold capitalize text-deep-900">{project.category}</dd>
                </div>
                {project.completedAt && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">Completed</dt>
                    <dd className="font-semibold text-deep-900">
                      {new Date(project.completedAt).toLocaleDateString("en-NG", {
                        month: "short",
                        year: "numeric",
                      })}
                    </dd>
                  </div>
                )}
              </dl>

              {project.equipment && project.equipment.length > 0 && (
                <div className="mt-6 border-t border-slate-100 pt-5">
                  <h3 className="text-sm font-bold text-deep-900">Equipment used</h3>
                  <ul className="mt-3 space-y-1.5 text-sm text-muted">
                    {project.equipment.map((e) => (
                      <li key={e} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sun-400" aria-hidden />
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 border-t border-slate-100 pt-5">
                <p className="flex items-center gap-2 text-xs text-muted">
                  <MapPin className="h-3.5 w-3.5 text-sun-500" aria-hidden />
                  Serving {project.location} and beyond
                </p>
                <ButtonLink href="/contact" className="mt-4 w-full">
                  Get a similar system <ArrowRight className="h-4 w-4" aria-hidden />
                </ButtonLink>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-surface py-10 text-center">
        <Link href="/projects" className="text-sm font-semibold text-sun-600 hover:underline">
          ← Back to all projects
        </Link>
      </section>
    </>
  );
}
