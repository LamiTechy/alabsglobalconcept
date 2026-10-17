import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getBlogPostBySlug } from "@/lib/queries";
import { buildAbsoluteUrl, whatsappLink, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/site";
import { ButtonLink } from "@/components/ui/Button";
import { SmartImage } from "@/components/media/SmartImage";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt || undefined,
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author || "Alabsglobalconcept"],
    },
  };
}

/** Minimal markdown-ish renderer: paragraphs, headings, lists, tables, bold */
function renderContent(content: string) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let listItems: string[] = [];
  let inList = false;

  const flushList = (key: string) => {
    if (listItems.length) {
      blocks.push(
        <ul key={`${key}-ul`} className="my-4 list-disc space-y-1.5 pl-6 text-muted">
          {listItems.map((li, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: inline(li) }} />
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const inline = (t: string) =>
    t
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>");

  let i = 0;
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushList(`blank-${i}`);
      i++;
      continue;
    }
    if (line.startsWith("- ")) {
      inList = true;
      listItems.push(line.slice(2));
      i++;
      continue;
    }
    if (inList) flushList(`flush-${i}`);
    if (line.startsWith("### ")) {
      blocks.push(
        <h3 key={i} className="mt-8 font-display text-xl font-bold text-deep-900" dangerouslySetInnerHTML={{ __html: inline(line.slice(4)) }} />
      );
    } else if (line.startsWith("## ")) {
      blocks.push(
        <h2 key={i} className="mt-10 font-display text-2xl font-bold text-deep-900" dangerouslySetInnerHTML={{ __html: inline(line.slice(3)) }} />
      );
    } else if (line.startsWith("# ")) {
      // skip the H1 — page already has the title
    } else if (line.startsWith("|")) {
      // skip markdown tables (rendered as simple rows)
      if (line.replace(/[\s|:-]/g, "") === "") continue;
      const cells = line.split("|").map((c) => c.trim()).filter(Boolean);
      blocks.push(
        <div key={i} className="my-1 grid grid-cols-2 gap-2 rounded-lg bg-surface px-4 py-2 text-sm">
          {cells.map((c, ci) => (
            <span key={ci} className={ci === 0 ? "text-muted" : "font-semibold text-deep-900"} dangerouslySetInnerHTML={{ __html: inline(c) }} />
          ))}
        </div>
      );
    } else {
      blocks.push(
        <p key={i} className="my-4 leading-relaxed text-muted" dangerouslySetInnerHTML={{ __html: inline(line) }} />
      );
    }
    i++;
  }
  flushList("end");
  return blocks;
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: "Alabsglobalconcept" },
    datePublished: post.publishedAt?.toISOString(),
    url: buildAbsoluteUrl(`/blog/${post.slug}`),
    image: post.coverImage ? [buildAbsoluteUrl(post.coverImage)] : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="bg-white">
        <div className="container-page max-w-3xl py-12 md:py-16">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-sun-600 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> All articles
          </Link>
          <h1 className="mt-6 font-display text-display-lg font-bold tracking-tight text-deep-900">
            {post.title}
          </h1>
          <p className="mt-3 text-sm text-muted">
            By {post.author}
            {post.publishedAt
              ? ` · ${new Date(post.publishedAt).toLocaleDateString("en-NG", { month: "long", day: "numeric", year: "numeric" })}`
              : ""}
          </p>
          <div className="mt-8">
            <SmartImage src={post.coverImage} alt={post.title} ratio="aspect-[16/9]" className="rounded-2xl" priority />
          </div>
          <div className="prose-agc mt-10">{renderContent(post.content)}</div>
          <div className="mt-12 rounded-2xl border border-sun-200 bg-sun-50 p-6 text-center">
            <p className="font-display text-lg font-bold text-deep-900">Want a system sized for your actual loads?</p>
            <p className="mt-1 text-sm text-muted">Try our free calculator or talk to the team directly.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/solar-calculator">Open solar calculator</ButtonLink>
              <ButtonLink
                href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
                variant="whatsapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp us
              </ButtonLink>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
