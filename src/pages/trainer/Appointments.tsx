import { useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useGym, todayIso } from '@/context/GymStore';
import { StatusBadge } from '@/components/ui/Common';
import { Modal } from '@/components/ui/Modal';

const slots = ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];

function mondayOf(date: Date) {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  copy.setHours(12, 0, 0, 0);
  return copy;
}

export default function TrainerAppointments() {
  const { user } = useAuth();
  const trainerId = user?.trainerId || 't1';
  const { clientsForTrainer, sessions, scheduleSession, updateSession, addAssessment, members } = useGym();
  const clients = clientsForTrainer(trainerId);
  const [weekStart, setWeekStart] = useState(() => mondayOf(new Date()));
  const [selected, setSelected] = useState(todayIso());
  const [message, setMessage] = useState('');
  const [ok, setOk] = useState(true);
  const [showBook, setShowBook] = useState(false);
  const [showAssess, setShowAssess] = useState(false);
  const [form, setForm] = useState({ memberId: clients[0]?.id || '', date: todayIso(), time: '10:00 AM', type: 'Strength Session' });
  const [assessment, setAssessment] = useState({ memberId: clients[0]?.id || '', weight: '', bodyFat: '', muscleMass: '', notes: '' });

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  }), [weekStart]);

  const daySessions = sessions.filter((s) => s.trainerId === trainerId && s.date === selected && s.status !== 'cancelled');

  const book = (e: React.FormEvent) => {
    e.preventDefault();
    const result = scheduleSession({ memberId: form.memberId, trainerId, date: form.date, time: form.time, type: form.type });
    setOk(result.ok);
    setMessage(result.message);
    if (result.ok) setShowBook(false);
  };

  const saveAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    const weight = Number(assessment.weight);
    const bodyFat = Number(assessment.bodyFat);
    const muscleMass = Number(assessment.muscleMass);
    if (!assessment.memberId || !weight || !bodyFat || !muscleMass) {
      setOk(false);
      setMessage('Enter weight, body fat, and muscle mass.');
      return;
    }
    addAssessment({ memberId: assessment.memberId, weight, bodyFat, muscleMass, notes: assessment.notes });
    setOk(true);
    setMessage('Assessment saved to the client record and weight history.');
    setShowAssess(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-light">Appointments & Assessments</h2>
          <p className="text-sm text-text-mute mt-1">Book only your assigned clients. Overlapping times are blocked in this preview.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={() => setShowAssess(true)}>New assessment</button>
          <button className="btn-primary" onClick={() => setShowBook(true)}>Schedule session</button>
        </div>
      </div>
      {message && <div className={`px-4 py-3 rounded-lg border text-sm ${ok ? 'border-lime/30 bg-lime/10 text-lime' : 'border-warning/30 bg-warning/10 text-warning'}`}>{message}</div>}

      <div className="card-dark p-4">
        <div className="flex items-center justify-between mb-4">
          <button className="btn-ghost" onClick={() => setWeekStart((d) => { const n = new Date(d); n.setDate(n.getDate() - 7); return n; })}>Previous</button>
          <span className="text-sm font-semibold">{days[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – {days[6].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
          <button className="btn-ghost" onClick={() => setWeekStart((d) => { const n = new Date(d); n.setDate(n.getDate() + 7); return n; })}>Next</button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((d) => {
            const iso = todayIso(d);
            const count = sessions.filter((s) => s.trainerId === trainerId && s.date === iso && s.status !== 'cancelled').length;
            const active = iso === selected;
            return (
              <button key={iso} onClick={() => setSelected(iso)} className={`rounded-lg border p-2 text-center ${active ? 'border-lime bg-lime/10' : 'border-border hover:border-lime/30'}`}>
                <div className="text-[10px] uppercase text-text-mute">{d.toLocaleDateString(undefined, { weekday: 'short' })}</div>
                <div className="text-lg font-bold">{d.getDate()}</div>
                <div className="text-[10px] text-lime">{count ? `${count} booked` : 'Open'}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="card-dark p-6">
        <h3 className="font-bold mb-4">Sessions on {selected}</h3>
        {daySessions.length === 0 && <p className="text-sm text-text-mute">Nothing scheduled. Open slots stay available until you book them.</p>}
        <div className="space-y-3">
          {daySessions.map((s) => {
            const client = members.find((m) => m.id === s.memberId);
            return (
              <div key={s.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-ink-900 rounded-lg border border-border">
                <div>
                  <div className="font-semibold">{s.time} · {s.type}</div>
                  <div className="text-sm text-text-mute">{client?.name || 'Client'}</div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={s.status} />
                  {s.status === 'upcoming' && (
                    <>
                      <button className="btn-ghost text-xs" onClick={() => updateSession(s.id, { status: 'completed' })}>Complete</button>
                      <button className="btn-ghost text-xs text-error" onClick={() => updateSession(s.id, { status: 'cancelled' })}>Cancel</button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal open={showBook} onClose={() => setShowBook(false)} title="Schedule session">
        <form onSubmit={book} className="space-y-4">
          <div>
            <label className="input-label">Client</label>
            <select className="input-field" value={form.memberId} onChange={(e) => setForm({ ...form, memberId: e.target.value })}>
              {clients.map((c) => <option key={c.id} value={c.id} className="bg-ink-900">{c.name}</option>)}
            </select>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="input-label">Date</label><input type="date" className="input-field" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></div>
            <div>
              <label className="input-label">Time</label>
              <select className="input-field" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}>
                {slots.map((slot) => <option key={slot} className="bg-ink-900">{slot}</option>)}
              </select>
            </div>
          </div>
          <div><label className="input-label">Session type</label><input className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required /></div>
          <div className="flex justify-end gap-3"><button type="button" className="btn-secondary" onClick={() => setShowBook(false)}>Close</button><button className="btn-primary">Book</button></div>
        </form>
      </Modal>

      <Modal open={showAssess} onClose={() => setShowAssess(false)} title="Client assessment">
        <form onSubmit={saveAssessment} className="space-y-4">
          <div>
            <label className="input-label">Client</label>
            <select className="input-field" value={assessment.memberId} onChange={(e) => setAssessment({ ...assessment, memberId: e.target.value })}>
              {clients.map((c) => <option key={c.id} value={c.id} className="bg-ink-900">{c.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="input-label">Weight (kg)</label><input className="input-field" value={assessment.weight} onChange={(e) => setAssessment({ ...assessment, weight: e.target.value })} /></div>
            <div><label className="input-label">Body fat %</label><input className="input-field" value={assessment.bodyFat} onChange={(e) => setAssessment({ ...assessment, bodyFat: e.target.value })} /></div>
            <div><label className="input-label">Muscle (kg)</label><input className="input-field" value={assessment.muscleMass} onChange={(e) => setAssessment({ ...assessment, muscleMass: e.target.value })} /></div>
          </div>
          <div><label className="input-label">Progress notes</label><textarea className="input-field min-h-[90px]" value={assessment.notes} onChange={(e) => setAssessment({ ...assessment, notes: e.target.value })} /></div>
          <p className="text-xs text-text-mute">Visible to you and the member's progress history in this preview. Treat it as private training data.</p>
          <div className="flex justify-end gap-3"><button type="button" className="btn-secondary" onClick={() => setShowAssess(false)}>Close</button><button className="btn-primary">Save assessment</button></div>
        </form>
      </Modal>
    </div>
  );
}
