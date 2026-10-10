import { ReactNode } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
}

export function ConfirmDialog({ open, onConfirm, onCancel, title, message, confirmLabel = 'Confirm', danger }: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-ink-900/80 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-ink-800 border border-border rounded-2xl p-6 animate-slide-up">
        <h3 className="text-lg font-bold text-text-light mb-2">{title}</h3>
        <p className="text-sm text-text-mute mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn-secondary">Cancel</button>
          <button
            onClick={onConfirm}
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 font-semibold text-sm rounded-lg transition-all active:scale-[0.98] ${
              danger ? 'bg-error text-white hover:bg-error/80' : 'bg-lime text-ink-900 hover:bg-lime-dark'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
