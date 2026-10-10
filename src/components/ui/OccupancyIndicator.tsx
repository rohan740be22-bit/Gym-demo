import { useGym } from '@/context/GymStore';

interface OccupancyIndicatorProps {
  compact?: boolean;
  showDemoLabel?: boolean;
}

export function OccupancyIndicator({ compact = false, showDemoLabel = true }: OccupancyIndicatorProps) {
  const { occupancy } = useGym();
  const pct = occupancy.percentage;
  const statusColor = pct < 35 ? 'text-success' : pct < 70 ? 'text-warning' : 'text-error';
  const barColor = pct < 35 ? 'bg-success' : pct < 70 ? 'bg-warning' : 'bg-error';

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10">
          <svg className="-rotate-90" width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="16" fill="none" stroke="#303438" strokeWidth="3" />
            <circle
              cx="20" cy="20" r="16" fill="none" stroke="#C7F464" strokeWidth="3"
              strokeDasharray={`${(pct / 100) * 100.5} 100.5`}
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div>
          <div className="text-sm font-semibold text-text-light">{occupancy.membersInside} inside</div>
          <div className={`text-xs ${statusColor}`}>{occupancy.status}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ink-800 border border-border rounded-2xl p-6 lg:p-8">
      {showDemoLabel && (
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-lime/10 text-lime border border-lime/20 rounded">
            <span className="w-1.5 h-1.5 bg-lime rounded-full animate-pulse-lime" />
            Demo Data
          </span>
        </div>
      )}
      <div className="grid lg:grid-cols-[auto_1fr] gap-8 items-center">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-text-light leading-none">{occupancy.membersInside}</div>
            <div className="text-xs text-text-mute mt-1">Members Inside</div>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center">
            <div className="text-5xl font-bold text-text-mute leading-none">{occupancy.maxCapacity}</div>
            <div className="text-xs text-text-mute mt-1">Max Capacity</div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-semibold ${statusColor}`}>{occupancy.status}</span>
            <span className="text-sm font-semibold text-text-light">{pct}%</span>
          </div>
          <div className="h-3 bg-ink-900 rounded-full overflow-hidden border border-border">
            <div
              className={`h-full ${barColor} rounded-full transition-all duration-700`}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-text-mute">
            <span>Updated {occupancy.lastUpdated}</span>
            <span>Quiet &lt; 35% · Moderate &lt; 70% · Busy ≥ 70%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
