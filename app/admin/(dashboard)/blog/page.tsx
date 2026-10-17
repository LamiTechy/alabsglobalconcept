import { adminListBlogPosts } from "@/lib/queries";
import { deleteBlogAction } from "@/lib/actions/admin";
import { AdminCard } from "@/components/admin/AdminCard";
import { DeleteButton, TogglePublishButton } from "@/components/admin/AdminButtons";
import { BlogForm } from "@/components/admin/ContentForms";
import { togglePublishedAction } from "@/lib/actions/admin";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Blog" };
export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await adminListBlogPosts();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-deep-900">Blog posts</h1>
      <p className="mt-1 text-sm text-muted">SEO-ready articles. Content uses simple Markdown-style formatting.</p>

      <div className="mt-6 grid gap-6 xl:grid-cols-5">
        <AdminCard className="xl:col-span-3">
          <h2 className="mb-4 font-display text-base font-bold text-deep-900">New post</h2>
          <BlogForm />
        </AdminCard>
        <div className="space-y-4 xl:col-span-2">
          {posts.map((p) => (
            <AdminCard key={p.id}>
              <p className="font-semibold text-deep-900">{p.title}</p>
              <p className="text-xs text-muted">
                /{p.slug} · {formatDate(p.publishedAt ?? p.createdAt)}
              </p>
              <div className="mt-3 flex gap-2">
                <TogglePublishButton
                  published={p.published}
                  id={p.id}
                  action={(id, published) => togglePublishedAction("blog_posts", id, published)}
                />
                <DeleteButton action={deleteBlogAction} id={p.id} />
              </div>
            </AdminCard>
          ))}
        </div>
      </div>
    </div>
  );
}
