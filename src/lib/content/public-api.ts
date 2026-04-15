"use server";

import { getBackendUrl } from "@/lib/http/env";
import { parseJsonSafe, type ApiEnvelope } from "@/lib/http/parse";

export type CategoryItem = {
  id: string;
  name: string;
  subjects?: string[];
};

export type BlogListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type BlogListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  thumbnail?: string | null;
  category?: string | null;
  status?: string;
  createdAt: string;
  publishedAt?: string | null;
  author?: { id?: string; name?: string };
  _count?: { comments?: number };
};

export async function fetchPublishedBlogs(params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}) {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 12;
  const search = params?.search?.trim();
  const category = params?.category?.trim();
  const qs = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    status: "PUBLISHED",
  });
  if (search) qs.set("search", search);
  if (category) qs.set("category", category);

  const res = await fetch(`${getBackendUrl()}/api/blog?${qs.toString()}`, { cache: "no-store" });
  const json = await parseJsonSafe<ApiEnvelope<{ data: BlogListItem[]; meta: BlogListMeta }>>(res);
  if (!res.ok) {
    return { data: [] as BlogListItem[], meta: { page: 1, limit, total: 0, totalPages: 1 } };
  }
  return json?.data ?? { data: [], meta: { page: 1, limit, total: 0, totalPages: 1 } };
}

export type BlogDetail = BlogListItem & {
  fullContent?: string;
  seoTags?: unknown;
  updatedAt?: string;
};

export async function fetchBlogById(blogId: string) {
  const res = await fetch(`${getBackendUrl()}/api/blog/${encodeURIComponent(blogId)}`, {
    cache: "no-store",
  });
  const json = await parseJsonSafe<ApiEnvelope<BlogDetail>>(res);
  if (!res.ok) return null;
  const blog = json?.data;
  if (!blog || typeof blog !== "object") return null;
  if (blog.status && blog.status !== "PUBLISHED") return null;
  return blog;
}

export async function fetchCategories(): Promise<CategoryItem[]> {
  const res = await fetch(`${getBackendUrl()}/api/shared/categories`, { cache: "no-store" });
  const json = await parseJsonSafe<ApiEnvelope<CategoryItem[]>>(res);
  if (!res.ok) return [];
  const raw = json?.data;
  return Array.isArray(raw) ? raw : [];
}

