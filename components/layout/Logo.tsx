import Link from "next/link";
import { Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

export function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label={`${siteConfig.name} home`}
    >
      <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-sun-400 shadow-glow/50 transition-transform group-hover:rotate-6">
        <Sun className="h-5.5 w-5.5 text-deep-900" strokeWidth={2.2} aria-hidden />
      </span>
      <span className="leading-none">
        <span
          className={cn(
            "block font-display text-[1.05rem] font-bold tracking-tight",
            dark ? "text-white" : "text-deep-900"
          )}
        >
          Alabsglobal<span className="text-sun-500">concept</span>
        </span>
        <span
          className={cn(
            "mt-0.5 block text-[0.68rem] font-medium uppercase tracking-[0.18em]",
            dark ? "text-white/55" : "text-muted"
          )}
        >
          Solar Power · Abuja
        </span>
      </span>
    </Link>
  );
}
