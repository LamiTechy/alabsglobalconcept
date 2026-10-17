"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { Loader2 } from "lucide-react";
import { upsertProductAction, type AdminActionResult } from "@/lib/actions/admin";
import { slugify } from "@/lib/utils";

const inputCls =
  "h-11 w-full rounded-xl border border-slate-300 px-3 text-sm focus:border-sun-400 focus:outline-none focus:ring-2 focus:ring-sun-400/20";
const labelCls = "mb-1 block text-xs font-bold uppercase tracking-wider text-muted";

const initialState: AdminActionResult | null = null;

export function ProductForm({
  product,
  categories,
}: {
  product?: {
    id: string;
    name: string;
    slug: string;
    categoryId: string | null;
    brand: string | null;
    capacity: string | null;
    shortDescription: string | null;
    description: string | null;
    features: string[] | null;
    specs: Record<string, string> | null;
    warranty: string | null;
    priceNaira: number | null;
    showPrice: boolean;
    imageUrl: string | null;
    featured: boolean;
    inStock: boolean;
  };
  categories: Array<{ id: string; name: string }>;
}) {
  const [state, formAction, pending] = useFormState(upsertProductAction as never, initialState);
  const [slug, setSlug] = useState(product?.slug ?? "");

  return (
    <form action={formAction} className="space-y-4">
      {product && <input type="hidden" name="id" value={product.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="p-name">Name *</label>
          <input
            id="p-name"
            name="name"
            required
            defaultValue={product?.name}
            onChange={(e) => !product && setSlug(slugify(e.target.value))}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="p-slug">Slug * (auto-generated, url-friendly)</label>
          <input
            id="p-slug"
            name="slug"
            required
            readOnly
            value={slug}
            onChange={() => {}}
            className={`${inputCls} cursor-not-allowed bg-slate-50 text-slate-500`}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelCls} htmlFor="p-cat">Category</label>
          <select id="p-cat" name="categoryId" defaultValue={product?.categoryId ?? ""} className={inputCls}>
            <option value="">— none —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls} htmlFor="p-brand">Brand</label>
          <input id="p-brand" name="brand" defaultValue={product?.brand ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="p-capacity">Capacity</label>
          <input id="p-capacity" name="capacity" defaultValue={product?.capacity ?? ""} placeholder="5kVA / 48V" className={inputCls} />
        </div>
      </div>
      <div>
        <label className={labelCls} htmlFor="p-short">Short description</label>
        <textarea id="p-short" name="shortDescription" rows={2} defaultValue={product?.shortDescription ?? ""} className={`${inputCls} h-auto py-2`} />
      </div>
      <div>
        <label className={labelCls} htmlFor="p-desc">Full description</label>
        <textarea id="p-desc" name="description" rows={4} defaultValue={product?.description ?? ""} className={`${inputCls} h-auto py-2`} />
      </div>
      <div>
        <label className={labelCls} htmlFor="p-features">Features (one per line)</label>
        <textarea id="p-features" name="features" rows={4} defaultValue={product?.features?.join("\n") ?? ""} className={`${inputCls} h-auto py-2`} />
      </div>
      <div>
        <label className={labelCls} htmlFor="p-specs">Specs (valid JSON object)</label>
        <textarea
          id="p-specs"
          name="specs"
          rows={5}
          defaultValue={product?.specs ? JSON.stringify(product.specs, null, 2) : "{}"}
          className={`${inputCls} h-auto py-2 font-mono text-xs`}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelCls} htmlFor="p-warranty">Warranty</label>
          <input id="p-warranty" name="warranty" defaultValue={product?.warranty ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="p-price">Price (₦, optional)</label>
          <input id="p-price" name="priceNaira" type="number" min={0} defaultValue={product?.priceNaira ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="p-image">Image URL</label>
          <input id="p-image" name="imageUrl" defaultValue={product?.imageUrl ?? ""} placeholder="/images/products/…" className={inputCls} />
        </div>
      </div>
      <div className="flex flex-wrap gap-6">
        {[
          { name: "showPrice", label: "Show price publicly", defaultChecked: product?.showPrice },
          { name: "featured", label: "Featured on home page", defaultChecked: product?.featured },
          { name: "inStock", label: "In stock", defaultChecked: product ? product.inStock : true },
        ].map((c) => (
          <label key={c.name} className="inline-flex items-center gap-2 text-sm font-medium text-deep-900">
            <input
              type="checkbox"
              name={c.name}
              defaultChecked={c.defaultChecked}
              className="h-4 w-4 rounded border-slate-300 text-sun-500 focus:ring-sun-400"
            />
            {c.label}
          </label>
        ))}
      </div>

      {state && <p className={`text-sm ${state.ok ? "text-energy-700" : "text-red-600"}`}>{state.message}</p>}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 items-center gap-2 rounded-xl bg-sun-400 px-6 text-sm font-semibold text-deep-900 transition hover:bg-sun-300 disabled:opacity-60"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        {product ? "Update product" : "Create product"}
      </button>
    </form>
  );
}
