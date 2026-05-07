"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import type { VenuePartnership } from "@/lib/admin/types";
import { getAuthHeaders } from "@/lib/admin/authCheck";
import { showToast } from "./Toast";

const venueSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  city: z.string().min(2, "City must be at least 2 characters").max(50),
  capacity: z.string().min(1, "Capacity is required"),
  type: z.string().min(1, "Type is required"),
  desc: z.string().min(10, "Description must be at least 10 characters").max(500),
  contact_email: z.string().email("Must be a valid email"),
  logo_url: z.string().regex(/^https?:\/\/.+/, "Must be a valid URL"),
  contactStatus: z.string().min(1, "Contact status is required"),
  statusType: z.enum(["active", "progress", "planned"]),
});

type VenueFormData = z.infer<typeof venueSchema>;

interface VenueFormProps {
  venue?: VenuePartnership | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const emptyForm: VenueFormData = {
  name: "",
  city: "",
  capacity: "",
  type: "",
  desc: "",
  contact_email: "",
  logo_url: "",
  contactStatus: "",
  statusType: "planned",
};

export default function VenueForm({ venue, onSuccess, onCancel }: VenueFormProps) {
  const [form, setForm] = useState<VenueFormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof VenueFormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (venue) {
      setForm({
        name: venue.name,
        city: venue.city,
        capacity: venue.capacity,
        type: venue.type,
        desc: venue.desc,
        contact_email: venue.contact_email,
        logo_url: venue.logo_url,
        contactStatus: venue.contactStatus,
        statusType: venue.statusType,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [venue]);

  const updateField = <K extends keyof VenueFormData>(field: K, value: VenueFormData[K]) => {
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
    const result = venueSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof VenueFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const key = err.path[0] as keyof VenueFormData;
        fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      showToast("Please fix the form errors.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const url = venue ? `/api/content/venue-partnerships/${venue.id}` : "/api/content/venue-partnerships";
      const method = venue ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Request failed");
      showToast(venue ? "Venue updated." : "Venue created.", "success");
      onSuccess();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Request failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="venue-form">
      <div className="form-grid">
        <div className="field">
          <label>Name</label>
          <input value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Venue name" />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>
        <div className="field">
          <label>City</label>
          <input value={form.city} onChange={(e) => updateField("city", e.target.value)} placeholder="City" />
          {errors.city && <span className="error">{errors.city}</span>}
        </div>
        <div className="field">
          <label>Capacity</label>
          <input value={form.capacity} onChange={(e) => updateField("capacity", e.target.value)} placeholder="e.g. 1000+" />
          {errors.capacity && <span className="error">{errors.capacity}</span>}
        </div>
        <div className="field">
          <label>Type</label>
          <input value={form.type} onChange={(e) => updateField("type", e.target.value)} placeholder="e.g. Concert Hall" />
          {errors.type && <span className="error">{errors.type}</span>}
        </div>
        <div className="field">
          <label>Contact Email</label>
          <input type="email" value={form.contact_email} onChange={(e) => updateField("contact_email", e.target.value)} placeholder="contact@venue.com" />
          {errors.contact_email && <span className="error">{errors.contact_email}</span>}
        </div>
        <div className="field">
          <label>Contact Status</label>
          <input value={form.contactStatus} onChange={(e) => updateField("contactStatus", e.target.value)} placeholder="e.g. CONNECTED" />
          {errors.contactStatus && <span className="error">{errors.contactStatus}</span>}
        </div>
        <div className="field">
          <label>Status Type</label>
          <select value={form.statusType} onChange={(e) => updateField("statusType", e.target.value as VenueFormData["statusType"])}>
            <option value="active">Active</option>
            <option value="progress">In Progress</option>
            <option value="planned">Planned</option>
          </select>
          {errors.statusType && <span className="error">{errors.statusType}</span>}
        </div>
        <div className="field full">
          <label>Logo URL</label>
          <input value={form.logo_url} onChange={(e) => updateField("logo_url", e.target.value)} placeholder="https://..." />
          {errors.logo_url && <span className="error">{errors.logo_url}</span>}
          {form.logo_url && (
            <div className="logo-preview">
              <img src={form.logo_url} alt="Logo preview" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
          )}
        </div>
        <div className="field full">
          <label>Description</label>
          <textarea rows={4} value={form.desc} onChange={(e) => updateField("desc", e.target.value)} placeholder="Venue description..." />
          {errors.desc && <span className="error">{errors.desc}</span>}
        </div>
      </div>
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : venue ? "Update Venue" : "Create Venue"}
        </button>
      </div>
      <style jsx>{`
        .venue-form {
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
          background: rgba(255, 255, 255, 0.03);
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
        .logo-preview {
          margin-top: 0.5rem;
        }
        .logo-preview img {
          max-height: 80px;
          max-width: 200px;
          border-radius: 6px;
          border: 1px solid var(--border-muted);
          object-fit: contain;
          background: rgba(255, 255, 255, 0.03);
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
