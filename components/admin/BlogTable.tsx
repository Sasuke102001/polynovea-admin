"use client";

import { useState, useMemo } from "react";
import type { BlogPost } from "@/lib/admin/types";
import { getAuthHeaders } from "@/lib/admin/authCheck";
import { showToast } from "./Toast";
import ConfirmDialog from "./ConfirmDialog";

interface BlogTableProps {
  posts: BlogPost[];
  onRefresh: () => void;
  onEdit: (post: BlogPost) => void;
}

export default function BlogTable({ posts, onRefresh, onEdit }: BlogTableProps) {
  const [sortKey, setSortKey] = useState<keyof BlogPost>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [filterStatus, setFilterStatus] = useState<"" | "draft" | "published">("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const sorted = useMemo(() => {
    let data = [...posts];
    if (filterStatus) data = data.filter((p) => p.status === filterStatus);
    data.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === null && bv !== null) return sortDir === "asc" ? -1 : 1;
      if (bv === null && av !== null) return sortDir === "asc" ? 1 : -1;
      if (av === null && bv === null) return 0;
      if (av! < bv!) return sortDir === "asc" ? -1 : 1;
      if (av! > bv!) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [posts, sortKey, sortDir, filterStatus]);

  const toggleSort = (key: keyof BlogPost) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/content/blog-posts/${deleteId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Delete failed");
      showToast("Post deleted.", "success");
      onRefresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Delete failed", "error");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const toggleStatus = async (post: BlogPost) => {
    const newStatus = post.status === "draft" ? "published" : "draft";
    try {
      const body: Record<string, unknown> = { status: newStatus };
      if (newStatus === "published" && !post.published_at) {
        body.published_at = new Date().toISOString();
      }
      const res = await fetch(`/api/content/blog-posts/${post.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Update failed");
      showToast(`Status changed to ${newStatus}.`, "success");
      onRefresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Update failed", "error");
    }
  };

  return (
    <div className="blog-table">
      <div className="filters">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}>
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <button className="btn-clear" onClick={() => setFilterStatus("")}>Clear</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th onClick={() => toggleSort("title")}>Title {sortKey === "title" && (sortDir === "asc" ? "↑" : "↓")}</th>
              <th onClick={() => toggleSort("author")}>Author {sortKey === "author" && (sortDir === "asc" ? "↑" : "↓")}</th>
              <th onClick={() => toggleSort("status")}>Status {sortKey === "status" && (sortDir === "asc" ? "↑" : "↓")}</th>
              <th onClick={() => toggleSort("published_at")}>Published {sortKey === "published_at" && (sortDir === "asc" ? "↑" : "↓")}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((post) => (
              <tr key={post.id}>
                <td className="cell-title">{post.title}</td>
                <td>{post.author}</td>
                <td>
                  <button
                    className={`status-toggle ${post.status}`}
                    onClick={() => toggleStatus(post)}
                    title="Click to toggle status"
                  >
                    {post.status}
                  </button>
                </td>
                <td>{post.published_at ? new Date(post.published_at).toLocaleDateString() : "—"}</td>
                <td>
                  <div className="actions">
                    <button className="btn-edit" onClick={() => onEdit(post)}>Edit</button>
                    <button className="btn-delete" onClick={() => setDeleteId(post.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr><td colSpan={5} className="empty">No posts found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        confirmText={deleting ? "Deleting..." : "Delete"}
      />

      <style jsx>{`
        .blog-table {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .filters {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .filters select {
          padding: 0.625rem 0.875rem;
          border-radius: 8px;
          border: 1px solid var(--border-muted);
          background: rgba(255, 255, 255, 0.15);
          color: var(--text-primary);
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s;
          cursor: pointer;
        }
        .filters select:focus {
          border-color: var(--accent-intelligence);
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
        }
        .btn-clear {
          padding: 0.5rem 0.875rem;
          border-radius: 8px;
          border: 1px solid var(--border-muted);
          background: transparent;
          color: var(--text-secondary);
          font-size: 0.875rem;
          cursor: pointer;
        }
        .btn-clear:hover {
          border-color: var(--text-secondary);
          color: var(--text-primary);
        }
        .table-wrap {
          overflow-x: auto;
          border: 1px solid var(--border-muted);
          border-radius: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
        }
        th {
          text-align: left;
          padding: 0.875rem 1rem;
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 0.8125rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border-bottom: 1px solid var(--border-muted);
          background: rgba(255, 255, 255, 0.02);
          cursor: pointer;
          user-select: none;
          white-space: nowrap;
        }
        th:hover {
          color: var(--text-primary);
        }
        td {
          padding: 0.875rem 1rem;
          border-bottom: 1px solid var(--border-muted);
          color: var(--text-primary);
          vertical-align: middle;
        }
        tr:last-child td {
          border-bottom: none;
        }
        tr:hover td {
          background: rgba(255, 255, 255, 0.02);
        }
        .cell-title {
          font-weight: 500;
          max-width: 280px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .status-toggle {
          padding: 0.25rem 0.625rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          cursor: pointer;
          border: 1px solid;
          background: transparent;
          transition: all 0.2s;
        }
        .status-toggle.draft {
          color: #fcd34d;
          border-color: rgba(245, 158, 11, 0.3);
        }
        .status-toggle.draft:hover {
          background: rgba(245, 158, 11, 0.1);
        }
        .status-toggle.published {
          color: #6ee7b7;
          border-color: rgba(16, 185, 129, 0.3);
        }
        .status-toggle.published:hover {
          background: rgba(16, 185, 129, 0.1);
        }
        .actions {
          display: flex;
          gap: 0.5rem;
        }
        .btn-edit, .btn-delete {
          padding: 0.375rem 0.625rem;
          border-radius: 6px;
          font-size: 0.8125rem;
          cursor: pointer;
          border: 1px solid var(--border-muted);
          background: transparent;
          color: var(--text-secondary);
          transition: all 0.2s;
        }
        .btn-edit:hover {
          border-color: var(--accent-intelligence);
          color: #c4b5fd;
        }
        .btn-delete:hover {
          border-color: rgba(239, 68, 68, 0.4);
          color: #fca5a5;
        }
        .empty {
          text-align: center;
          color: var(--text-secondary);
          padding: 2rem;
        }
        @media (max-width: 640px) {
          th, td {
            padding: 0.625rem 0.75rem;
          }
          .cell-title {
            max-width: 160px;
          }
        }
      `}</style>
    </div>
  );
}
