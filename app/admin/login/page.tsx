import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-surface px-5 py-16">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
        <h1 className="mb-2 text-center font-display text-xl font-bold text-deep-900">Admin sign in</h1>
        <p className="mb-6 text-center text-sm text-muted">Authorized staff only.</p>
        <LoginForm />
      </div>
    </div>
  );
}
