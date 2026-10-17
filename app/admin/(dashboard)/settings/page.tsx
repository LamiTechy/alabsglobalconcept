import { getSiteSettings } from "@/lib/queries";
import { AdminCard } from "@/components/admin/AdminCard";
import { SettingsForm } from "@/components/admin/ContentForms";

export const metadata = { title: "Site Settings" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-deep-900">Site settings</h1>
      <p className="mt-1 text-sm text-muted">
        Manage the announcement bar, hero copy and home-page stats counters.
      </p>
      <AdminCard className="mt-6">
        <SettingsForm settings={settings} />
      </AdminCard>
    </div>
  );
}
