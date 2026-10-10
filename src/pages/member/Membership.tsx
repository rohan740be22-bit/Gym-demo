import { useAuth } from '@/context/AuthContext';
import { useGym } from '@/context/GymStore';
import { StatusBadge, DataTable } from '@/components/ui/Common';

export default function MemberMembership() {
  const { user } = useAuth();
  const { members, payments, accessEvents, settings } = useGym();
  const member = members.find((m) => m.id === user?.memberId) || members[0];
  const memberPayments = payments.filter((p) => p.memberId === member.id);
  const memberAccess = accessEvents.filter((e) => e.memberName === member.name);

  // Generate attendance calendar (mock — last 30 days)
  const calendarDays = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const checkedIn = [2, 4, 5, 7, 9, 11, 14, 16, 18, 21, 23, 25, 28].includes(day);
    return { day, checkedIn };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-text-light">Membership & Attendance</h2>
        <p className="text-sm text-text-mute mt-1">Manage your membership, view payment history, and track gym visits.</p>
      </div>

      {/* Digital Membership Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ink-700 to-ink-900 border border-border p-6 lg:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-lime/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex flex-col lg:flex-row justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-8 h-8 bg-lime rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111315" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.4 14.4L9.6 9.6" /><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" /></svg>
              </div>
              <span className="font-bold text-sm tracking-wide text-text-light">{settings.name}</span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-text-mute uppercase tracking-wide">Member</div>
                <div className="text-xl font-bold text-text-light mt-0.5">{member.name}</div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-xs text-text-mute uppercase tracking-wide">Membership #</div>
                  <div className="text-sm font-semibold text-text-light mt-0.5">{member.membershipNumber}</div>
                </div>
                <div>
                  <div className="text-xs text-text-mute uppercase tracking-wide">Tier</div>
                  <div className="text-sm font-semibold text-lime mt-0.5">{member.membershipPlan}</div>
                </div>
                <div>
                  <div className="text-xs text-text-mute uppercase tracking-wide">Valid Until</div>
                  <div className="text-sm font-semibold text-text-light mt-0.5">{member.expiryDate}</div>
                </div>
                <div>
                  <div className="text-xs text-text-mute uppercase tracking-wide">Status</div>
                  <div className="mt-0.5"><StatusBadge status={member.membershipStatus} /></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-end gap-3">
            <div className="w-28 h-28 bg-text-light rounded-lg p-2 flex items-center justify-center">
              {/* Simulated QR code */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect width="100" height="100" fill="#F8F8F6" />
                {Array.from({ length: 12 }, (_, r) =>
                  Array.from({ length: 12 }, (_, c) => {
                    const seed = (r * 7 + c * 13 + r * c) % 3;
                    return seed === 0 ? <rect key={`${r}-${c}`} x={c * 8 + 2} y={r * 8 + 2} width="7" height="7" fill="#111315" /> : null;
                  })
                )}
                <rect x="2" y="2" width="22" height="22" fill="none" stroke="#111315" strokeWidth="3" />
                <rect x="76" y="2" width="22" height="22" fill="none" stroke="#111315" strokeWidth="3" />
                <rect x="2" y="76" width="22" height="22" fill="none" stroke="#111315" strokeWidth="3" />
                <rect x="8" y="8" width="10" height="10" fill="#111315" />
                <rect x="82" y="8" width="10" height="10" fill="#111315" />
                <rect x="8" y="82" width="10" height="10" fill="#111315" />
              </svg>
            </div>
            <span className="text-[10px] text-text-mute text-center max-w-[140px]">Simulated QR code. Entry checks need a connected reader and backend.</span>
          </div>
        </div>
      </div>

      {/* Membership details */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card-dark p-6">
          <h3 className="text-lg font-bold text-text-light mb-4">Membership Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-text-mute">Plan</span><span className="text-text-light font-semibold">{member.membershipPlan}</span></div>
            <div className="flex justify-between text-sm"><span className="text-text-mute">Joined</span><span className="text-text-light font-semibold">{member.joinDate}</span></div>
            <div className="flex justify-between text-sm"><span className="text-text-mute">Valid Until</span><span className="text-text-light font-semibold">{member.expiryDate}</span></div>
            <div className="flex justify-between text-sm"><span className="text-text-mute">Status</span><StatusBadge status={member.membershipStatus} /></div>
            <div className="flex justify-between text-sm"><span className="text-text-mute">Renewal</span><span className="text-lime font-semibold">Auto-renew enabled</span></div>
          </div>
          <button className="btn-secondary w-full mt-6">Manage Renewal</button>
        </div>

        <div className="card-dark p-6">
          <h3 className="text-lg font-bold text-text-light mb-4">Payment History</h3>
          <div className="space-y-3">
            {memberPayments.length > 0 ? memberPayments.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div>
                  <div className="text-sm font-semibold text-text-light">{p.description}</div>
                  <div className="text-xs text-text-mute">{p.date} · {p.method}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-text-light">${p.amount}</div>
                  <StatusBadge status={p.status} />
                </div>
              </div>
            )) : <p className="text-sm text-text-mute">No payment records.</p>}
          </div>
        </div>
      </div>

      {/* Attendance calendar */}
      <div className="card-dark p-6">
        <h3 className="text-lg font-bold text-text-light mb-4">Attendance Calendar — October 2026</h3>
        <div className="grid grid-cols-7 sm:grid-cols-10 gap-2">
          {calendarDays.map((d) => (
            <div
              key={d.day}
              className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium ${d.checkedIn ? 'bg-lime/15 text-lime border border-lime/20' : 'bg-ink-900 text-text-mute border border-border'}`}
              title={d.checkedIn ? 'Checked in' : 'No visit'}
            >
              {d.day}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-text-mute">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-lime/15 border border-lime/20 rounded" /> Checked in</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-ink-900 border border-border rounded" /> No visit</span>
          <span className="ml-auto">{calendarDays.filter((d) => d.checkedIn).length} visits this month</span>
        </div>
      </div>

      {/* Recent check-ins */}
      <div className="card-dark p-6">
        <h3 className="text-lg font-bold text-text-light mb-4">Recent Check-in / Check-out Records</h3>
        <DataTable
          columns={[
            { key: 'eventType', label: 'Type', render: (r) => <span className="capitalize">{r.eventType}</span> },
            { key: 'timestamp', label: 'Timestamp' },
            { key: 'result', label: 'Result', render: (r) => <StatusBadge status={r.result} /> },
          ]}
          data={memberAccess.map((e) => ({ ...e, id: e.id }))}
          emptyMessage="No access events recorded."
        />
      </div>
    </div>
  );
}
