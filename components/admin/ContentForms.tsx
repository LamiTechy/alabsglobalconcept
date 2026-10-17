"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { Loader2 } from "lucide-react";
import {
  upsertTestimonialAction,
  upsertFaqAction,
  upsertBlogAction,
  saveSettingsAction,
  type AdminActionResult,
} from "@/lib/actions/admin";
import { slugify } from "@/lib/utils";

const inputCls =
  "h-11 w-full rounded-xl border border-slate-300 px-3 text-sm focus:border-sun-400 focus:outline-none focus:ring-2 focus:ring-sun-400/20";
const labelCls = "mb-1 block text-xs font-bold uppercase tracking-wider text-muted";
const btnCls =
  "inline-flex h-12 items-center gap-2 rounded-xl bg-sun-400 px-6 text-sm font-semibold text-deep-900 hover:bg-sun-300 disabled:opacity-60";

function Feedback({ state }: { state: AdminActionResult | null }) {
  if (!state) return null;
  return <p className={`text-sm ${state.ok ? "text-energy-700" : "text-red-600"}`}>{state.message}</p>;
}

export function TestimonialForm({
  item,
}: {
  item?: { id: string; name: string; location: string | null; systemSize: string | null; quote: string; rating: number; published: boolean; order: number };
}) {
  const [state, formAction, pending] = useFormState(upsertTestimonialAction as never, null as AdminActionResult | null);
  return (
    <form action={formAction} className="space-y-3">
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor={`t-name-${item?.id ?? "new"}`}>Name *</label>
          <input id={`t-name-${item?.id ?? "new"}`} name="name" required defaultValue={item?.name} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor={`t-loc-${item?.id ?? "new"}`}>Location</label>
          <input id={`t-loc-${item?.id ?? "new"}`} name="location" defaultValue={item?.location ?? ""} className={inputCls} />
        </div>
      </div>
      <div>
        <label className={labelCls} htmlFor={`t-quote-${item?.id ?? "new"}`}>Quote *</label>
        <textarea id={`t-quote-${item?.id ?? "new"}`} name="quote" required rows={3} defaultValue={item?.quote} className={`${inputCls} h-auto py-2`} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className={labelCls} htmlFor={`t-size-${item?.id ?? "new"}`}>System size</label>
          <input id={`t-size-${item?.id ?? "new"}`} name="systemSize" defaultValue={item?.systemSize ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor={`t-rating-${item?.id ?? "new"}`}>Rating (1–5)</label>
          <input id={`t-rating-${item?.id ?? "new"}`} name="rating" type="number" min={1} max={5} defaultValue={item?.rating ?? 5} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor={`t-order-${item?.id ?? "new"}`}>Order</label>
          <input id={`t-order-${item?.id ?? "new"}`} name="order" type="number" defaultValue={item?.order ?? 0} className={inputCls} />
        </div>
      </div>
      <label className="inline-flex items-center gap-2 text-sm font-medium text-deep-900">
        <input type="checkbox" name="published" defaultChecked={item ? item.published : true} className="h-4 w-4 rounded border-slate-300 text-sun-500 focus:ring-sun-400" />
        Published
      </label>
      <Feedback state={state} />
      <button type="submit" disabled={pending} className={btnCls}>
        {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />} {item ? "Update" : "Create"}
      </button>
    </form>
  );
}

export function FaqForm({ item }: { item?: { id: string; question: string; answer: string; category: string | null } }) {
  const [state, formAction, pending] = useFormState(upsertFaqAction as never, null as AdminActionResult | null);
  return (
    <form action={formAction} className="space-y-3">
      {item && <input type="hidden" name="id" value={item.id} />}
      <div>
        <label className={labelCls} htmlFor={`f-q-${item?.id ?? "new"}`}>Question *</label>
        <input id={`f-q-${item?.id ?? "new"}`} name="question" required defaultValue={item?.question} className={inputCls} />
      </div>
      <div>
        <label className={labelCls} htmlFor={`f-a-${item?.id ?? "new"}`}>Answer *</label>
        <textarea id={`f-a-${item?.id ?? "new"}`} name="answer" required rows={3} defaultValue={item?.answer} className={`${inputCls} h-auto py-2`} />
      </div>
      <div>
        <label className={labelCls} htmlFor={`f-cat-${item?.id ?? "new"}`}>Category</label>
        <input id={`f-cat-${item?.id ?? "new"}`} name="category" defaultValue={item?.category ?? "general"} className={inputCls} />
      </div>
      <Feedback state={state} />
      <button type="submit" disabled={pending} className={btnCls}>
        {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />} {item ? "Update" : "Create"}
      </button>
    </form>
  );
}

export function BlogForm({
  post,
}: {
  post?: { id: string; title: string; slug: string; excerpt: string | null; content: string; coverImage: string | null; author: string | null; tags: string[] | null; published: boolean };
}) {
  const [state, formAction, pending] = useFormState(upsertBlogAction as never, null as AdminActionResult | null);
  const [slug, setSlug] = useState(post?.slug ?? "");
  return (
    <form action={formAction} className="space-y-3">
      {post && <input type="hidden" name="id" value={post.id} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor={`b-title-${post?.id ?? "new"}`}>Title *</label>
          <input
            id={`b-title-${post?.id ?? "new"}`}
            name="title"
            required
            defaultValue={post?.title}
            onChange={(e) => !post && setSlug(slugify(e.target.value))}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor={`b-slug-${post?.id ?? "new"}`}>Slug * (auto-generated)</label>
          <input
            id={`b-slug-${post?.id ?? "new"}`}
            name="slug"
            required
            readOnly
            value={slug}
            onChange={() => {}}
            className={`${inputCls} cursor-not-allowed bg-slate-50 text-slate-500`}
          />
        </div>
      </div>
      <div>
        <label className={labelCls} htmlFor={`b-excerpt-${post?.id ?? "new"}`}>Excerpt</label>
        <textarea id={`b-excerpt-${post?.id ?? "new"}`} name="excerpt" rows={2} defaultValue={post?.excerpt ?? ""} className={`${inputCls} h-auto py-2`} />
      </div>
      <div>
        <label className={labelCls} htmlFor={`b-content-${post?.id ?? "new"}`}>Content (Markdown-style) *</label>
        <textarea id={`b-content-${post?.id ?? "new"}`} name="content" required rows={14} defaultValue={post?.content} className={`${inputCls} h-auto py-2 font-mono text-xs`} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className={labelCls} htmlFor={`b-author-${post?.id ?? "new"}`}>Author</label>
          <input id={`b-author-${post?.id ?? "new"}`} name="author" defaultValue={post?.author ?? "Alabsglobalconcept"} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor={`b-cover-${post?.id ?? "new"}`}>Cover image URL</label>
          <input id={`b-cover-${post?.id ?? "new"}`} name="coverImage" defaultValue={post?.coverImage ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor={`b-tags-${post?.id ?? "new"}`}>Tags (comma-separated)</label>
          <input id={`b-tags-${post?.id ?? "new"}`} name="tags" defaultValue={post?.tags?.join(", ") ?? ""} className={inputCls} />
        </div>
      </div>
      <label className="inline-flex items-center gap-2 text-sm font-medium text-deep-900">
        <input type="checkbox" name="published" defaultChecked={post ? post.published : true} className="h-4 w-4 rounded border-slate-300 text-sun-500 focus:ring-sun-400" />
        Published
      </label>
      <Feedback state={state} />
      <button type="submit" disabled={pending} className={btnCls}>
        {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />} {post ? "Update" : "Create"}
      </button>
    </form>
  );
}

export function SettingsForm({
  settings,
}: {
  settings: {
    announcementText: string | null;
    announcementLink: string | null;
    announcementEnabled: boolean;
    heroHeadline: string | null;
    heroSubheadline: string | null;
    statProjects: number | null;
    statClients: number | null;
    statKwInstalled: number | null;
    statYears: number | null;
  };
}) {
  const [state, formAction, pending] = useFormState(saveSettingsAction as never, null as AdminActionResult | null);
  return (
    <form action={formAction} className="space-y-4">
      <fieldset className="space-y-3 rounded-xl border border-slate-200 p-4">
        <legend className="px-2 text-xs font-bold uppercase tracking-wider text-sun-600">Announcement bar</legend>
        <div>
          <label className={labelCls} htmlFor="s-ann-text">Text</label>
          <input id="s-ann-text" name="announcementText" defaultValue={settings.announcementText ?? ""} className={inputCls} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="s-ann-link">Link</label>
            <input id="s-ann-link" name="announcementLink" defaultValue={settings.announcementLink ?? ""} className={inputCls} />
          </div>
          <label className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-deep-900">
            <input type="checkbox" name="announcementEnabled" defaultChecked={settings.announcementEnabled} className="h-4 w-4 rounded border-slate-300 text-sun-500 focus:ring-sun-400" />
            Enabled
          </label>
        </div>
      </fieldset>

      <fieldset className="space-y-3 rounded-xl border border-slate-200 p-4">
        <legend className="px-2 text-xs font-bold uppercase tracking-wider text-sun-600">Hero</legend>
        <div>
          <label className={labelCls} htmlFor="s-headline">Headline</label>
          <input id="s-headline" name="heroHeadline" defaultValue={settings.heroHeadline ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="s-sub">Subheadline</label>
          <textarea id="s-sub" name="heroSubheadline" rows={2} defaultValue={settings.heroSubheadline ?? ""} className={`${inputCls} h-auto py-2`} />
        </div>
      </fieldset>

      <fieldset className="space-y-3 rounded-xl border border-slate-200 p-4">
        <legend className="px-2 text-xs font-bold uppercase tracking-wider text-sun-600">Stats counters</legend>
        <div className="grid gap-3 sm:grid-cols-4">
          {([
            ["statProjects", "Projects"],
            ["statClients", "Clients"],
            ["statKwInstalled", "kW installed"],
            ["statYears", "Years"],
          ] as const).map(([name, label]) => (
            <div key={name}>
              <label className={labelCls} htmlFor={`s-${name}`}>{label}</label>
              <input id={`s-${name}`} name={name} type="number" defaultValue={settings[name] ?? ""} className={inputCls} />
            </div>
          ))}
        </div>
      </fieldset>

      <Feedback state={state} />
      <button type="submit" disabled={pending} className={btnCls}>
        {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />} Save settings
      </button>
      <p className="text-xs text-muted">
        Contact details & social links are currently driven by environment variables (see .env.example) — wire them
        to settings fields when you&apos;re ready to manage them here.
      </p>
    </form>
  );
}
