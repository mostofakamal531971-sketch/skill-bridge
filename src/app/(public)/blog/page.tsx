import BlogExplore from "@/features/blog/BlogExplore";
import { fetchCategories, fetchPublishedBlogs } from "@/lib/content/public-api";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BlogPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const q = typeof sp.q === "string" ? sp.q : "";
  const category = typeof sp.category === "string" ? sp.category : "";

  const [result, categories] = await Promise.all([
    fetchPublishedBlogs({
      page,
      limit: 9,
      search: q.trim() || undefined,
      category: category.trim() || undefined,
    }),
    fetchCategories(),
  ]);

  return (
    <Suspense fallback={<div className="min-h-[40vh] bg-background" aria-hidden />}>
      <BlogExplore
        key={`${page}-${q}-${category}`}
        posts={result.data}
        meta={result.meta}
        categories={categories}
      />
    </Suspense>
  );
}

