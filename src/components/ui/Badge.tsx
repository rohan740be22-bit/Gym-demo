import { ReactNode } from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'neutral' | 'lime';

const styles: Record<BadgeVariant, string> = {
  success: 'bg-success/15 text-success border-success/30',
  warning: 'bg-warning/15 text-warning border-warning/30',
  error: 'bg-error/15 text-error border-error/30',
  neutral: 'bg-ink-700 text-text-mute border-border',
  lime: 'bg-lime/15 text-lime border-lime/30',
};

export function Badge({ variant = 'neutral', children }: { variant?: BadgeVariant; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border ${styles[variant]}`}>
      {children}
    </span>
  );
}
