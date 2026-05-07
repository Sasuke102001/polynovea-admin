"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import type { LiveMetric } from "@/lib/admin/types";
import { getAuthHeaders } from "@/lib/admin/authCheck";
import { showToast } from "./Toast";

const metricSchema = z.object({
  label: z.string().min(5, "Label must be at least 5 characters").max(50),
  value: z.string().min(1, "Value is required"),
  period: z.string().min(1, "Period is required"),
  trend: z.string().regex(/^[+-]?\d+(\.\d+)?%$/, "Trend must be like +12.5% or -5%"),
  trendDirection: z.enum(["up", "down"]),
});

type MetricFormData = z.infer<typeof metricSchema>;

interface MetricsFormProps {
  metrics: LiveMetric[];
  onSuccess: () => void;
}

export default function MetricsForm({ metrics, onSuccess }: MetricsFormProps) {
  const [forms, setForms] = useState<MetricFormData[]>([]);
  const [errors, setErrors] = useState<Partial<Record<number, Record<string, string>>>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForms(
      metrics.map((m) => ({
        label: m.label,
        value: m.value,
        period: m.period,
        trend: m.trend,
        trendDirection: m.trendDirection,
      }))
    );
    setErrors({});
  }, [metrics]);

  const updateField = (index: number, field: keyof MetricFormData, value: string) => {
    setForms((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
    setErrors((prev) => {
      const next = { ...prev };
      if (next[index]) {
        const row = { ...next[index] };
        delete row[field];
        next[index] = row;
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allErrors: Partial<Record<number, Record<string, string>>> = {};
    let hasError = false;

    forms.forEach((form, i) => {
      const result = metricSchema.safeParse(form);
      if (!result.success) {
        hasError = true;
        const rowErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          rowErrors[err.path[0] as string] = err.message;
        });
        allErrors[i] = rowErrors;
      }
    });

    if (hasError) {
      setErrors(allErrors);
      showToast("Please fix the form errors.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const payload = forms.map((form, i) => ({
        id: metrics[i]?.id,
        ...form,
      }));
      const res = await fetch("/api/content/live-metrics", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Update failed");
      showToast("Metrics updated.", "success");
      onSuccess();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Update failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="metrics-form">
      <div className="metrics-list">
        {forms.map((form, i) => (
          <div key={i} className="metric-card">
            <div className="metric-header">
              <span className="metric-number">{i + 1}</span>
              <span className="metric-label-display">{form.label || "New Metric"}</span>
            </div>
            <div className="metric-grid">
              <div className="field">
                <label>Label</label>
                <input value={form.label} onChange={(e) => updateField(i, "label", e.target.value)} placeholder="e.g. Crowd Energy" />
                {errors[i]?.label && <span className="error">{errors[i].label}</span>}
              </div>
              <div className="field">
                <label>Value</label>
                <input value={form.value} onChange={(e) => updateField(i, "value", e.target.value)} placeholder="e.g. 94.2" />
                {errors[i]?.value && <span className="error">{errors[i].value}</span>}
              </div>
              <div className="field">
                <label>Period</label>
                <input value={form.period} onChange={(e) => updateField(i, "period", e.target.value)} placeholder="e.g. Last Show" />
                {errors[i]?.period && <span className="error">{errors[i].period}</span>}
              </div>
              <div className="field">
                <label>Trend</label>
                <input value={form.trend} onChange={(e) => updateField(i, "trend", e.target.value)} placeholder="e.g. +12.5%" />
                {errors[i]?.trend && <span className="error">{errors[i].trend}</span>}
              </div>
              <div className="field">
                <label>Direction</label>
                <select value={form.trendDirection} onChange={(e) => updateField(i, "trendDirection", e.target.value)}>
                  <option value="up">Up</option>
                  <option value="down">Down</option>
                </select>
                {errors[i]?.trendDirection && <span className="error">{errors[i].trendDirection}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : "Update All Metrics"}
        </button>
      </div>
      <style jsx>{`
        .metrics-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .metrics-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .metric-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-muted);
          border-radius: 10px;
          padding: 1.25rem;
        }
        .metric-header {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          margin-bottom: 1rem;
        }
        .metric-number {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background: rgba(124, 58, 237, 0.15);
          color: #c4b5fd;
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .metric-label-display {
          font-family: "Clash Display", sans-serif;
          font-weight: 600;
          font-size: 0.9375rem;
          color: var(--text-primary);
        }
        .metric-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }
        .field label {
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .field input,
        .field select {
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
        .field input::placeholder {
          color: rgba(160, 160, 160, 0.8);
        }
        .field input:focus,
        .field select:focus {
          border-color: var(--accent-intelligence);
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
        }
        .error {
          color: #fca5a5;
          font-size: 0.8125rem;
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          padding-top: 0.5rem;
          border-top: 1px solid var(--border-muted);
        }
        .btn-primary {
          padding: 0.625rem 1.5rem;
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
        @media (max-width: 768px) {
          .metric-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 480px) {
          .metric-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </form>
  );
}
