"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import type { LiveEvent } from "@/lib/admin/types";
import { getAuthHeaders } from "@/lib/admin/authCheck";
import { showToast } from "./Toast";

const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title max 100 characters"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  time: z.string().regex(/^(\d{2}:\d{2}(:\d{2})?)$/, "Time must be HH:MM or HH:MM:SS"),
  venue: z.string().min(2, "Venue must be at least 2 characters").max(100),
  city: z.string().min(2, "City must be at least 2 characters").max(50),
  capacity: z.string().min(1, "Capacity is required"),
  status: z.string().min(1, "Status is required"),
  desc: z.string().min(10, "Description must be at least 10 characters").max(500),
  cta: z.string().min(1, "CTA text is required"),
  href: z.string().regex(/^https?:\/\/.+/, "Must be a valid URL starting with http:// or https://"),
  statusType: z.enum(["active", "progress", "planned"]),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  event?: LiveEvent | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const emptyForm: EventFormData = {
  title: "",
  date: "",
  time: "",
  venue: "",
  city: "",
  capacity: "",
  status: "",
  desc: "",
  cta: "Book Tickets",
  href: "",
  statusType: "planned",
};

export default function EventForm({ event, onSuccess, onCancel }: EventFormProps) {
  const [form, setForm] = useState<EventFormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof EventFormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title,
        date: event.date,
        time: event.time,
        venue: event.venue,
        city: event.city,
        capacity: event.capacity,
        status: event.status,
        desc: event.desc,
        cta: event.cta,
        href: event.href,
        statusType: event.statusType,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [event]);

  const updateField = <K extends keyof EventFormData>(field: K, value: EventFormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
    const result = eventSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof EventFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const key = err.path[0] as keyof EventFormData;
        fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      showToast("Please fix the form errors.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const url = event ? `/api/content/live-events/${event.id}` : "/api/content/live-events";
      const method = event ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Request failed");
      showToast(event ? "Event updated." : "Event created.", "success");
      onSuccess();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Request failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="event-form">
      <div className="form-grid">
        <div className="field">
          <label>Title</label>
          <input value={form.title} onChange={(e) => updateField("title", e.target.value)} placeholder="Event title" />
          {errors.title && <span className="error">{errors.title}</span>}
        </div>
        <div className="field">
          <label>Date</label>
          <input type="date" value={form.date} onChange={(e) => updateField("date", e.target.value)} />
          {errors.date && <span className="error">{errors.date}</span>}
        </div>
        <div className="field">
          <label>Time</label>
          <input type="time" value={form.time.slice(0, 5)} onChange={(e) => updateField("time", e.target.value + ":00")} />
          {errors.time && <span className="error">{errors.time}</span>}
        </div>
        <div className="field">
          <label>Venue</label>
          <input value={form.venue} onChange={(e) => updateField("venue", e.target.value)} placeholder="Venue name" />
          {errors.venue && <span className="error">{errors.venue}</span>}
        </div>
        <div className="field">
          <label>City</label>
          <input value={form.city} onChange={(e) => updateField("city", e.target.value)} placeholder="City" />
          {errors.city && <span className="error">{errors.city}</span>}
        </div>
        <div className="field">
          <label>Capacity</label>
          <input value={form.capacity} onChange={(e) => updateField("capacity", e.target.value)} placeholder="e.g. 500+" />
          {errors.capacity && <span className="error">{errors.capacity}</span>}
        </div>
        <div className="field">
          <label>Status Label</label>
          <input value={form.status} onChange={(e) => updateField("status", e.target.value)} placeholder="e.g. LIVE BOOKING" />
          {errors.status && <span className="error">{errors.status}</span>}
        </div>
        <div className="field">
          <label>Status Type</label>
          <select value={form.statusType} onChange={(e) => updateField("statusType", e.target.value as EventFormData["statusType"])}>
            <option value="active">Active</option>
            <option value="progress">In Progress</option>
            <option value="planned">Planned</option>
          </select>
          {errors.statusType && <span className="error">{errors.statusType}</span>}
        </div>
        <div className="field full">
          <label>CTA Text</label>
          <input value={form.cta} onChange={(e) => updateField("cta", e.target.value)} placeholder="e.g. Book Tickets" />
          {errors.cta && <span className="error">{errors.cta}</span>}
        </div>
        <div className="field full">
          <label>CTA Link</label>
          <input value={form.href} onChange={(e) => updateField("href", e.target.value)} placeholder="https://..." />
          {errors.href && <span className="error">{errors.href}</span>}
        </div>
        <div className="field full">
          <label>Description</label>
          <textarea rows={4} value={form.desc} onChange={(e) => updateField("desc", e.target.value)} placeholder="Event description..." />
          {errors.desc && <span className="error">{errors.desc}</span>}
        </div>
      </div>
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : event ? "Update Event" : "Create Event"}
        </button>
      </div>
      <style jsx>{`
        .event-form {
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
        .field input::placeholder,
        .field textarea::placeholder {
          color: rgba(160, 160, 160, 0.8);
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
