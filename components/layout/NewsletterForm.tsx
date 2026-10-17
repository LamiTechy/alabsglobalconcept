"use client";

import { useState } from "react";
import { subscribeNewsletter } from "@/lib/actions/leads";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const res = await subscribeNewsletter(email);
    setState(res.ok ? "done" : "error");
    setMsg(res.message);
    if (res.ok) setEmail("");
  }

  if (state === "done") {
    return <p className="mt-3 rounded-lg bg-energy-500/15 px-3 py-2 text-xs text-energy-300">{msg}</p>;
  }

  return (
    <form onSubmit={onSubmit} className="mt-3 flex gap-2">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="h-10 w-full min-w-0 rounded-lg border border-white/15 bg-white/5 px-3 text-sm text-white placeholder:text-white/40 focus:border-sun-400 focus:outline-none"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="h-10 shrink-0 rounded-lg bg-sun-400 px-4 text-sm font-semibold text-deep-900 transition hover:bg-sun-300 disabled:opacity-60"
      >
        {state === "loading" ? "…" : "Join"}
      </button>
      {state === "error" && <p className="mt-2 text-xs text-red-400">{msg}</p>}
    </form>
  );
}
