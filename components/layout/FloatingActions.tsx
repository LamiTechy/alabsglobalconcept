"use client";

import { Bot, Phone } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function MobileBottomBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
      <a
        href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
        className="flex flex-col items-center gap-0.5 py-2.5 text-[0.68rem] font-semibold text-deep-900"
      >
        <Phone className="h-5 w-5 text-deep-900" aria-hidden />
        Call
      </a>
      <button
        type="button"
        onClick={() => window.dispatchEvent(new CustomEvent("open-ai-chat"))}
        className="flex flex-col items-center gap-0.5 border-x border-slate-200 py-2.5 text-[0.68rem] font-semibold text-energy-600"
      >
        <Bot className="h-5 w-5" aria-hidden />
        AI Chat
      </button>
      <Link
        href="/contact"
        className="flex flex-col items-center gap-0.5 py-2.5 text-[0.68rem] font-semibold text-sun-600"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <path d="m9 14 2 2 4-4" />
        </svg>
        Get Quote
      </Link>
    </div>
  );
}
