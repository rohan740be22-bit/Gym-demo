import { useState } from 'react';
import { useGym } from '@/context/GymStore';
import { Modal } from '@/components/ui/Modal';
import type { TrainerProfile } from '@/data/mockData';

const blank = {
  name: '',
  specialization: '',
  category: 'Strength Training',
  certifications: '',
  experience: '5',
  bio: '',
  hours: '6:00 AM – 2:00 PM',
};

export default function AdminTrainers() {
  const { trainers, members, addTrainer, updateTrainer, updateMember } = useGym();
  const [editing, setEditing] = useState<TrainerProfile | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(blank);
  const [edit, setEdit] = useState({ specialization: '', category: '', bio: '', hours: '', certs: '' });
  const [assign, setAssign] = useState<string[]>([]);
  const [notice, setNotice] = useState('');

  const open = (t: TrainerProfile) => {
    setEditing(t);
    setEdit({
      specialization: t.specialization,
      category: t.category,
      bio: t.bio,
      hours: t.workingHours[0]?.hours || '',
      certs: t.certifications.join(', '),
    });
    setAssign(members.filter((m) => m.trainerId === t.id).map((m) => m.id));
  };

  const saveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.specialization.trim()) return;
    const created = addTrainer({
      name: form.name.trim(),
      specialization: form.specialization.trim(),
      category: form.category,
      certifications: form.certifications.split(',').map((c) => c.trim()).filter(Boolean),
      experience: Number(form.experience) || 1,
      bio: form.bio || 'Sample profile — replace with the coach biography.',
      workingHours: [
        { day: 'Mon–Thu', hours: form.hours },
        { day: 'Fri', hours: 'By appointment' },
        { day: 'Sat–Sun', hours: 'Off' },
      ],
    });
    setNotice(`${created.name} added to the coaching roster.`);
    setForm(blank);
    setAdding(false);
  };

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    updateTrainer(editing.id, {
      specialization: edit.specialization,
      category: edit.category,
      bio: edit.bio,
      certifications: edit.certs.split(',').map((c) => c.trim()).filter(Boolean),
      workingHours: [
        { day: 'Mon–Thu', hours: edit.hours },
        { day: editing.workingHours[1]?.day || 'Fri', hours: editing.workingHours[1]?.hours || 'By appointment' },
        { day: editing.workingHours[2]?.day || 'Sat–Sun', hours: editing.workingHours[2]?.hours || 'Off' },
      ],
    });
    members.forEach((m) => {
      const should = assign.includes(m.id);
      if (should && m.trainerId !== editing.id) updateMember(m.id, { trainerId: editing.id });
      if (!should && m.trainerId === editing.id) updateMember(m.id, { trainerId: trainers.find((t) => t.id !== editing.id)?.id || editing.id });
    });
    setNotice(`${editing.name} updated. Client assignments are live in the trainer portal.`);
    setEditing(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-light">Trainer Management</h2>
          <p className="text-sm text-text-mute mt-1">Fictional coaches used across the public site and portals. Replace them before launch.</p>
        </div>
        <button className="btn-primary" onClick={() => setAdding(true)}>Add Trainer</button>
      </div>
      {notice && <div className="px-4 py-3 rounded-lg border border-lime/30 bg-lime/10 text-sm text-lime">{notice}</div>}

      <div className="grid md:grid-cols-2 gap-4">
        {trainers.map((t) => {
          const count = members.filter((m) => m.trainerId === t.id).length;
          return (
            <article key={t.id} className="card-dark p-5 flex gap-4">
              <img src={t.image} alt={t.alt} className="w-20 h-24 object-cover rounded-lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-text-light">{t.name}</h3>
                    <p className="text-sm text-lime">{t.specialization}</p>
                  </div>
                  <button className="btn-ghost text-xs" onClick={() => open(t)}>Edit</button>
                </div>
                <p className="text-xs text-text-mute mt-2">{t.certifications.join(' · ')} · {t.experience} yrs</p>
                <p className="text-xs text-text-mute mt-2">{t.workingHours.map((h) => `${h.day} ${h.hours}`).join(' · ')}</p>
                <p className="text-sm text-text-light mt-3">{count} assigned client{count === 1 ? '' : 's'}</p>
              </div>
            </article>
          );
        })}
      </div>

      <Modal open={adding} onClose={() => setAdding(false)} title="Add Trainer">
        <form onSubmit={saveNew} className="space-y-4">
          <div><label className="input-label">Name</label><input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="input-label">Specialization</label><input className="input-field" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} required /></div>
            <div>
              <label className="input-label">Category</label>
              <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {['Strength Training', 'Weight Management', 'Functional Fitness', 'Mobility'].map((c) => <option key={c} className="bg-ink-900">{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="input-label">Certifications</label><input className="input-field" value={form.certifications} onChange={(e) => setForm({ ...form, certifications: e.target.value })} placeholder="CSCS, PN1" /></div>
            <div><label className="input-label">Years</label><input className="input-field" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} /></div>
          </div>
          <div><label className="input-label">Weekday hours</label><input className="input-field" value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} /></div>
          <div><label className="input-label">Biography</label><textarea className="input-field min-h-[80px]" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
          <div className="flex justify-end gap-3"><button type="button" className="btn-secondary" onClick={() => setAdding(false)}>Cancel</button><button className="btn-primary">Save Trainer</button></div>
        </form>
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing ? `Edit ${editing.name}` : 'Edit'} size="lg">
        <form onSubmit={saveEdit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="input-label">Specialization</label><input className="input-field" value={edit.specialization} onChange={(e) => setEdit({ ...edit, specialization: e.target.value })} /></div>
            <div><label className="input-label">Category</label><input className="input-field" value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value })} /></div>
          </div>
          <div><label className="input-label">Certifications</label><input className="input-field" value={edit.certs} onChange={(e) => setEdit({ ...edit, certs: e.target.value })} /></div>
          <div><label className="input-label">Weekday hours</label><input className="input-field" value={edit.hours} onChange={(e) => setEdit({ ...edit, hours: e.target.value })} /></div>
          <div><label className="input-label">Biography</label><textarea className="input-field min-h-[80px]" value={edit.bio} onChange={(e) => setEdit({ ...edit, bio: e.target.value })} /></div>
          <fieldset>
            <legend className="input-label">Assigned members</legend>
            <div className="grid sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {members.map((m) => (
                <label key={m.id} className="flex items-center gap-2 text-sm text-text-light px-3 py-2 border border-border rounded-lg">
                  <input
                    type="checkbox"
                    checked={assign.includes(m.id)}
                    onChange={(e) => setAssign((prev) => e.target.checked ? [...prev, m.id] : prev.filter((id) => id !== m.id))}
                  />
                  {m.name}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="flex justify-end gap-3"><button type="button" className="btn-secondary" onClick={() => setEditing(null)}>Cancel</button><button className="btn-primary">Save</button></div>
        </form>
      </Modal>
    </div>
  );
}
