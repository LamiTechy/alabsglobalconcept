import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { adminListProducts, getCategories } from "@/lib/queries";
import { deleteProductAction } from "@/lib/actions/admin";
import { AdminCard } from "@/components/admin/AdminCard";
import { DeleteButton } from "@/components/admin/AdminButtons";
import { formatNaira } from "@/lib/utils";

export const metadata = { title: "Products" };
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([adminListProducts(), getCategories()]);
  const catName = new Map(categories.map((c) => [c.id, c.name]));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-deep-900">Products</h1>
          <p className="mt-1 text-sm text-muted">{products.length} product{products.length === 1 ? "" : "s"}</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-sun-400 px-5 text-sm font-semibold text-deep-900 hover:bg-sun-300"
        >
          <Plus className="h-4 w-4" aria-hidden /> New product
        </Link>
      </div>

      <AdminCard className="mt-6 overflow-x-auto !p-0">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-surface text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Capacity</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Flags</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-sun-50/40">
                <td className="px-4 py-3">
                  <p className="font-semibold text-deep-900">{p.name}</p>
                  <p className="text-xs text-muted">/{p.slug}</p>
                </td>
                <td className="px-4 py-3 text-muted">{p.categoryId ? catName.get(p.categoryId) ?? "—" : "—"}</td>
                <td className="px-4 py-3 text-muted">{p.capacity || "—"}</td>
                <td className="px-4 py-3 text-muted">
                  {p.showPrice && p.priceNaira ? formatNaira(p.priceNaira) : "Hidden"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {p.featured && <span className="rounded bg-sun-400/20 px-2 py-0.5 text-[0.7rem] font-bold text-sun-700">Featured</span>}
                    {p.inStock ? (
                      <span className="rounded bg-energy-500/15 px-2 py-0.5 text-[0.7rem] font-bold text-energy-700">In stock</span>
                    ) : (
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[0.7rem] font-bold text-slate-500">Out</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-deep-900 hover:border-sun-400"
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden /> Edit
                    </Link>
                    <DeleteButton action={deleteProductAction} id={p.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminCard>
      <p className="mt-4 text-xs text-muted">Seeded sample products show here even before a database is connected — edits require Neon.</p>
    </div>
  );
}
