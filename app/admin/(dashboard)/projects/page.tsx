import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { adminListProjects } from "@/lib/queries";
import { deleteProjectAction } from "@/lib/actions/admin";
import { AdminCard } from "@/components/admin/AdminCard";
import { DeleteButton } from "@/components/admin/AdminButtons";
import { formatDate } from "@/lib/utils";
import { PROJECT_CATEGORIES } from "@/lib/data/services";

export const metadata = { title: "Projects" };
export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await adminListProjects();
  const catLabel = (slug: string) => PROJECT_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-deep-900">Projects</h1>
          <p className="mt-1 text-sm text-muted">{projects.length} project{projects.length === 1 ? "" : "s"}</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-sun-400 px-5 text-sm font-semibold text-deep-900 hover:bg-sun-300"
        >
          <Plus className="h-4 w-4" aria-hidden /> New project
        </Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {projects.map((p) => (
          <AdminCard key={p.id} className="flex gap-4">
            <div className="h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-deep-900 pattern-grid-dark">
              {p.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.coverImage} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-deep-900">{p.title}</p>
              <p className="text-xs text-muted">
                {catLabel(p.category)} · {p.systemSizeKw || "—"} · {p.location || "—"}
              </p>
              <p className="mt-0.5 text-xs text-muted">Completed {formatDate(p.completedAt)}</p>
              <div className="mt-3 flex gap-2">
                <Link
                  href={`/admin/projects/${p.id}/edit`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-deep-900 hover:border-sun-400"
                >
                  <Pencil className="h-3.5 w-3.5" aria-hidden /> Edit
                </Link>
                <DeleteButton action={deleteProjectAction} id={p.id} />
              </div>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
