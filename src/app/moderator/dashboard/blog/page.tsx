"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/lib/mock-data";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Save, X, Sparkles, Loader2 } from "lucide-react";
import { generateAIContent } from "@/services/ai.services";

type PostForm = {
  title: string;
  slug: string;
  excerpt: string;
  fullContent: string;
  category: string;
  status: string;
};

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  fullContent: string;
  date: string;
  category: string;
  status: string;
  authorId: string;
  thumbnail: string | null;
  seoTags: Record<string, unknown> | null;
};

export default function ModeratorBlogPage() {
  const [posts, setPosts] = useState<Post[]>(blogPosts as Post[]);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [form, setForm] = useState<PostForm>({
    title: "",
    slug: "",
    excerpt: "",
    fullContent: "",
    category: "",
    status: "DRAFT",
  });

  const startEdit = (post: Post) => {
    setEditing(post.id);
    setCreating(false);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      fullContent: post.fullContent,
      category: post.category,
      status: post.status,
    });
  };

  const handleGenerateAI = async () => {
    if (!aiTopic.trim()) {
      toast.error("Please enter a topic to generate");
      return;
    }
    setIsGenerating(true);
    try {
      const res = await generateAIContent({
        mode: "blog",
        data: {
          topic: aiTopic,
          target_audience: "Students and Tutors",
          tone: "Professional, educational, and engaging"
        }
      });
      if (res.success && res.data) {
        setForm(f => ({
          ...f,
          title: res.data.title || "",
          slug: res.data.slug || "",
          excerpt: res.data.excerpt || "",
          fullContent: res.data.full_content || ""
        }));
        toast.success("Blog post generated successfully!");
      } else {
        toast.error("Failed to generate blog post");
      }
    } catch (e) {
      toast.error("Network error");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveEdit = () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setPosts((prev) =>
      prev.map((p) => (p.id === editing ? { ...p, ...form } : p))
    );
    setEditing(null);
    toast.success("Post updated");
  };

  const createPost = () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    const newPost: Post = {
      id: `blog-${Date.now()}`,
      ...form,
      slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-"),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      authorId: "mod-1",
      thumbnail: null,
      seoTags: null,
    };
    setPosts((prev) => [newPost, ...prev]);
    setCreating(false);
    setForm({
      title: "",
      slug: "",
      excerpt: "",
      fullContent: "",
      category: "",
      status: "DRAFT",
    });
    toast.success("Post created");
  };

  const deletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Post deleted");
  };

  return (
    <>
      <PageHeader
        title="Blog Management"
        description="Create, edit, and manage blog posts"
        actions={
          <Button
            onClick={() => {
              setCreating(true);
              setEditing(null);
              setForm({
                title: "",
                slug: "",
                excerpt: "",
                fullContent: "",
                category: "",
                status: "DRAFT",
              });
            }}
            className="bg-primary hover:bg-primary/90 rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" /> New Post
          </Button>
        }
      />

      {/* Create / Edit Form */}
      {(creating || editing) && (
        <div className="bento-card mb-6 space-y-4">
          <h3 className="font-semibold text-foreground">
            {creating ? "Create New Post" : "Edit Post"}
          </h3>

          {/* AI Generator Strip */}
          <div className="flex flex-col sm:flex-row gap-3 items-center bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
             <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center shrink-0">
               <Sparkles className="text-indigo-600 dark:text-indigo-300 w-4 h-4" />
             </div>
             <Input 
                placeholder="Enter a topic to generate an article (e.g. 'How to master TypeScript in 30 days')"
                value={aiTopic}
                onChange={e => setAiTopic(e.target.value)}
                className="flex-1 bg-white dark:bg-zinc-950 border-indigo-100 dark:border-indigo-900/50"
             />
             <Button
                onClick={handleGenerateAI}
                disabled={isGenerating || !aiTopic.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto"
             >
                {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Generate Draft
             </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Title
              </label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                className="glass border-border rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Slug
              </label>
              <Input
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }
                placeholder="auto-generated-from-title"
                className="glass border-border rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Category
              </label>
              <Input
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                className="glass border-border rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value }))
                }
                className="w-full h-10 rounded-xl bg-muted border-none px-3 text-sm text-foreground"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Excerpt
            </label>
            <Textarea
              value={form.excerpt}
              onChange={(e) =>
                setForm((f) => ({ ...f, excerpt: e.target.value }))
              }
              rows={2}
              className="glass border-border rounded-xl"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Full Content
            </label>
            <Textarea
              value={form.fullContent}
              onChange={(e) =>
                setForm((f) => ({ ...f, fullContent: e.target.value }))
              }
              rows={6}
              className="glass border-border rounded-xl"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={creating ? createPost : saveEdit}
              className="bg-primary hover:bg-primary/90 rounded-xl"
            >
              <Save className="w-4 h-4 mr-2" />{" "}
              {creating ? "Publish" : "Save"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setCreating(false);
                setEditing(null);
              }}
              className="border-border rounded-xl"
            >
              <X className="w-4 h-4 mr-2" /> Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="bento-card space-y-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-foreground truncate">
                  {post.title}
                </h3>
                <StatusBadge status={post.status.toLowerCase()} />
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {post.excerpt}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {post.date} • {post.category}
              </p>
            </div>
            <div className="flex gap-1 ml-4">
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0"
                onClick={() => startEdit(post)}
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 text-destructive"
                onClick={() => deletePost(post.id)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

