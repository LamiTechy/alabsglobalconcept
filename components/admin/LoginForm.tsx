"use client";

import { useFormState } from "react-dom";
import { Loader2, Lock } from "lucide-react";
import { adminLoginAction, type AdminActionResult } from "@/lib/actions/admin";
import { Logo } from "@/components/layout/Logo";

const initialState: AdminActionResult | null = null;

export function LoginForm() {
  const [state, formAction, pending] = useFormState(adminLoginAction as never, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-deep-900">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm focus:border-sun-400 focus:outline-none focus:ring-2 focus:ring-sun-400/30"
          placeholder="admin@alabsglobalconcept.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-deep-900">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          minLength={8}
          className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm focus:border-sun-400 focus:outline-none focus:ring-2 focus:ring-sun-400/30"
          placeholder="••••••••"
        />
      </div>

      {state && !state.ok && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-sun-400 text-sm font-semibold text-deep-900 transition hover:bg-sun-300 disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Lock className="h-4 w-4" aria-hidden />}
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-center text-xs text-muted">
        First time? Seed an admin with <code className="rounded bg-surface px-1.5 py-0.5">npm run db:seed</code>
      </p>
    </form>
  );
}

export function LoginFormWithLogo() {
  return (
    <>
      <div className="mb-8 flex justify-center">
        <Logo />
      </div>
      <LoginForm />
    </>
  );
}
