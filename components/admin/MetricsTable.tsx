"use client";

import type { LiveMetric } from "@/lib/admin/types";

interface MetricsTableProps {
  metrics: LiveMetric[];
}

export default function MetricsTable({ metrics }: MetricsTableProps) {
  return (
    <div className="metrics-table">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Label</th>
              <th>Value</th>
              <th>Period</th>
              <th>Trend</th>
              <th>Direction</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => (
              <tr key={metric.id}>
                <td className="cell-label">{metric.label}</td>
                <td className="cell-value">{metric.value}</td>
                <td>{metric.period}</td>
                <td className={`cell-trend ${metric.trendDirection}`}>{metric.trend}</td>
                <td>
                  <span className={`direction-badge ${metric.trendDirection}`}>
                    {metric.trendDirection === "up" ? "▲" : "▼"} {metric.trendDirection}
                  </span>
                </td>
              </tr>
            ))}
            {metrics.length === 0 && (
              <tr><td colSpan={5} className="empty">No metrics found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <style jsx>{`
        .metrics-table {
          display: flex;
          flex-direction: column;
          gap: 1rem;
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
          white-space: nowrap;
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
        .cell-label {
          font-weight: 500;
        }
        .cell-value {
          font-family: "Clash Display", sans-serif;
          font-weight: 600;
          color: var(--accent-authority);
        }
        .cell-trend.up {
          color: #6ee7b7;
        }
        .cell-trend.down {
          color: #fca5a5;
        }
        .direction-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.25rem 0.625rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .direction-badge.up {
          background: rgba(16, 185, 129, 0.12);
          color: #6ee7b7;
          border: 1px solid rgba(16, 185, 129, 0.25);
        }
        .direction-badge.down {
          background: rgba(239, 68, 68, 0.12);
          color: #fca5a5;
          border: 1px solid rgba(239, 68, 68, 0.25);
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
        }
      `}</style>
    </div>
  );
}
