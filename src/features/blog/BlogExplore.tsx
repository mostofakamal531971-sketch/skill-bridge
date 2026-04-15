"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { BlogListItem, BlogListMeta, CategoryItem } from "@/lib/content/public-api";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, Clock, Search, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

function formatPostDate(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function buildBlogListHref(params: {
  page: number;
  q: string;
  category: string;
}) {
  const qs = new URLSearchParams();
  if (params.page > 1) qs.set("page", String(params.page));
  if (params.q.trim()) qs.set("q", params.q.trim());
  if (params.category.trim()) qs.set("category", params.category.trim());
  const s = qs.toString();
  return s ? `/blog?${s}` : "/blog";
}

type Props = {
  posts: BlogListItem[];
  meta: BlogListMeta;
  categories: CategoryItem[];
};

export default function BlogExplore({ posts, meta, categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const initialCategory = searchParams.get("category") ?? "";
  const [q, setQ] = useState(initialQ);

  const categoryNames = useMemo(() => categories.map((c) => c.name).filter(Boolean), [categories]);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    router.push(
      buildBlogListHref({
        page: 1,
        q,
        category: initialCategory,
      })
    );
  };

  const setCategory = (name: string) => {
    router.push(
      buildBlogListHref({
        page: 1,
        q,
        category: name === initialCategory ? "" : name,
      })
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="pt-32 pb-16 px-6">
        <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center">
          <Badge className="mb-6 bg-blue-500/10 text-blue-600 border-none font-bold px-4 py-1.5 rounded-full">
            <BookOpen className="w-3 h-3 mr-1" /> Learnzilla Blog
          </Badge>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">
            Insights & <span className="text-indigo-600">Resources</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium leading-relaxed mb-10">
            Tips, research, and stories loaded from our API — search and browse by category.
          </p>
          <form onSubmit={onSearch} className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <Input
              name="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search articles..."
              className="pl-12 h-14 rounded-2xl"
            />
          </form>
          {categoryNames.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
              <Button
                type="button"
                variant={!initialCategory ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() =>
                  router.push(
                    buildBlogListHref({
                      page: 1,
                      q,
                      category: "",
                    })
                  )
                }
              >
                All topics
              </Button>
              {categoryNames.map((name) => (
                <Button
                  key={name}
                  type="button"
                  variant={initialCategory === name ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setCategory(name)}
                >
                  {name}
                </Button>
              ))}
            </div>
          )}
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-6">
        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground font-medium py-16">
            No published posts match your filters yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => {
              const authorName =
                post.author && typeof post.author === "object" && "name" in post.author
                  ? String((post.author as { name?: string }).name ?? "")
                  : "";
              const thumb = post.thumbnail?.trim();
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link href={`/blog/${post.id}`} className="block h-full">
                    <Card className="group border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[28px] overflow-hidden h-full bg-card">
                      <div className="aspect-[16/10] overflow-hidden bg-muted relative">
                        {thumb ? (
                          <Image
                            src={thumb}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, 33vw"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-medium">
                            No cover
                          </div>
                        )}
                      </div>
                      <CardContent className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {post.category ? (
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-500/10 px-3 py-1 rounded-full">
                              {post.category}
                            </span>
                          ) : null}
                        </div>
                        <h3 className="text-lg font-black mb-2 group-hover:text-indigo-600 transition-colors leading-tight">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-4 flex-1 line-clamp-3">
                          {post.excerpt ?? ""}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0">
                            <User size={12} className="shrink-0" />
                            <span className="font-bold truncate">{authorName || "Editorial"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                            <Clock size={12} />
                            <span>{formatPostDate(post.publishedAt ?? post.createdAt)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {meta.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-14">
            <Button variant="outline" size="sm" asChild disabled={meta.page <= 1}>
              <Link
                href={buildBlogListHref({
                  page: Math.max(1, meta.page - 1),
                  q: initialQ,
                  category: initialCategory,
                })}
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Previous
              </Link>
            </Button>
            <span className="text-sm text-muted-foreground font-medium">
              Page {meta.page} of {meta.totalPages}
            </span>
            <Button variant="outline" size="sm" asChild disabled={meta.page >= meta.totalPages}>
              <Link
                href={buildBlogListHref({
                  page: Math.min(meta.totalPages, meta.page + 1),
                  q: initialQ,
                  category: initialCategory,
                })}
              >
                Next <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

