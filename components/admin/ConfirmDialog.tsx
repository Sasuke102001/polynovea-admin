"use client";

import Modal from "./Modal";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="480px">
      <div className="confirm-dialog">
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="btn-cancel" onClick={onClose}>{cancelText}</button>
          <button className="btn-confirm" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
      <style jsx>{`
        .confirm-dialog {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .confirm-message {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.9375rem;
          line-height: 1.6;
        }
        .confirm-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
        }
        .btn-cancel {
          padding: 0.625rem 1.25rem;
          border-radius: 8px;
          border: 1px solid var(--border-muted);
          background: transparent;
          color: var(--text-secondary);
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-cancel:hover {
          border-color: var(--text-secondary);
          color: var(--text-primary);
        }
        .btn-confirm {
          padding: 0.625rem 1.25rem;
          border-radius: 8px;
          border: 1px solid rgba(239, 68, 68, 0.4);
          background: rgba(239, 68, 68, 0.12);
          color: #fca5a5;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-confirm:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.6);
        }
      `}</style>
    </Modal>
  );
}
