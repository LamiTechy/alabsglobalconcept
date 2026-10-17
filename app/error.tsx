"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center">
      <p className="font-display text-5xl font-bold text-sun-500">Oops</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-deep-900">
        Something went wrong on our end
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        Don&apos;t worry — try again, or reach us on WhatsApp if the problem persists.
      </p>
      <div className="mt-8 flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Go home
        </Button>
      </div>
    </section>
  );
}
