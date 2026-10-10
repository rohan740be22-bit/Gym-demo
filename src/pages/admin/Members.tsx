import { useMemo, useState } from 'react';
import { useGym } from '@/context/GymStore';
import { SearchInput, FilterSelect, StatusBadge, DataTable } from '@/components/ui/Common';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import type { Member } from '@/data/mockData';

const emptyForm = { name: '', email: '', phone: '', plan: 'Performance', trainerId: 't1', goal: '' };

export default function AdminMembers() {
  const { members, trainers, payments, accessEvents, addMember, updateMember, setMembershipStatus } = useGym();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [plan, setPlan] = useState('all');
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [viewing, setViewing] = useState<Member | null>(null);
  const [confirm, setConfirm] = useState<{ id: string; status: Member['membershipStatus'] } | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState({ phone: '', goal: '', emergencyContact: '', trainerId: '' });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const q = search.toLowerCase();
      const matches = !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.membershipNumber.toLowerCase().includes(q);
      const matchesStatus = status === 'all' || m.membershipStatus === status;
      const matchesPlan = plan === 'all' || m.membershipPlan === plan;
      return matches && matchesStatus && matchesPlan;
    });
  }, [members, search, status, plan]);

  const openEdit = (m: Member) => {
    setEditing(m);
    setEditForm({ phone: m.phone, goal: m.goal, emergencyContact: m.emergencyContact, trainerId: m.trainerId });
  };

  const saveNew = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.includes('@') || form.phone.trim().length < 7) {
      setError('Enter a name, valid email, and phone number.');
      return;
    }
    if (members.some((m) => m.email.toLowerCase() === form.email.toLowerCase())) {
      setError('A member with that email is already in the directory.');
      return;
    }
    const created = addMember({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), membershipPlan: form.plan, trainerId: form.trainerId, goal: form.goal || 'General fitness' });
    setNotice(`${created.name} added with card ${created.membershipNumber}. No payment was taken.`);
    setForm(emptyForm);
    setAdding(false);
  };

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    updateMember(editing.id, editForm);
    setNotice(`${editing.name} updated.`);
    setEditing(null);
  };

  const viewingLive = viewing ? members.find((m) => m.id === viewing.id) || viewing : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-light">Member Directory</h2>
          <p className="text-sm text-text-mute mt-1">Sample profiles for this preview. Status changes appear in the member and trainer portals.</p>
        </div>
        <button onClick={() => { setError(''); setAdding(true); }} className="btn-primary">Add Member</button>
      </div>

      {notice && <div className="px-4 py-3 rounded-lg border border-lime/30 bg-lime/10 text-sm text-lime">{notice}</div>}

      <div className="grid md:grid-cols-[1fr_180px_180px] gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search name, email, or member number" />
        <FilterSelect label="Status" value={status} onChange={setStatus} options={[
          { value: 'all', label: 'All statuses' },
          { value: 'Active', label: 'Active' },
          { value: 'Expiring', label: 'Expiring' },
          { value: 'Suspended', label: 'Suspended' },
          { value: 'Inactive', label: 'Inactive' },
        ]} />
        <FilterSelect label="Plan" value={plan} onChange={setPlan} options={[
          { value: 'all', label: 'All plans' },
          { value: 'Essential', label: 'Essential' },
          { value: 'Performance', label: 'Performance' },
          { value: 'Elite', label: 'Elite' },
        ]} />
      </div>

      <div className="card-dark overflow-hidden">
        <DataTable
          data={filtered}
          emptyMessage="No members match those filters."
          columns={[
            { key: 'name', label: 'Member', render: (m) => (
              <div className="flex items-center gap-3">
                <img src={m.profileImage} alt="" className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-xs text-text-mute">{m.membershipNumber}</div>
                </div>
              </div>
            ) },
            { key: 'plan', label: 'Plan', render: (m) => m.membershipPlan },
            { key: 'status', label: 'Status', render: (m) => <StatusBadge status={m.membershipStatus} /> },
            { key: 'expiry', label: 'Expires', render: (m) => m.expiryDate },
            { key: 'trainer', label: 'Trainer', render: (m) => trainers.find((t) => t.id === m.trainerId)?.name || '—' },
            { key: 'actions', label: '', render: (m) => (
              <div className="flex gap-2 justify-end">
                <button className="btn-ghost text-xs" onClick={() => setViewing(m)}>View</button>
                <button className="btn-ghost text-xs" onClick={() => openEdit(m)}>Edit</button>
              </div>
            ) },
          ]}
        />
      </div>

      <Modal open={adding} onClose={() => setAdding(false)} title="Add Member">
        <form onSubmit={saveNew} className="space-y-4">
          <p className="text-xs text-text-mute">Creates a directory record and a simulated card. No payment is processed.</p>
          <div><label className="input-label">Full name</label><input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="input-label">Email</label><input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
            <div><label className="input-label">Phone</label><input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="input-label">Plan</label>
              <select className="input-field" value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}>
                <option className="bg-ink-900">Essential</option>
                <option className="bg-ink-900">Performance</option>
                <option className="bg-ink-900">Elite</option>
              </select>
            </div>
            <div>
              <label className="input-label">Assign trainer</label>
              <select className="input-field" value={form.trainerId} onChange={(e) => setForm({ ...form, trainerId: e.target.value })}>
                {trainers.map((t) => <option key={t.id} value={t.id} className="bg-ink-900">{t.name}</option>)}
              </select>
            </div>
          </div>
          <div><label className="input-label">Fitness goal</label><input className="input-field" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} placeholder="Strength, conditioning, mobility…" /></div>
          {error && <p className="text-sm text-error">{error}</p>}
          <div className="flex justify-end gap-3"><button type="button" className="btn-secondary" onClick={() => setAdding(false)}>Cancel</button><button className="btn-primary" type="submit">Save Member</button></div>
        </form>
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit Member">
        <form onSubmit={saveEdit} className="space-y-4">
          <div><label className="input-label">Phone</label><input className="input-field" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} /></div>
          <div><label className="input-label">Fitness goal</label><input className="input-field" value={editForm.goal} onChange={(e) => setEditForm({ ...editForm, goal: e.target.value })} /></div>
          <div><label className="input-label">Emergency contact</label><input className="input-field" value={editForm.emergencyContact} onChange={(e) => setEditForm({ ...editForm, emergencyContact: e.target.value })} /></div>
          <div>
            <label className="input-label">Assigned trainer</label>
            <select className="input-field" value={editForm.trainerId} onChange={(e) => setEditForm({ ...editForm, trainerId: e.target.value })}>
              {trainers.map((t) => <option key={t.id} value={t.id} className="bg-ink-900">{t.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3"><button type="button" className="btn-secondary" onClick={() => setEditing(null)}>Cancel</button><button className="btn-primary" type="submit">Save Changes</button></div>
        </form>
      </Modal>

      <Modal open={!!viewingLive} onClose={() => setViewing(null)} title={viewingLive?.name || 'Member'} size="lg">
        {viewingLive && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <img src={viewingLive.profileImage} alt="" className="w-16 h-16 rounded-xl object-cover" />
              <div>
                <div className="font-semibold text-text-light">{viewingLive.email}</div>
                <div className="text-sm text-text-mute">{viewingLive.membershipNumber} · {viewingLive.membershipPlan}</div>
                <div className="mt-2"><StatusBadge status={viewingLive.membershipStatus} /></div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-ink-900 rounded-lg border border-border"><div className="text-xs text-text-mute">Expires</div>{viewingLive.expiryDate}</div>
              <div className="p-3 bg-ink-900 rounded-lg border border-border"><div className="text-xs text-text-mute">Weight</div>{viewingLive.weight} kg</div>
              <div className="p-3 bg-ink-900 rounded-lg border border-border sm:col-span-2"><div className="text-xs text-text-mute">Goal</div>{viewingLive.goal}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {(['Active', 'Expiring', 'Suspended', 'Inactive'] as const).map((s) => (
                <button key={s} className="btn-secondary text-xs" onClick={() => setConfirm({ id: viewingLive.id, status: s })}>{s}</button>
              ))}
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Recent access</h4>
              <div className="space-y-2">
                {accessEvents.filter((e) => e.memberName === viewingLive.name).slice(0, 5).map((e) => (
                  <div key={e.id} className="flex justify-between text-sm border-b border-border/50 py-2">
                    <span className="capitalize">{e.eventType} · {e.timestamp}</span>
                    <StatusBadge status={e.result} />
                  </div>
                ))}
                {accessEvents.filter((e) => e.memberName === viewingLive.name).length === 0 && <p className="text-sm text-text-mute">No scans yet.</p>}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Payments</h4>
              {payments.filter((p) => p.memberId === viewingLive.id).map((p) => (
                <div key={p.id} className="flex justify-between text-sm py-2 border-b border-border/50">
                  <span>{p.description}<span className="block text-xs text-text-mute">{p.method}</span></span>
                  <span>${p.amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        title="Change membership status"
        message={confirm ? `Set this membership to ${confirm.status}? Suspended and inactive members are denied at the simulated door.` : ''}
        confirmLabel="Update status"
        danger={confirm?.status === 'Suspended' || confirm?.status === 'Inactive'}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          if (!confirm) return;
          const result = setMembershipStatus(confirm.id, confirm.status);
          setNotice(result.message);
          setConfirm(null);
        }}
      />
    </div>
  );
}
