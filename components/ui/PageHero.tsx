import { Reveal } from "@/components/motion/Motion";
import Link from "next/link";

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}) {
  return (
    <section className="relative overflow-hidden bg-deep-950 text-white">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40" aria-hidden />
      <div className="absolute inset-0 sun-glow" aria-hidden />
      <div className="container-page relative py-14 md:py-20">
        {breadcrumbs && (
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-white/55">
              {breadcrumbs.map((b, i) => (
                <li key={b.label} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden>/</span>}
                  {b.href ? (
                    <Link href={b.href} className="transition hover:text-sun-300">
                      {b.label}
                    </Link>
                  ) : (
                    <span className="text-white/85">{b.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <Reveal className="max-w-3xl">
          {eyebrow && <p className="eyebrow-dark">{eyebrow}</p>}
          <h1 className="mt-4 text-display-xl heading-display-dark">{title}</h1>
          {description && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">{description}</p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
