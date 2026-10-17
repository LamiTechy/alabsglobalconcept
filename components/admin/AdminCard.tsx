import { cn } from "@/lib/utils";

export function AdminCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-2xl border border-slate-200 bg-white p-5 shadow-soft", className)}>
      {children}
    </div>
  );
}
