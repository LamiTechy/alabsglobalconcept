import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { schema } from "@/db";
import { eq } from "drizzle-orm";
import { getCategories } from "@/lib/queries";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata = { title: "Edit Product" };
export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  if (!db) {
    return (
      <div className="max-w-2xl">
        <p className="rounded-xl bg-red-50 p-5 text-sm text-red-700">
          Database is not configured — connect Neon (DATABASE_URL) and seed to edit products.
        </p>
        <Link href="/admin/products" className="mt-4 inline-block text-sm font-semibold text-sun-600">
          ← Back to products
        </Link>
      </div>
    );
  }

  let product;
  try {
    const [row] = await db.select().from(schema.products).where(eq(schema.products.id, params.id)).limit(1);
    product = row;
  } catch {
    product = null;
  }
  if (!product) notFound();

  const categories = await getCategories();

  return (
    <div className="max-w-3xl">
      <Link href="/admin/products" className="text-sm font-semibold text-sun-600 hover:underline">
        ← Back to products
      </Link>
      <h1 className="mt-3 font-display text-2xl font-bold text-deep-900">Edit: {product.name}</h1>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <ProductForm product={product} categories={categories} />
      </div>
    </div>
  );
}
