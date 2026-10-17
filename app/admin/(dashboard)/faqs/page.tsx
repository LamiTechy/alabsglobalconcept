import { adminListFaqs } from "@/lib/queries";
import { deleteFaqAction } from "@/lib/actions/admin";
import { AdminCard } from "@/components/admin/AdminCard";
import { DeleteButton } from "@/components/admin/AdminButtons";
import { FaqForm } from "@/components/admin/ContentForms";

export const metadata = { title: "FAQs" };
export const dynamic = "force-dynamic";

export default async function AdminFaqsPage() {
  const items = await adminListFaqs();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-deep-900">FAQs</h1>
      <p className="mt-1 text-sm text-muted">Shown on the home page and contact page accordions.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <AdminCard>
          <h2 className="mb-4 font-display text-base font-bold text-deep-900">Add FAQ</h2>
          <FaqForm />
        </AdminCard>
        <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
          {items.map((f) => (
            <AdminCard key={f.id}>
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-deep-900">{f.question}</p>
                <DeleteButton action={deleteFaqAction} id={f.id} />
              </div>
              <p className="mt-1.5 line-clamp-3 text-sm text-muted">{f.answer}</p>
              <p className="mt-2 text-xs font-medium text-sun-600">{f.category}</p>
            </AdminCard>
          ))}
        </div>
      </div>
    </div>
  );
}
