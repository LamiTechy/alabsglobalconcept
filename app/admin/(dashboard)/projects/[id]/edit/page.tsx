import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { schema } from "@/db";
import { eq } from "drizzle-orm";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const metadata = { title: "Edit Project" };
export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  if (!db) {
    return (
      <div className="max-w-2xl">
        <p className="rounded-xl bg-red-50 p-5 text-sm text-red-700">
          Database is not configured — connect Neon (DATABASE_URL) and seed to edit projects.
        </p>
        <Link href="/admin/projects" className="mt-4 inline-block text-sm font-semibold text-sun-600">
          ← Back to projects
        </Link>
      </div>
    );
  }
  let project;
  try {
    const [row] = await db.select().from(schema.projects).where(eq(schema.projects.id, params.id)).limit(1);
    project = row;
  } catch {
    project = null;
  }
  if (!project) notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/admin/projects" className="text-sm font-semibold text-sun-600 hover:underline">
        ← Back to projects
      </Link>
      <h1 className="mt-3 font-display text-2xl font-bold text-deep-900">Edit: {project.title}</h1>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <ProjectForm project={project} />
      </div>
    </div>
  );
}
