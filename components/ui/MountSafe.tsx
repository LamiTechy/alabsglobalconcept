"use client";

import { useEffect, useState } from "react";

/** Client wrapper that lazily loads framer-motion-heavy children after mount if needed.
 *  Reveal itself handles reduced motion; this helper avoids hydration surprises for counters. */
export function MountSafe({ children, className }: { children: React.ReactNode; className?: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className={className} aria-hidden />;
  return <div className={className}>{children}</div>;
}
