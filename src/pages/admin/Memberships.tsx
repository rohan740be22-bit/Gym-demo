import { useState } from 'react';
import { useGym } from '@/context/GymStore';
import type { MembershipPlan } from '@/data/mockData';

export default function AdminMemberships() {
  const { membershipPlans, updatePlan, members } = useGym();
  const [drafts, setDrafts] = useState<Record<string, MembershipPlan>>({});
  const [notice, setNotice] = useState('');

  const current = (plan: MembershipPlan) => drafts[plan.id] || plan;

  const patch = (plan: MembershipPlan, partial: Partial<MembershipPlan>) => {
    setDrafts((prev) => ({ ...prev, [plan.id]: { ...current(plan), ...partial } }));
  };

  const save = (id: string) => {
    const draft = drafts[id];
    if (!draft) return;
    const benefits = draft.benefits.map((b) => b.trim()).filter(Boolean);
    if (!draft.name.trim() || draft.price < 0 || benefits.length === 0) {
      setNotice('Each plan needs a name, a price, and at least one benefit.');
      return;
    }
    updatePlan(id, { ...draft, benefits });
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setNotice('Plan saved. The public membership page uses this copy. Payments are not processed.');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-text-light">Membership Plans</h2>
        <p className="text-sm text-text-mute mt-1">Pricing and benefits shown on the website. This preview does not charge cards.</p>
      </div>
      {notice && <div className="px-4 py-3 rounded-lg border border-lime/30 bg-lime/10 text-sm text-lime">{notice}</div>}
      <div className="grid xl:grid-cols-3 gap-4">
        {membershipPlans.map((plan) => {
          const d = current(plan);
          const holders = members.filter((m) => m.membershipPlan === plan.name).length;
          return (
            <form key={plan.id} className={`card-dark p-5 space-y-3 ${d.recommended ? 'border-lime/40' : ''}`} onSubmit={(e) => { e.preventDefault(); save(plan.id); }}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-text-light">{plan.name}</h3>
                <span className="text-xs text-text-mute">{holders} in directory</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="input-label">Monthly price</label><input type="number" min={0} className="input-field" value={d.price} onChange={(e) => patch(plan, { price: Number(e.target.value) })} /></div>
                <div><label className="input-label">Duration label</label><input className="input-field" value={d.duration} onChange={(e) => patch(plan, { duration: e.target.value })} /></div>
              </div>
              <div><label className="input-label">Description</label><textarea className="input-field min-h-[72px]" value={d.description} onChange={(e) => patch(plan, { description: e.target.value })} /></div>
              <div><label className="input-label">Benefits, one per line</label><textarea className="input-field min-h-[120px]" value={d.benefits.join('\n')} onChange={(e) => patch(plan, { benefits: e.target.value.split('\n') })} /></div>
              <div><label className="input-label">Access note</label><input className="input-field" value={d.accessNote || ''} onChange={(e) => patch(plan, { accessNote: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="input-label">Renewal reminder (days)</label><input type="number" min={1} className="input-field" value={d.renewalReminderDays || 14} onChange={(e) => patch(plan, { renewalReminderDays: Number(e.target.value) })} /></div>
                <label className="flex items-end gap-2 text-sm pb-2"><input type="checkbox" checked={d.active !== false} onChange={(e) => patch(plan, { active: e.target.checked })} /> Visible on site</label>
              </div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!d.recommended} onChange={(e) => patch(plan, { recommended: e.target.checked })} /> Recommended plan</label>
              <button className="btn-primary w-full" type="submit" disabled={!drafts[plan.id]}>Save plan</button>
            </form>
          );
        })}
      </div>
    </div>
  );
}
