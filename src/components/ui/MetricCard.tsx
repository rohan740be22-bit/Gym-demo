import { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string;
  trendUp?: boolean;
  variant?: 'dark' | 'accent';
}

export function MetricCard({ label, value, icon, trend, trendUp, variant = 'dark' }: MetricCardProps) {
  return (
    <div className={`rounded-xl border p-5 ${variant === 'accent' ? 'bg-ink-700 border-lime/20' : 'bg-ink-800 border-border'}`}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-text-mute">{label}</span>
        {icon && <span className="text-lime">{icon}</span>}
      </div>
      <div className="text-3xl font-bold text-text-light">{value}</div>
      {trend && (
        <div className={`mt-2 text-xs font-medium ${trendUp ? 'text-success' : 'text-text-mute'}`}>
          {trend}
        </div>
      )}
    </div>
  );
}
