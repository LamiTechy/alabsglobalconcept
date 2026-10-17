import { getCategories } from "@/lib/queries";
import { ProductForm } from "@/components/admin/ProductForm";
import Link from "next/link";

export const metadata = { title: "New Product" };

export default async function NewProductPage() {
  const categories = await getCategories();
  return (
    <div className="max-w-3xl">
      <Link href="/admin/products" className="text-sm font-semibold text-sun-600 hover:underline">
        ← Back to products
      </Link>
      <h1 className="mt-3 font-display text-2xl font-bold text-deep-900">New product</h1>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
