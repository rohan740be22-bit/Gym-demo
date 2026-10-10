import { useState } from 'react';
import { useGym, type GymSettings } from '@/context/GymStore';

export default function AdminSettings() {
  const { settings, updateSettings } = useGym();
  const [form, setForm] = useState<GymSettings>(settings);
  const [notice, setNotice] = useState('');

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || form.maxCapacity < 1) {
      setNotice('Gym name and a capacity of at least 1 are required.');
      return;
    }
    updateSettings(form);
    setNotice('Settings saved. The public site, footer, and occupancy limit use these values.');
  };

  const setHour = (index: number, time: string) => {
    setForm({ ...form, hours: form.hours.map((h, i) => (i === index ? { ...h, time } : h)) });
  };

  return (
    <form onSubmit={save} className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-text-light">Club Settings</h2>
        <p className="text-sm text-text-mute mt-1">Identity, hours, capacity, and preview permissions. Authentication on this site is a demo selector, not a security control.</p>
      </div>
      {notice && <div className="px-4 py-3 rounded-lg border border-lime/30 bg-lime/10 text-sm text-lime">{notice}</div>}

      <section className="card-dark p-6 space-y-4">
        <h3 className="font-bold">Identity</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <div><label className="input-label">Gym name</label><input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="input-label">Short name</label><input className="input-field" value={form.shortName} onChange={(e) => setForm({ ...form, shortName: e.target.value })} /></div>
        </div>
        <div><label className="input-label">Address</label><input className="input-field" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div><label className="input-label">Phone</label><input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div><label className="input-label">Email</label><input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        </div>
      </section>

      <section className="card-dark p-6 space-y-4">
        <h3 className="font-bold">Operating hours</h3>
        {form.hours.map((h, i) => (
          <div key={h.day} className="grid sm:grid-cols-[1fr_1fr] gap-3 items-center">
            <span className="text-sm text-text-mute">{h.day}</span>
            <input className="input-field" value={h.time} onChange={(e) => setHour(i, e.target.value)} />
          </div>
        ))}
        <div className="max-w-xs">
          <label className="input-label">Maximum occupancy</label>
          <input type="number" min={1} className="input-field" value={form.maxCapacity} onChange={(e) => setForm({ ...form, maxCapacity: Number(e.target.value) })} />
        </div>
      </section>

      <section className="card-dark p-6 space-y-3">
        <h3 className="font-bold">Role permissions</h3>
        <p className="text-xs text-text-mute">These toggles only affect this preview. They are not an access-control system.</p>
        <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={form.permissions.trainerSeeAllClients} onChange={(e) => setForm({ ...form, permissions: { ...form.permissions, trainerSeeAllClients: e.target.checked } })} /> Trainers can open every client, not only assigned ones</label>
        <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={form.permissions.trainerEditMembership} onChange={(e) => setForm({ ...form, permissions: { ...form.permissions, trainerEditMembership: e.target.checked } })} /> Trainers may change membership status</label>
        <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={form.permissions.staffIssueCards} onChange={(e) => setForm({ ...form, permissions: { ...form.permissions, staffIssueCards: e.target.checked } })} /> Staff may issue replacement cards</label>
      </section>

      <section className="card-dark p-6 space-y-3">
        <h3 className="font-bold">Notification preferences</h3>
        <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={form.notifications.renewals} onChange={(e) => setForm({ ...form, notifications: { ...form.notifications, renewals: e.target.checked } })} /> Renewal reminders</label>
        <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={form.notifications.occupancyAlerts} onChange={(e) => setForm({ ...form, notifications: { ...form.notifications, occupancyAlerts: e.target.checked } })} /> Occupancy alerts</label>
        <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={form.notifications.paymentReminders} onChange={(e) => setForm({ ...form, notifications: { ...form.notifications, paymentReminders: e.target.checked } })} /> Payment reminders</label>
        <p className="text-xs text-text-mute">Preferences are stored for the demo only. No emails are sent.</p>
      </section>

      <section className="card-dark p-6 space-y-2">
        <h3 className="font-bold">Security</h3>
        <p className="text-sm text-text-mute leading-relaxed">Sign-in on this prototype accepts the sample accounts and the role preview buttons. It does not verify identity, store passwords, or protect health data. Connect an authentication provider before any real member information is entered.</p>
      </section>

      <button className="btn-primary">Save settings</button>
    </form>
  );
}
