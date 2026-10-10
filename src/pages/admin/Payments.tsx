import { useState } from 'react';
import { useGym } from '@/context/GymStore';
import { monthlyRevenueData } from '@/data/mockData';
import { BarChart } from '@/components/ui/Charts';
import { StatusBadge, FilterSelect } from '@/components/ui/Common';

export default function AdminPayments() {
  const { payments, members, membershipPlans, setPaymentStatus } = useGym();
  const [status, setStatus] = useState('all');
  const visible = payments.filter((p) => status === 'all' || p.status === status);
  const paid = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter((p) => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
  const overdue = payments.filter((p) => p.status === 'overdue');
  const expiring = members.filter((m) => m.membershipStatus === 'Expiring' || m.membershipStatus === 'Suspended');

  const download = () => {
    const rows = [
      ['Member', 'Description', 'Amount', 'Date', 'Method', 'Status'],
      ...payments.map((p) => [p.memberName, p.description, String(p.amount), p.date, p.method, p.status]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'forge-payment-preview.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-light">Payments & Reports</h2>
          <p className="text-sm text-text-mute mt-1">Sample ledger only. Full card numbers are never shown. Nothing here charges a real account.</p>
        </div>
        <button className="btn-secondary" onClick={download}>Download CSV</button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card-dark p-5"><div className="text-xs uppercase text-text-mute">Recorded as paid</div><div className="text-3xl font-bold mt-2">${paid}</div></div>
        <div className="card-dark p-5"><div className="text-xs uppercase text-text-mute">Pending</div><div className="text-3xl font-bold mt-2 text-warning">${pending}</div></div>
        <div className="card-dark p-5"><div className="text-xs uppercase text-text-mute">Overdue invoices</div><div className="text-3xl font-bold mt-2 text-error">{overdue.length}</div></div>
      </div>

      <div className="card-dark p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">Monthly revenue chart</h3>
          <span className="text-xs text-text-mute">Demonstration series</span>
        </div>
        <BarChart data={monthlyRevenueData.map((d) => ({ label: d.month, value: d.revenue }))} valueFormat={(v) => `$${v.toLocaleString()}`} color="#35B879" />
      </div>

      <div className="flex justify-end">
        <div className="w-48">
          <FilterSelect value={status} onChange={setStatus} options={[
            { value: 'all', label: 'All payments' },
            { value: 'paid', label: 'Paid' },
            { value: 'pending', label: 'Pending' },
            { value: 'overdue', label: 'Overdue' },
          ]} />
        </div>
      </div>

      <div className="card-dark overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-text-mute border-b border-border">
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((p) => (
              <tr key={p.id} className="border-b border-border/50">
                <td className="px-4 py-3 font-semibold">{p.memberName}</td>
                <td className="px-4 py-3">{p.description}<div className="text-xs text-text-mute">{p.date}</div></td>
                <td className="px-4 py-3">${p.amount}</td>
                <td className="px-4 py-3 text-text-mute">{p.method}</td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-3 text-right">
                  {p.status !== 'paid' && <button className="btn-ghost text-xs" onClick={() => setPaymentStatus(p.id, 'paid')}>Mark paid</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card-dark p-6">
        <h3 className="font-bold mb-4">Renewal report</h3>
        <div className="space-y-3">
          {expiring.map((m) => {
            const plan = membershipPlans.find((p) => p.name === m.membershipPlan);
            return (
              <div key={m.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-border/50">
                <div>
                  <div className="text-sm font-semibold">{m.name}</div>
                  <div className="text-xs text-text-mute">{m.membershipPlan} · expires {m.expiryDate} · reminder {plan?.renewalReminderDays || 14} days out</div>
                </div>
                <StatusBadge status={m.membershipStatus} />
              </div>
            );
          })}
          {expiring.length === 0 && <p className="text-sm text-text-mute">No memberships are flagged for renewal follow-up.</p>}
        </div>
      </div>
    </div>
  );
}
