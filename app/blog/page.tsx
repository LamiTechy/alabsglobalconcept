import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, User } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/motion/Motion";
import { SmartImage } from "@/components/media/SmartImage";
import { getBlogPosts } from "@/lib/queries";
import { excerpt } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog & Resources — Solar Guides for Nigeria",
  description:
    "Practical guides on solar sizing, battery choice, generator vs solar economics and more — written for Nigerian homes and businesses.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Solar knowledge, minus the jargon"
        description="Practical articles to help you size systems wisely, choose batteries confidently and understand the real cost of power in Nigeria."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
      />
      <section className="section-pad bg-surface">
        <div className="container-page grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={i * 0.06}>
              <Link href={`/blog/${post.slug}`} className="card card-hover group flex h-full flex-col overflow-hidden">
                <SmartImage src={post.coverImage} alt={post.title} ratio="aspect-[16/10]" />
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap gap-2">
                    {(post.tags ?? []).slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-sun-400/10 px-2.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-wider text-sun-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <h2 className="mt-3 font-display text-lg font-bold leading-snug text-deep-900 group-hover:text-sun-700">
                    {post.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted line-clamp-3">
                    {post.excerpt || excerpt(post.content, 180)}
                  </p>
                  <div className="mt-5 flex items-center gap-4 border-t border-slate-100 pt-4 text-xs text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" aria-hidden /> {post.author}
                    </span>
                    {post.publishedAt && (
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                        {new Date(post.publishedAt).toLocaleDateString("en-NG", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
