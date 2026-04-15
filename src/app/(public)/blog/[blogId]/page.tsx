import { fetchBlogById } from "@/lib/content/public-api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function formatPostDate(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

type Props = { params: Promise<{ blogId: string }> };

export default async function BlogArticlePage({ params }: Props) {
  const { blogId } = await params;
  if (!UUID_RE.test(blogId)) notFound();

  const blog = await fetchBlogById(blogId);
  if (!blog) notFound();

  const authorName =
    blog.author && typeof blog.author === "object" && "name" in blog.author
      ? String((blog.author as { name?: string }).name ?? "")
      : "";

  const thumb = blog.thumbnail?.trim();
  const html = blog.fullContent?.trim();

  return (
    <article className="min-h-screen bg-background pb-24">
      <div className="max-w-3xl mx-auto px-6 pt-28">
        <Button variant="ghost" size="sm" className="mb-8 -ml-2" asChild>
          <Link href="/blog">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to blog
          </Link>
        </Button>

        {blog.category ? (
          <Badge className="mb-4 bg-indigo-500/10 text-indigo-600 border-none font-bold px-3 py-1 rounded-full">
            {blog.category}
          </Badge>
        ) : null}

        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">{blog.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-10">
          <span className="inline-flex items-center gap-2 font-medium">
            <User size={16} />
            {authorName || "Editorial"}
          </span>
          <span className="inline-flex items-center gap-2 font-medium">
            <Clock size={16} />
            {formatPostDate(blog.publishedAt ?? blog.createdAt)}
          </span>
        </div>

        {thumb ? (
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-muted mb-10">
            <Image src={thumb} alt={blog.title} fill className="object-cover" sizes="100vw" unoptimized />
          </div>
        ) : null}

        {blog.excerpt ? (
          <p className="text-lg text-muted-foreground font-medium leading-relaxed mb-10">{blog.excerpt}</p>
        ) : null}

        {html ? (
          <div
            className="max-w-none text-foreground leading-relaxed space-y-4 [&_h1]:text-3xl [&_h1]:font-black [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:text-xl [&_h3]:font-bold [&_a]:text-indigo-600 [&_a]:underline [&_p]:text-muted-foreground [&_ul]:list-disc [&_ul]:pl-6"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <p className="text-muted-foreground">No article body available.</p>
        )}
      </div>
    </article>
  );
}
