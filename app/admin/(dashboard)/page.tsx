import { adminStats, adminListLeads } from "@/lib/queries";
import { AdminCard } from "@/components/admin/AdminCard";
import { leadStatusEnum } from "@/lib/schema-helpers";

export const metadata = { title: "Overview" };
export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  site_survey: "Site Survey",
  quoted: "Quoted",
  won: "Won",
  lost: "Lost",
};

export default async function AdminOverviewPage() {
  const [stats, recentLeads] = await Promise.all([adminStats(), adminListLeads({ limit: 8 })]);

  const cards = [
    { label: "Leads this week", value: stats.leadsThisWeek },
    { label: "Total leads", value: stats.leadsTotal },
    { label: "Won", value: stats.leadsWon },
    {
      label: "Conversion (won/total)",
      value: stats.leadsTotal ? `${Math.round((stats.leadsWon / stats.leadsTotal) * 100)}%` : "—",
    },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-deep-900">Dashboard overview</h1>
      <p className="mt-1 text-sm text-muted">Pipeline snapshot and recent activity.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <AdminCard key={c.label}>
            <p className="text-xs font-bold uppercase tracking-wider text-muted">{c.label}</p>
            <p className="mt-2 font-display text-3xl font-bold text-deep-900">{c.value}</p>
          </AdminCard>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <AdminCard className="lg:col-span-2">
          <h2 className="font-display text-base font-bold text-deep-900">Leads by status</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {leadStatusEnum.map((s) => (
              <div key={s} className="rounded-xl bg-surface p-4">
                <p className="text-xs font-semibold text-muted">{statusLabels[s]}</p>
                <p className="mt-1 font-display text-2xl font-bold text-deep-900">{stats.byStatus[s] ?? 0}</p>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="font-display text-base font-bold text-deep-900">Recent leads</h2>
          {recentLeads.length === 0 ? (
            <p className="mt-4 text-sm text-muted">
              No leads yet. They&apos;ll appear here as quote forms and calculator submissions come in.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {recentLeads.map((l) => (
                <li key={l.id} className="border-b border-slate-100 pb-3 last:border-0">
                  <p className="text-sm font-semibold text-deep-900">{l.name}</p>
                  <p className="text-xs text-muted">
                    {l.phone} · {l.city || l.state || "—"} ·{" "}
                    <span className="font-medium text-sun-600">{statusLabels[l.status] ?? l.status}</span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
