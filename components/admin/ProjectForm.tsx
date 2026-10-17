"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { Loader2 } from "lucide-react";
import { upsertProjectAction, type AdminActionResult } from "@/lib/actions/admin";
import { PROJECT_CATEGORIES } from "@/lib/data/services";
import { slugify } from "@/lib/utils";

const inputCls =
  "h-11 w-full rounded-xl border border-slate-300 px-3 text-sm focus:border-sun-400 focus:outline-none focus:ring-2 focus:ring-sun-400/20";
const labelCls = "mb-1 block text-xs font-bold uppercase tracking-wider text-muted";

export function ProjectForm({
  project,
}: {
  project?: {
    id: string;
    title: string;
    slug: string;
    category: string;
    location: string | null;
    systemSizeKw: string | null;
    equipment: string[] | null;
    challenge: string | null;
    solution: string | null;
    summary: string | null;
    coverImage: string | null;
    testimonial: string | null;
    testimonialAuthor: string | null;
    featured: boolean;
  };
}) {
  const [state, formAction, pending] = useFormState(upsertProjectAction as never, null as AdminActionResult | null);
  const [slug, setSlug] = useState(project?.slug ?? "");

  return (
    <form action={formAction} className="space-y-4">
      {project && <input type="hidden" name="id" value={project.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="pr-title">Title *</label>
          <input
            id="pr-title"
            name="title"
            required
            defaultValue={project?.title}
            onChange={(e) => !project && setSlug(slugify(e.target.value))}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="pr-slug">Slug * (auto-generated)</label>
          <input
            id="pr-slug"
            name="slug"
            required
            readOnly
            value={slug}
            onChange={() => {}}
            className={`${inputCls} cursor-not-allowed bg-slate-50 text-slate-500`}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelCls} htmlFor="pr-cat">Category</label>
          <select id="pr-cat" name="category" defaultValue={project?.category ?? "residential"} className={inputCls}>
            {PROJECT_CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls} htmlFor="pr-loc">Location</label>
          <input id="pr-loc" name="location" defaultValue={project?.location ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="pr-size">System size</label>
          <input id="pr-size" name="systemSizeKw" defaultValue={project?.systemSizeKw ?? ""} placeholder="5kW" className={inputCls} />
        </div>
      </div>
      <div>
        <label className={labelCls} htmlFor="pr-summary">Summary</label>
        <textarea id="pr-summary" name="summary" rows={2} defaultValue={project?.summary ?? ""} className={`${inputCls} h-auto py-2`} />
      </div>
      <div>
        <label className={labelCls} htmlFor="pr-challenge">Challenge</label>
        <textarea id="pr-challenge" name="challenge" rows={3} defaultValue={project?.challenge ?? ""} className={`${inputCls} h-auto py-2`} />
      </div>
      <div>
        <label className={labelCls} htmlFor="pr-solution">Solution</label>
        <textarea id="pr-solution" name="solution" rows={3} defaultValue={project?.solution ?? ""} className={`${inputCls} h-auto py-2`} />
      </div>
      <div>
        <label className={labelCls} htmlFor="pr-equipment">Equipment used (one per line)</label>
        <textarea id="pr-equipment" name="equipment" rows={4} defaultValue={project?.equipment?.join("\n") ?? ""} className={`${inputCls} h-auto py-2`} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="pr-cover">Cover image URL</label>
          <input id="pr-cover" name="coverImage" defaultValue={project?.coverImage ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="pr-tauthor">Testimonial author</label>
          <input id="pr-tauthor" name="testimonialAuthor" defaultValue={project?.testimonialAuthor ?? ""} className={inputCls} />
        </div>
      </div>
      <div>
        <label className={labelCls} htmlFor="pr-testimonial">Client testimonial</label>
        <textarea id="pr-testimonial" name="testimonial" rows={2} defaultValue={project?.testimonial ?? ""} className={`${inputCls} h-auto py-2`} />
      </div>
      <label className="inline-flex items-center gap-2 text-sm font-medium text-deep-900">
        <input type="checkbox" name="featured" defaultChecked={project?.featured} className="h-4 w-4 rounded border-slate-300 text-sun-500 focus:ring-sun-400" />
        Featured on home page
      </label>
      {state && <p className={`text-sm ${state.ok ? "text-energy-700" : "text-red-600"}`}>{state.message}</p>}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 items-center gap-2 rounded-xl bg-sun-400 px-6 text-sm font-semibold text-deep-900 hover:bg-sun-300 disabled:opacity-60"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        {project ? "Update project" : "Create project"}
      </button>
    </form>
  );
}
