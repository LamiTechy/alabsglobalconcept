import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShieldCheck, MessageCircle, FileText, Check, PackageCheck } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Motion";
import { ButtonLink } from "@/components/ui/Button";
import { SmartImage } from "@/components/media/SmartImage";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries";
import { whatsappLink, buildAbsoluteUrl } from "@/lib/site";
import { formatNaira } from "@/lib/utils";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.shortDescription || `${product.name} — available from Alabsglobalconcept, Abuja.`,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription || undefined,
      images: product.imageUrl ? [{ url: product.imageUrl }] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);
  const gallery = product.gallery?.length ? product.gallery : product.imageUrl ? [product.imageUrl] : [];
  const waMessage = `Hello! I'm interested in this product: ${product.name} (${buildAbsoluteUrl(`/products/${product.slug}`)}). Please share price and availability.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || undefined,
    sku: product.slug,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    image: gallery.map((g) => buildAbsoluteUrl(g)),
    offers: {
      "@type": "Offer",
      priceCurrency: "NGN",
      price: product.showPrice && product.priceNaira ? String(product.priceNaira) : undefined,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: buildAbsoluteUrl(`/products/${product.slug}`),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        eyebrow={product.capacity || "Product"}
        title={product.name}
        description={product.shortDescription || undefined}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: product.name },
        ]}
      />

      <section className="section-pad bg-white">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          {/* Gallery */}
          <Reveal>
            <div className="space-y-3">
              <SmartImage
                src={gallery[0] ?? null}
                alt={`${product.name} — product photo`}
                ratio="aspect-[4/3]"
                className="rounded-3xl border border-slate-200"
                priority
                sizes="(max-width:1024px) 100vw, 50vw"
              />
              {gallery.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {gallery.slice(1, 5).map((img, i) => (
                    <SmartImage
                      key={i}
                      src={img}
                      alt={`${product.name} view ${i + 2}`}
                      ratio="aspect-square"
                      className="rounded-xl border border-slate-200"
                      sizes="120px"
                    />
                  ))}
                </div>
              )}
            </div>
          </Reveal>

          {/* Details */}
          <div>
            {product.brand && <p className="text-sm font-semibold uppercase tracking-wider text-sun-600">{product.brand}</p>}
            <h2 className="mt-2 font-display text-2xl font-bold text-deep-900">{product.name}</h2>
            <p className="mt-3 text-base leading-relaxed text-muted">{product.description}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-xl bg-deep-900 px-5 py-3 font-display text-xl font-bold text-white">
                {product.showPrice && product.priceNaira ? formatNaira(product.priceNaira) : "Contact for price"}
              </span>
              {product.inStock ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-energy-500/10 px-3.5 py-1.5 text-sm font-semibold text-energy-700">
                  <PackageCheck className="h-4 w-4" aria-hidden /> In stock
                </span>
              ) : (
                <span className="rounded-full bg-slate-100 px-3.5 py-1.5 text-sm font-semibold text-slate-600">
                  Availability on request
                </span>
              )}
            </div>

            {product.warranty && (
              <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-deep-900">
                <ShieldCheck className="h-4.5 w-4.5 text-energy-500" aria-hidden />
                {product.warranty}
              </p>
            )}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/contact" size="lg" className="flex-1">
                <FileText className="h-4 w-4" aria-hidden /> Request Quote
              </ButtonLink>
              <ButtonLink
                href={whatsappLink(waMessage)}
                variant="whatsapp"
                size="lg"
                className="flex-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp this product
              </ButtonLink>
            </div>

            {product.features && product.features.length > 0 && (
              <div className="mt-10">
                <h3 className="font-display text-lg font-bold text-deep-900">Key features</h3>
                <ul className="mt-4 space-y-2.5">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-muted">
                      <Check className="mt-0.5 h-4.5 w-4.5 shrink-0 text-sun-500" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="mt-10">
                <h3 className="font-display text-lg font-bold text-deep-900">Specifications</h3>
                <dl className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                  {Object.entries(product.specs).map(([k, v], i) => (
                    <div
                      key={k}
                      className={`grid grid-cols-2 gap-4 px-5 py-3 text-sm ${i % 2 ? "bg-surface" : "bg-white"}`}
                    >
                      <dt className="font-medium text-muted">{k}</dt>
                      <dd className="font-semibold text-deep-900">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-pad bg-surface">
          <div className="container-page">
            <SectionHeading align="left" eyebrow="You may also need" title="Related products" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <a key={p.id} href={`/products/${p.slug}`} className="card card-hover group flex flex-col overflow-hidden">
                  <SmartImage src={p.imageUrl} alt={p.name} ratio="aspect-[4/3]" sizes="25vw" />
                  <div className="p-5">
                    <h3 className="font-display text-base font-bold text-deep-900 group-hover:text-sun-700">{p.name}</h3>
                    <p className="mt-2 text-sm font-semibold text-deep-900">
                      {p.showPrice && p.priceNaira ? formatNaira(p.priceNaira) : "Contact for price"}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
