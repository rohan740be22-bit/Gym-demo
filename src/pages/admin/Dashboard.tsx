import { Link } from 'react-router-dom';
import { useGym } from '@/context/GymStore';
import { monthlyRevenueData, membershipGrowth, attendanceTrend } from '@/data/mockData';
import { MetricCard } from '@/components/ui/MetricCard';
import { BarChart, LineChart } from '@/components/ui/Charts';
import { StatusBadge } from '@/components/ui/Common';

export default function AdminDashboard() {
  const { members, trainers, payments, occupancy, accessEvents } = useGym();
  const today = new Date().toISOString().slice(0, 10);
  const active = members.filter((m) => m.membershipStatus === 'Active').length;
  const expiring = members.filter((m) => m.membershipStatus === 'Expiring');
  const pending = payments.filter((p) => p.status !== 'paid');
  const checkIns = accessEvents.filter((e) => e.eventType === 'entry' && e.result === 'granted' && e.timestamp.startsWith(today)).length;
  const recorded = payments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-text-light">Operations Overview</h2>
          <p className="text-sm text-text-mute mt-1">Club activity for the sample directory. Charts below are demonstration series, not a live ledger.</p>
        </div>
        <Link to="/admin/occupancy" className="btn-secondary">Open occupancy desk</Link>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard label="Directory Members" value={members.length} trend={`${active} active memberships`} trendUp />
        <MetricCard label="Expiring Soon" value={expiring.length} trend="Status marked Expiring" />
        <MetricCard label="Inside Now" value={occupancy.membersInside} trend={`${occupancy.percentage}% · ${occupancy.status}`} trendUp={occupancy.percentage < 70} />
        <MetricCard label="Trainers" value={trainers.length} />
        <MetricCard label="Check-ins Today" value={checkIns} trend="Granted entries in this preview" />
        <MetricCard label="Sample Revenue" value={`$${recorded.toLocaleString()}`} trend="Paid rows in the preview ledger" trendUp />
        <MetricCard label="Pending Payments" value={pending.length} variant={pending.length ? 'accent' : 'dark'} />
        <MetricCard label="Illustrative Month" value="$18,650" trend="Demonstration figure, not collected" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-light">Membership Growth</h3>
            <span className="text-[10px] uppercase tracking-wide text-text-mute">Demo</span>
          </div>
          <LineChart data={membershipGrowth.map((d) => ({ label: d.month, value: d.count }))} height={160} />
        </div>
        <div className="card-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-light">Attendance Trend</h3>
            <span className="text-[10px] uppercase tracking-wide text-text-mute">Demo</span>
          </div>
          <BarChart data={attendanceTrend.map((d) => ({ label: d.day, value: d.checkIns }))} height={160} />
        </div>
        <div className="card-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-light">Revenue Trend</h3>
            <span className="text-[10px] uppercase tracking-wide text-text-mute">Demo</span>
          </div>
          <BarChart data={monthlyRevenueData.map((d) => ({ label: d.month, value: d.revenue }))} height={160} valueFormat={(v) => `$${(v / 1000).toFixed(1)}k`} color="#35B879" />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-text-light">Expiring Memberships</h3>
            <Link to="/admin/members" className="text-xs text-lime">Manage members</Link>
          </div>
          {expiring.length === 0 ? (
            <p className="text-sm text-text-mute">No memberships are marked expiring.</p>
          ) : (
            <div className="space-y-3">
              {expiring.map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-3 py-2 border-b border-border/60 last:border-0">
                  <div>
                    <div className="text-sm font-semibold text-text-light">{m.name}</div>
                    <div className="text-xs text-text-mute">{m.membershipPlan} · expires {m.expiryDate}</div>
                  </div>
                  <StatusBadge status={m.membershipStatus} />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="card-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-text-light">Payments Needing Attention</h3>
            <Link to="/admin/payments" className="text-xs text-lime">Open ledger</Link>
          </div>
          <div className="space-y-3">
            {pending.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 py-2 border-b border-border/60 last:border-0">
                <div>
                  <div className="text-sm font-semibold text-text-light">{p.memberName}</div>
                  <div className="text-xs text-text-mute">{p.description} · ${p.amount}</div>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
            {pending.length === 0 && <p className="text-sm text-text-mute">All sample invoices are marked paid.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
