"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { SmartImage } from "@/components/media/SmartImage";
import { formatNaira } from "@/lib/utils";

type Cat = { id: string; name: string; slug: string };
type Prod = {
  id: string;
  name: string;
  slug: string;
  categoryId: string | null;
  brand: string | null;
  capacity: string | null;
  shortDescription: string | null;
  priceNaira: number | null;
  showPrice: boolean;
  imageUrl: string | null;
};

export function ProductCatalog({ products, categories }: { products: Prod[]; categories: Cat[] }) {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("all");

  const brands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand).filter(Boolean) as string[]);
    return Array.from(set).sort();
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (category !== "all" && p.categoryId !== category) return false;
      if (brand !== "all" && p.brand !== brand) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const hay = `${p.name} ${p.shortDescription ?? ""} ${p.capacity ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [products, category, brand, search]);

  const selectCls =
    "h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-deep-900 focus:border-sun-400 focus:outline-none focus:ring-2 focus:ring-sun-400/30";

  return (
    <div>
      <div className="card flex flex-col gap-3 p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <label htmlFor="product-search" className="sr-only">
            Search products
          </label>
          <input
            id="product-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search panels, inverters, batteries…"
            className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm focus:border-sun-400 focus:outline-none focus:ring-2 focus:ring-sun-400/30"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SlidersHorizontal className="hidden h-4 w-4 text-muted md:block" aria-hidden />
          <label htmlFor="filter-category" className="sr-only">Category</label>
          <select
            id="filter-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={selectCls}
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <label htmlFor="filter-brand" className="sr-only">Brand</label>
          <select id="filter-brand" value={brand} onChange={(e) => setBrand(e.target.value)} className={selectCls}>
            <option value="all">All brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted" aria-live="polite">
        {filtered.length} product{filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <p className="font-display text-lg font-bold text-deep-900">No products match your filters</p>
          <p className="mt-2 text-sm text-muted">Try a different category or search term — or contact us for sourcing.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <Link key={p.id} href={`/products/${p.slug}`} className="card card-hover group flex flex-col overflow-hidden">
              <SmartImage src={p.imageUrl} alt={p.name} ratio="aspect-[4/3]" sizes="(max-width:640px) 100vw, 25vw" />
              <div className="flex flex-1 flex-col p-5">
                {p.capacity && (
                  <span className="text-xs font-semibold uppercase tracking-wider text-sun-600">{p.capacity}</span>
                )}
                <h2 className="mt-1.5 font-display text-base font-bold leading-snug text-deep-900 group-hover:text-sun-700">
                  {p.name}
                </h2>
                <p className="mt-2 flex-1 text-sm text-muted line-clamp-2">{p.shortDescription}</p>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-sm font-bold text-deep-900">
                    {p.showPrice && p.priceNaira ? formatNaira(p.priceNaira) : "Contact for price"}
                  </span>
                  <span className="text-xs font-semibold text-sun-600">Details →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
