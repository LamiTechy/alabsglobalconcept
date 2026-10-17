import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Package,
  FolderKanban,
  MessageSquareQuote,
  HelpCircle,
  Newspaper,
  Settings,
  LogOut,
  Sun,
} from "lucide-react";
import { requireAdmin, adminLogoutAction } from "@/lib/actions/admin";

export const metadata = { title: { template: "%s · Admin · Alabsglobalconcept", default: "Admin" }, robots: { index: false } };

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads / Quotes", icon: Users },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  return (
    <div className="flex min-h-[80vh] flex-col bg-surface lg:flex-row">
      <aside className="border-b border-slate-200 bg-deep-950 text-white lg:min-h-[80vh] lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:border-slate-800">
        <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-sun-400">
            <Sun className="h-5 w-5 text-deep-900" aria-hidden />
          </span>
          <div>
            <p className="font-display text-sm font-bold">Admin Console</p>
            <p className="text-xs text-white/50">{session.name}</p>
          </div>
        </div>
        <nav className="flex flex-wrap gap-1 p-3 lg:flex-col" aria-label="Admin">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="inline-flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              <n.icon className="h-4 w-4" aria-hidden />
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3">
          <form action={adminLogoutAction}>
            <button
              type="submit"
              className="inline-flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" aria-hidden /> Sign out
            </button>
          </form>
        </div>
      </aside>
      <div className="flex-1 p-5 md:p-8">{children}</div>
    </div>
  );
}
