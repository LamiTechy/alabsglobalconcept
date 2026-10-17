"use client";

import { MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { siteConfig, whatsappLink, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/site";

export function WhatsAppFloat() {
  return (
    <Link
      href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-24 right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-energy-500 text-white shadow-card-hover transition hover:scale-105 hover:bg-energy-600 md:bottom-6 md:right-6"
    >
      <MessageCircle className="h-6 w-6" aria-hidden />
      <span className="absolute -top-1 -right-1 h-3.5 w-3.5 animate-pulse rounded-full border-2 border-white bg-sun-400" aria-hidden />
    </Link>
  );
}

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
      <Link
        href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-0.5 border-x border-slate-200 py-2.5 text-[0.68rem] font-semibold text-energy-600"
      >
        <MessageCircle className="h-5 w-5" aria-hidden />
        WhatsApp
      </Link>
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
