"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import type { BlogPost } from "@/lib/admin/types";
import { getAuthHeaders } from "@/lib/admin/authCheck";
import { showToast } from "./Toast";

const blogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-safe (lowercase, hyphens only)"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  excerpt: z.string().min(20, "Excerpt must be at least 20 characters").max(500),
  author: z.string().min(2, "Author must be at least 2 characters").max(100),
  status: z.enum(["draft", "published"]),
});

type BlogFormData = z.infer<typeof blogSchema>;

interface BlogFormProps {
  post?: BlogPost | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const emptyForm: BlogFormData = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  author: "",
  status: "draft",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function BlogForm({ post, onSuccess, onCancel }: BlogFormProps) {
  const [form, setForm] = useState<BlogFormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof BlogFormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (post) {
      setForm({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        author: post.author,
        status: post.status,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [post]);

  const updateField = <K extends keyof BlogFormData>(field: K, value: BlogFormData[K]) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "title" && !post && !prev.slug) {
        next.slug = slugify(value as string);
      }
      return next;
    });
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = blogSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof BlogFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const key = err.path[0] as keyof BlogFormData;
        fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      showToast("Please fix the form errors.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const url = post ? `/api/content/blog-posts/${post.id}` : "/api/content/blog-posts";
      const method = post ? "PUT" : "POST";
      const body: Record<string, unknown> = { ...form };
      if (!post && form.status === "published") {
        body.published_at = new Date().toISOString();
      }
      if (post && form.status === "published" && post.status === "draft") {
        body.published_at = new Date().toISOString();
      }
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Request failed");
      showToast(post ? "Post updated." : "Post created.", "success");
      onSuccess();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Request failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="blog-form">
      <div className="form-grid">
        <div className="field">
          <label>Title</label>
          <input value={form.title} onChange={(e) => updateField("title", e.target.value)} placeholder="Post title" />
          {errors.title && <span className="error">{errors.title}</span>}
        </div>
        <div className="field">
          <label>Slug</label>
          <input value={form.slug} onChange={(e) => updateField("slug", e.target.value)} placeholder="url-friendly-slug" />
          {errors.slug && <span className="error">{errors.slug}</span>}
        </div>
        <div className="field">
          <label>Author</label>
          <input value={form.author} onChange={(e) => updateField("author", e.target.value)} placeholder="Author name" />
          {errors.author && <span className="error">{errors.author}</span>}
        </div>
        <div className="field">
          <label>Status</label>
          <select value={form.status} onChange={(e) => updateField("status", e.target.value as BlogFormData["status"])}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          {errors.status && <span className="error">{errors.status}</span>}
        </div>
        <div className="field full">
          <label>Excerpt</label>
          <textarea rows={3} value={form.excerpt} onChange={(e) => updateField("excerpt", e.target.value)} placeholder="Short summary for listings..." />
          {errors.excerpt && <span className="error">{errors.excerpt}</span>}
        </div>
        <div className="field full">
          <label>Content</label>
          <textarea rows={12} value={form.content} onChange={(e) => updateField("content", e.target.value)} placeholder="Full post content (markdown or HTML)..." />
          {errors.content && <span className="error">{errors.content}</span>}
        </div>
      </div>
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : post ? "Update Post" : "Create Post"}
        </button>
      </div>
      <style jsx>{`
        .blog-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }
        .field.full {
          grid-column: 1 / -1;
        }
        .field label {
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .field input,
        .field select,
        .field textarea {
          padding: 0.625rem 0.875rem;
          border-radius: 8px;
          border: 1px solid var(--border-muted);
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-primary);
          font-size: 0.9375rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit;
        }
        .field input:focus,
        .field select:focus,
        .field textarea:focus {
          border-color: var(--accent-intelligence);
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
        }
        .field textarea {
          resize: vertical;
          min-height: 80px;
        }
        .error {
          color: #fca5a5;
          font-size: 0.8125rem;
        }
        .form-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
          padding-top: 0.5rem;
          border-top: 1px solid var(--border-muted);
        }
        .btn-secondary {
          padding: 0.625rem 1.25rem;
          border-radius: 8px;
          border: 1px solid var(--border-muted);
          background: transparent;
          color: var(--text-secondary);
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-secondary:hover {
          border-color: var(--text-secondary);
          color: var(--text-primary);
        }
        .btn-primary {
          padding: 0.625rem 1.25rem;
          border-radius: 8px;
          border: none;
          background: var(--accent-authority);
          color: #0a0a0a;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .btn-primary:hover:not(:disabled) {
          opacity: 0.9;
        }
        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        @media (max-width: 640px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </form>
  );
}
