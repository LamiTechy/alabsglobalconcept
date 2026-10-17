import Link from "next/link";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const metadata = { title: "New Project" };

export default function NewProjectPage() {
  return (
    <div className="max-w-3xl">
      <Link href="/admin/projects" className="text-sm font-semibold text-sun-600 hover:underline">
        ← Back to projects
      </Link>
      <h1 className="mt-3 font-display text-2xl font-bold text-deep-900">New project</h1>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <ProjectForm />
      </div>
    </div>
  );
}
