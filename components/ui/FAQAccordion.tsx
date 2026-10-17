"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export type FAQItem = { question: string; answer: string };

export function FAQAccordion({ items, dark = false }: { items: FAQItem[]; dark?: boolean }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-soft">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className={cn(
                  "flex w-full items-center justify-between gap-4 px-5 py-5 text-left md:px-6",
                  dark ? "text-white" : "text-deep-900"
                )}
              >
                <span className="font-display text-[0.98rem] font-semibold leading-snug md:text-base">
                  {item.question}
                </span>
                <span
                  className={cn(
                    "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition",
                    isOpen ? "bg-sun-400 text-deep-900" : dark ? "bg-white/10 text-white" : "bg-sun-50 text-sun-600"
                  )}
                >
                  {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </span>
              </button>
            </h3>
            <div
              className={cn(
                "grid transition-all duration-300",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <p
                  className={cn(
                    "px-5 pb-5 text-sm leading-relaxed md:px-6 md:text-[0.95rem]",
                    dark ? "text-white/70" : "text-muted"
                  )}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
