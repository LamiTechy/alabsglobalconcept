"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

export function DeleteButton({
  action,
  id,
  confirmText = "Delete this item? This cannot be undone.",
}: {
  action: (id: string) => Promise<{ ok: boolean; message: string }>;
  id: string;
  confirmText?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(confirmText)) return;
        startTransition(async () => {
          await action(id);
        });
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
    >
      <Trash2 className="h-3.5 w-3.5" aria-hidden />
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}

export function TogglePublishButton({
  action,
  id,
  published,
}: {
  action: (id: string, published: boolean) => Promise<{ ok: boolean; message: string }>;
  id: string;
  published: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(async () => { await action(id, !published); })}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
        published ? "bg-energy-500/15 text-energy-700 hover:bg-energy-500/25" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {pending ? "…" : published ? "Published" : "Unpublished"}
    </button>
  );
}
