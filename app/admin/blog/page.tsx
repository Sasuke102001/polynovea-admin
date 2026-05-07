"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import BlogTable from "@/components/admin/BlogTable";
import BlogForm from "@/components/admin/BlogForm";
import Modal from "@/components/admin/Modal";
import Toast from "@/components/admin/Toast";
import type { BlogPost } from "@/lib/admin/types";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/content/blog-posts");
      if (!res.ok) throw new Error("Failed to fetch blog posts");
      const json = await res.json();
      setPosts(json.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingPost(null);
    setModalOpen(true);
  };

  const handleSuccess = () => {
    setModalOpen(false);
    setEditingPost(null);
    fetchPosts();
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="page">
          <div className="page-header">
            <div>
              <h1>Blog</h1>
              <p className="subtitle">Manage blog posts and articles.</p>
            </div>
            <button className="btn-create" onClick={handleCreate}>+ New Post</button>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner" />
              <span>Loading posts...</span>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <button onClick={fetchPosts}>Retry</button>
            </div>
          ) : (
            <BlogTable posts={posts} onRefresh={fetchPosts} onEdit={handleEdit} />
          )}
        </div>

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingPost ? "Edit Post" : "New Post"} maxWidth="720px">
          <BlogForm post={editingPost} onSuccess={handleSuccess} onCancel={() => setModalOpen(false)} />
        </Modal>
        <Toast />
      </AdminLayout>
      <style jsx>{`
        .page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .page-header h1 {
          font-family: "Clash Display", sans-serif;
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 600;
          margin: 0 0 0.375rem;
          color: var(--text-primary);
        }
        .subtitle {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.9375rem;
        }
        .btn-create {
          padding: 0.625rem 1.25rem;
          border-radius: 8px;
          border: none;
          background: var(--accent-authority);
          color: #0a0a0a;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: opacity 0.2s;
          white-space: nowrap;
        }
        .btn-create:hover {
          opacity: 0.9;
        }
        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 4rem;
          color: var(--text-secondary);
        }
        .spinner {
          width: 32px;
          height: 32px;
          border: 2px solid var(--border-muted);
          border-top-color: var(--accent-intelligence);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 4rem;
          color: #fca5a5;
        }
        .error-state button {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          border: 1px solid var(--border-muted);
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
        }
        .error-state button:hover {
          border-color: var(--text-secondary);
          color: var(--text-primary);
        }
      `}</style>
    </ProtectedRoute>
  );
}
