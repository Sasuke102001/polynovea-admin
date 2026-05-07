"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import MetricsTable from "@/components/admin/MetricsTable";
import MetricsForm from "@/components/admin/MetricsForm";
import Toast from "@/components/admin/Toast";
import type { LiveMetric } from "@/lib/admin/types";

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<LiveMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/content/live-metrics");
      if (!res.ok) throw new Error("Failed to fetch metrics");
      const json = await res.json();
      setMetrics(json.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleSuccess = () => {
    setEditing(false);
    fetchMetrics();
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="page">
          <div className="page-header">
            <div>
              <h1>Live Metrics</h1>
              <p className="subtitle">Manage performance indicators.</p>
            </div>
            <button className="btn-create" onClick={() => setEditing(!editing)}>
              {editing ? "Cancel" : "Edit Metrics"}
            </button>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner" />
              <span>Loading metrics...</span>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <button onClick={fetchMetrics}>Retry</button>
            </div>
          ) : editing ? (
            <MetricsForm metrics={metrics} onSuccess={handleSuccess} />
          ) : (
            <MetricsTable metrics={metrics} />
          )}
        </div>
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
