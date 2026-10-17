export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="Loading">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-sun-400" />
        <p className="text-sm font-medium text-muted">Loading…</p>
      </div>
    </div>
  );
}
