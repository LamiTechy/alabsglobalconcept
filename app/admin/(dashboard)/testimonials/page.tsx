import { adminListTestimonials } from "@/lib/queries";
import { deleteTestimonialAction } from "@/lib/actions/admin";
import { AdminCard } from "@/components/admin/AdminCard";
import { DeleteButton } from "@/components/admin/AdminButtons";
import { TestimonialForm } from "@/components/admin/ContentForms";

export const metadata = { title: "Testimonials" };
export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const items = await adminListTestimonials();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-deep-900">Testimonials</h1>
      <p className="mt-1 text-sm text-muted">Manage the client quotes shown on the home page.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <AdminCard>
          <h2 className="mb-4 font-display text-base font-bold text-deep-900">Add testimonial</h2>
          <TestimonialForm />
        </AdminCard>
        <div className="space-y-4">
          {items.map((t) => (
            <AdminCard key={t.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-deep-900">{t.name}</p>
                  <p className="text-xs text-muted">
                    {t.location} · {t.systemSize} · {t.rating}★ {t.published ? "· live" : "· hidden"}
                  </p>
                </div>
                <DeleteButton action={deleteTestimonialAction} id={t.id} />
              </div>
              <p className="mt-2 text-sm text-muted">“{t.quote}”</p>
            </AdminCard>
          ))}
        </div>
      </div>
    </div>
  );
}
