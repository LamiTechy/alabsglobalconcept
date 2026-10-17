"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { updateLeadStatusAction } from "@/lib/actions/admin";
import { leadStatusEnum, statusLabels } from "@/lib/schema-helpers";

export function LeadStatusSelect({ leadId, value }: { leadId: string; value: string }) {
  const [status, setStatus] = useState(value);
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState("");

  return (
    <div className="flex items-center gap-2">
      <label htmlFor={`status-${leadId}`} className="sr-only">
        Lead status
      </label>
      <select
        id={`status-${leadId}`}
        value={status}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value;
          setStatus(next);
          startTransition(async () => {
            const res = await updateLeadStatusAction({ id: leadId, status: next });
            setMsg(res.ok ? "" : res.message);
          });
        }}
        className="h-9 rounded-lg border border-slate-300 bg-white px-2 text-xs font-semibold focus:border-sun-400 focus:outline-none"
      >
        {leadStatusEnum.map((s) => (
          <option key={s} value={s}>
            {statusLabels[s]}
          </option>
        ))}
      </select>
      {pending && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted" aria-hidden />}
      {msg && <span className="text-xs text-red-600">{msg}</span>}
    </div>
  );
}

export function CsvExportButton({ rows }: { rows: Array<Record<string, unknown>> }) {
  const [exporting, setExporting] = useState(false);

  function exportCsv() {
    setExporting(true);
    try {
      if (!rows.length) return;
      const headers = Object.keys(rows[0]!);
      const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
      const csv = [
        headers.join(","),
        ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
      ].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={exportCsv}
      disabled={exporting || rows.length === 0}
      className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-deep-900 transition hover:border-sun-400 disabled:opacity-50"
    >
      Export CSV ({rows.length})
    </button>
  );
}
