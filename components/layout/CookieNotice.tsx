"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/Button";

const KEY = "agc_cookie_consent";

export function CookieNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      /* private mode */
    }
  }, []);

  if (!show) return null;

  const accept = () => {
    try {
      localStorage.setItem(KEY, "accepted");
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-card-hover md:bottom-6 md:left-6 md:right-auto md:mx-0">
      <div className="flex gap-3">
        <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-sun-500" aria-hidden />
        <div>
          <p className="text-sm font-semibold text-deep-900">We use cookies</p>
          <p className="mt-1 text-sm text-muted">
            We use essential cookies to run this site and optional analytics to improve it. See our{" "}
            <Link href="/privacy" className="font-medium text-sun-600 underline underline-offset-2">
              privacy policy
            </Link>
            .
          </p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={accept}>
              Accept
            </Button>
            <Button size="sm" variant="outline" onClick={accept}>
              Essential only
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
