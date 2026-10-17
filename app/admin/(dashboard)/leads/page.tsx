import { adminListLeads } from "@/lib/queries";
import { AdminCard } from "@/components/admin/AdminCard";
import { LeadStatusSelect, CsvExportButton } from "@/components/admin/LeadControls";
import { statusLabels, propertyLabels } from "@/lib/schema-helpers";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const metadata = { title: "Leads / Quotes" };
export const dynamic = "force-dynamic";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: { status?: string; q?: string };
}) {
  const status = searchParams.status || "all";
  const q = searchParams.q || "";
  const leads = await adminListLeads({ status, search: q || undefined });

  const exportRows = leads.map((l) => ({
    id: l.id,
    name: l.name,
    phone: l.phone,
    email: l.email,
    state: l.state,
    city: l.city,
    propertyType: l.propertyType,
    serviceNeeded: l.serviceNeeded,
    monthlySpend: l.monthlySpend,
    preferredContact: l.preferredContact,
    status: l.status,
    source: l.source,
    message: l.message,
    createdAt: l.createdAt,
  }));

  const filterCls =
    "h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm focus:border-sun-400 focus:outline-none";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-deep-900">Leads / Quotes</h1>
          <p className="mt-1 text-sm text-muted">{leads.length} lead{leads.length === 1 ? "" : "s"} shown</p>
        </div>
        <CsvExportButton rows={exportRows} />
      </div>

      <form method="get" className="mt-5 flex flex-wrap gap-3">
        <label htmlFor="q" className="sr-only">Search</label>
        <input
          id="q"
          name="q"
          defaultValue={q}
          placeholder="Search name, phone, email…"
          className={`${filterCls} w-64`}
        />
        <label htmlFor="status" className="sr-only">Status</label>
        <select id="status" name="status" defaultValue={status} className={filterCls}>
          <option value="all">All statuses</option>
          {Object.entries(statusLabels).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <button type="submit" className="h-10 rounded-xl bg-deep-900 px-5 text-sm font-semibold text-white">
          Filter
        </button>
      </form>

      <AdminCard className="mt-6 overflow-x-auto !p-0">
        {leads.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted">
            No leads found. Submissions from the quote form and solar calculator will appear here.
          </p>
        ) : (
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-surface text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Spend (₦)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((l) => (
                <tr key={l.id} className="align-top hover:bg-sun-50/40">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-deep-900">{l.name}</p>
                    <p className="text-xs text-muted">{propertyLabels[l.propertyType] ?? l.propertyType}</p>
                  </td>
                  <td className="px-4 py-3">
                    <a href={`tel:${l.phone}`} className="block font-medium text-deep-900 hover:text-sun-600">
                      {l.phone}
                    </a>
                    {l.email && (
                      <a href={`mailto:${l.email}`} className="block text-xs text-muted hover:text-sun-600">
                        {l.email}
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {l.city ? `${l.city}, ` : ""}
                    {l.state}
                  </td>
                  <td className="px-4 py-3 text-muted">{l.serviceNeeded || "—"}</td>
                  <td className="px-4 py-3 text-muted">{l.monthlySpend ? l.monthlySpend.toLocaleString() : "—"}</td>
                  <td className="px-4 py-3">
                    <LeadStatusSelect leadId={l.id} value={l.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">{l.source}</td>
                  <td className="px-4 py-3 text-xs text-muted">{formatDate(l.createdAt)}</td>
                  <td className="px-4 py-3">
                    {l.message ? (
                      <details className="max-w-[220px]">
                        <summary className="cursor-pointer text-xs font-semibold text-sun-600">View</summary>
                        <p className="mt-1 whitespace-pre-wrap text-xs text-muted">{l.message}</p>
                        {l.calculatorPayload != null && (
                          <p className="mt-1 break-all text-[0.65rem] text-muted">
                            Calculator: {JSON.stringify(l.calculatorPayload).slice(0, 200)}…
                          </p>
                        )}
                      </details>
                    ) : l.calculatorPayload != null ? (
                      <details>
                        <summary className="cursor-pointer text-xs font-semibold text-sun-600">Calc data</summary>
                        <pre className="mt-1 max-w-[220px] overflow-auto text-[0.65rem] text-muted">
                          {JSON.stringify(l.calculatorPayload, null, 1).slice(0, 500)}
                        </pre>
                      </details>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminCard>

      <p className="mt-4 text-xs text-muted">
        Pipeline: New → Contacted → Site Survey → Quoted → Won / Lost. Need lead notes? Add them via the API or
        extend the detail view. <Link href="/admin" className="text-sun-600">← Overview</Link>
      </p>
    </div>
  );
}
