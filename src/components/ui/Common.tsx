import { ReactNode, useState } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Search...' }: SearchInputProps) {
  return (
    <div className="relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-text-mute" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-9"
      />
    </div>
  );
}

interface FilterSelectProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  label?: string;
}

export function FilterSelect({ options, value, onChange, label }: FilterSelectProps) {
  return (
    <div>
      {label && <span className="input-label">{label}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-ink-900">{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

interface TabBarProps {
  tabs: { id: string; label: string; icon?: ReactNode }[];
  active: string;
  onChange: (id: string) => void;
}

export function TabBar({ tabs, active, onChange }: TabBarProps) {
  return (
    <div className="flex gap-1 border-b border-border overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
            active === tab.id
              ? 'text-lime border-lime'
              : 'text-text-mute border-transparent hover:text-text-light'
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

interface DataTableColumn<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  emptyMessage?: string;
}

export function DataTable<T extends { id: string }>({ columns, data, emptyMessage = 'No data available' }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th key={col.key} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-text-mute">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-sm text-text-mute">{emptyMessage}</td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id} className="border-b border-border/50 hover:bg-ink-700/40 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="py-3 px-4 text-sm text-text-light">
                    {col.render ? col.render(row) : (row as Record<string, ReactNode>)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 text-text-mute">{icon}</div>}
      <h3 className="text-lg font-semibold text-text-light mb-1">{title}</h3>
      {message && <p className="text-sm text-text-mute mb-4 max-w-sm">{message}</p>}
      {action}
    </div>
  );
}

export function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-8 h-8 border-2 border-border border-t-lime rounded-full animate-spin" />
      {label && <p className="mt-3 text-sm text-text-mute">{label}</p>}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const variantMap: Record<string, 'success' | 'warning' | 'error' | 'neutral' | 'lime'> = {
    Active: 'success',
    active: 'success',
    paid: 'success',
    granted: 'success',
    completed: 'success',
    Expiring: 'warning',
    expiring: 'warning',
    pending: 'warning',
    upcoming: 'lime',
    published: 'success',
    draft: 'warning',
    Suspended: 'error',
    suspended: 'error',
    inactive: 'neutral',
    overdue: 'error',
    denied: 'error',
    invalid: 'error',
    cancelled: 'neutral',
    lost: 'warning',
    replaced: 'neutral',
  };
  const variant = variantMap[status] || 'neutral';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border ${
      variant === 'success' ? 'bg-success/15 text-success border-success/30' :
      variant === 'warning' ? 'bg-warning/15 text-warning border-warning/30' :
      variant === 'error' ? 'bg-error/15 text-error border-error/30' :
      variant === 'lime' ? 'bg-lime/15 text-lime border-lime/30' :
      'bg-ink-700 text-text-mute border-border'
    }`}>
      {status}
    </span>
  );
}
