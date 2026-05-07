"use client";

import { useState, useEffect, useCallback } from "react";
import type { ToastMessage, ToastType } from "@/lib/admin/types";

let toastListeners: ((toast: ToastMessage) => void)[] = [];

export function showToast(message: string, type: ToastType = "info") {
  const toast: ToastMessage = {
    id: Math.random().toString(36).slice(2),
    message,
    type,
  };
  toastListeners.forEach((listener) => listener(toast));
}

export default function Toast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const listener = (toast: ToastMessage) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => removeToast(toast.id), 4000);
    };
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, [removeToast]);

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span>{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="toast-close">&times;</button>
        </div>
      ))}
      <style jsx>{`
        .toast-container {
          position: fixed;
          top: 1.5rem;
          right: 1.5rem;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-width: min(400px, 90vw);
        }
        .toast {
          padding: 0.875rem 1.25rem;
          border-radius: 8px;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          animation: slideIn 0.3s ease;
          border: 1px solid var(--border-muted);
          backdrop-filter: blur(8px);
        }
        .toast-success {
          background: rgba(14, 165, 233, 0.12);
          color: #7dd3fc;
          border-color: rgba(14, 165, 233, 0.3);
        }
        .toast-error {
          background: rgba(239, 68, 68, 0.12);
          color: #fca5a5;
          border-color: rgba(239, 68, 68, 0.3);
        }
        .toast-info {
          background: rgba(124, 58, 237, 0.12);
          color: #c4b5fd;
          border-color: rgba(124, 58, 237, 0.3);
        }
        .toast-close {
          background: none;
          border: none;
          color: inherit;
          font-size: 1.25rem;
          cursor: pointer;
          opacity: 0.7;
          line-height: 1;
        }
        .toast-close:hover {
          opacity: 1;
        }
        @keyframes slideIn {
          from {
            transform: translateX(120%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
