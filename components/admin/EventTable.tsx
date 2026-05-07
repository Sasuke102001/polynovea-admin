"use client";

import { useState, useMemo } from "react";
import type { LiveEvent } from "@/lib/admin/types";
import { getAuthHeaders } from "@/lib/admin/authCheck";
import { showToast } from "./Toast";
import ConfirmDialog from "./ConfirmDialog";

interface EventTableProps {
  events: LiveEvent[];
  onRefresh: () => void;
  onEdit: (event: LiveEvent) => void;
}

export default function EventTable({ events, onRefresh, onEdit }: EventTableProps) {
  const [sortKey, setSortKey] = useState<keyof LiveEvent>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [filterCity, setFilterCity] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const cities = useMemo(() => {
    const set = new Set(events.map((e) => e.city));
    return Array.from(set).sort();
  }, [events]);

  const statuses = useMemo(() => {
    const set = new Set(events.map((e) => e.status));
    return Array.from(set).sort();
  }, [events]);

  const sorted = useMemo(() => {
    let data = [...events];
    if (filterCity) data = data.filter((e) => e.city === filterCity);
    if (filterStatus) data = data.filter((e) => e.status === filterStatus);
    data.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [events, sortKey, sortDir, filterCity, filterStatus]);

  const toggleSort = (key: keyof LiveEvent) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/content/live-events/${deleteId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Delete failed");
      showToast("Event deleted.", "success");
      onRefresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Delete failed", "error");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const badgeClass = (type: string) => {
    switch (type) {
      case "active": return "badge-active";
      case "progress": return "badge-progress";
      case "planned": return "badge-planned";
      default: return "";
    }
  };

  return (
    <div className="event-table">
      <div className="filters">
        <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
          <option value="">All Cities</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button className="btn-clear" onClick={() => { setFilterCity(""); setFilterStatus(""); }}>Clear</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th onClick={() => toggleSort("title")}>Title {sortKey === "title" && (sortDir === "asc" ? "↑" : "↓")}</th>
              <th onClick={() => toggleSort("date")}>Date {sortKey === "date" && (sortDir === "asc" ? "↑" : "↓")}</th>
              <th onClick={() => toggleSort("city")}>City {sortKey === "city" && (sortDir === "asc" ? "↑" : "↓")}</th>
              <th onClick={() => toggleSort("status")}>Status {sortKey === "status" && (sortDir === "asc" ? "↑" : "↓")}</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((event) => (
              <tr key={event.id}>
                <td className="cell-title">{event.title}</td>
                <td>{event.date}</td>
                <td>{event.city}</td>
                <td>{event.status}</td>
                <td><span className={`badge ${badgeClass(event.statusType)}`}>{event.statusType}</span></td>
                <td>
                  <div className="actions">
                    <button className="btn-edit" onClick={() => onEdit(event)}>Edit</button>
                    <button className="btn-delete" onClick={() => setDeleteId(event.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr><td colSpan={6} className="empty">No events found.</td></tr>
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
        .event-table {
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
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          border: 1px solid var(--border-muted);
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-primary);
          font-size: 0.875rem;
          outline: none;
          cursor: pointer;
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
          max-width: 240px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .badge {
          display: inline-block;
          padding: 0.25rem 0.625rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .badge-active {
          background: rgba(16, 185, 129, 0.12);
          color: #6ee7b7;
          border: 1px solid rgba(16, 185, 129, 0.25);
        }
        .badge-progress {
          background: rgba(245, 158, 11, 0.12);
          color: #fcd34d;
          border: 1px solid rgba(245, 158, 11, 0.25);
        }
        .badge-planned {
          background: rgba(124, 58, 237, 0.12);
          color: #c4b5fd;
          border: 1px solid rgba(124, 58, 237, 0.25);
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
            max-width: 140px;
          }
        }
      `}</style>
    </div>
  );
}
