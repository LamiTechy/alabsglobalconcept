import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ProductCatalog } from "@/components/products/ProductCatalog";
import { getProducts, getCategories } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Solar Products & Equipment — Panels, Inverters, Batteries, Kits",
  description:
    "Browse genuine solar panels, inverters, lithium & tubular batteries, complete kits, street lights and accessories. Abuja delivery and nationwide shipping.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Solar equipment catalogue"
        description="Panels, inverters, batteries, complete kits, street lights and accessories — genuine products with clear warranties. Prices shown where available; otherwise, request a quote."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
      />
      <section className="section-pad bg-surface">
        <div className="container-page">
          <ProductCatalog products={products} categories={categories} />
        </div>
      </section>
    </>
  );
}
