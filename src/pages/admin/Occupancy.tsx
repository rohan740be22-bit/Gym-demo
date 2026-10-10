import { useState } from 'react';
import { useGym, isStaleEntry } from '@/context/GymStore';
import { hourlyOccupancy } from '@/data/mockData';
import { OccupancyIndicator } from '@/components/ui/OccupancyIndicator';
import { BarChart } from '@/components/ui/Charts';
import { StatusBadge } from '@/components/ui/Common';

export default function AdminOccupancy() {
  const {
    members, occupancy, accessEvents, settings, simulateEntry, simulateExit, simulateInvalidScan,
    setAnonymousInside, forceCheckout, clearStaleSessions, setReaderConnected,
  } = useGym();
  const [memberId, setMemberId] = useState(members[0]?.id || '');
  const [headcount, setHeadcount] = useState(String(occupancy.anonymousInside));
  const [message, setMessage] = useState('');
  const [ok, setOk] = useState(true);

  const run = (result: { ok: boolean; message: string }) => {
    setOk(result.ok);
    setMessage(result.message);
  };

  const failed = accessEvents.filter((e) => e.result !== 'granted');
  const peak = [...hourlyOccupancy].sort((a, b) => b.count - a.count)[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-text-light">Attendance & Occupancy</h2>
          <p className="text-sm text-text-mute mt-1">Demonstration desk. Counts are valid entries minus exits, with duplicate and forgotten-exit safeguards. No reader is connected.</p>
        </div>
        <button
          className={settings.readerConnected ? 'btn-secondary' : 'btn-primary'}
          onClick={() => setReaderConnected(!settings.readerConnected)}
        >
          Reader: {settings.readerConnected ? 'Simulated online' : 'Simulated offline'}
        </button>
      </div>

      <OccupancyIndicator />

      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="card-dark p-6 space-y-4">
          <h3 className="text-lg font-bold text-text-light">Simulate a door event</h3>
          <div>
            <label className="input-label">Member</label>
            <select className="input-field" value={memberId} onChange={(e) => setMemberId(e.target.value)}>
              {members.map((m) => <option key={m.id} value={m.id} className="bg-ink-900">{m.name} · {m.membershipStatus}</option>)}
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn-primary" onClick={() => run(simulateEntry(memberId))}>Record entry</button>
            <button className="btn-secondary" onClick={() => run(simulateExit(memberId))}>Record exit</button>
            <button className="btn-secondary" onClick={() => run(simulateInvalidScan())}>Invalid scan</button>
          </div>
          {message && <p className={`text-sm ${ok ? 'text-lime' : 'text-warning'}`}>{message}</p>}
          <div className="pt-4 border-t border-border space-y-3">
            <h4 className="text-sm font-semibold">Manual correction</h4>
            <p className="text-xs text-text-mute">The aggregated headcount stands in for visits that are not tied to a named sample profile. Named visits are listed separately.</p>
            <div className="flex gap-2">
              <input className="input-field" type="number" min={0} value={headcount} onChange={(e) => setHeadcount(e.target.value)} />
              <button className="btn-secondary" onClick={() => run(setAnonymousInside(Number(headcount)))}>Apply</button>
            </div>
            <button className="btn-ghost text-warning" onClick={() => run(clearStaleSessions())}>Clear visits open longer than 12 hours</button>
          </div>
        </div>

        <div className="card-dark p-6">
          <h3 className="text-lg font-bold text-text-light mb-4">Active entry sessions</h3>
          <div className="space-y-3">
            {occupancy.namedInside.map((n) => (
              <div key={n.memberId} className="flex items-center justify-between gap-3 p-3 bg-ink-900 rounded-lg border border-border">
                <div>
                  <div className="text-sm font-semibold">{n.name}</div>
                  <div className="text-xs text-text-mute">Entered {n.enteredAt}</div>
                  {isStaleEntry(n.enteredAt) && <div className="text-xs text-warning mt-1">Open more than 12 hours — possible forgotten exit</div>}
                </div>
                <button className="btn-ghost text-xs" onClick={() => run(forceCheckout(n.memberId))}>Force exit</button>
              </div>
            ))}
            <div className="p-3 bg-ink-900 rounded-lg border border-border text-sm text-text-mute">
              {occupancy.anonymousInside} additional members are included as an aggregated demonstration count.
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card-dark p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Illustrative peak hours</h3>
            <span className="text-xs text-text-mute">Not measured from the door log</span>
          </div>
          <BarChart data={hourlyOccupancy.map((h) => ({ label: h.hour.replace(':00', '').replace(' ', ''), value: h.count }))} height={160} />
          <p className="text-xs text-text-mute mt-4">Sample peak: {peak.hour} · {peak.count} people</p>
        </div>
        <div className="card-dark p-6">
          <h3 className="font-bold mb-3">Failed or invalid scans</h3>
          <div className="text-3xl font-bold text-error">{failed.length}</div>
          <p className="text-xs text-text-mute mt-2">Denied, duplicate, and unrecognized scans in this preview log.</p>
        </div>
      </div>

      <div className="card-dark overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-text-mute border-b border-border">
              <th className="px-4 py-3">Member ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Result</th>
              <th className="px-4 py-3">Note</th>
            </tr>
          </thead>
          <tbody>
            {accessEvents.slice(0, 12).map((e) => (
              <tr key={e.id} className="border-b border-border/50">
                <td className="px-4 py-3 font-medium">{e.memberId}</td>
                <td className="px-4 py-3">{e.memberName}</td>
                <td className="px-4 py-3 capitalize">{e.eventType}</td>
                <td className="px-4 py-3 text-text-mute">{e.timestamp}</td>
                <td className="px-4 py-3"><StatusBadge status={e.result} /></td>
                <td className="px-4 py-3 text-text-mute">{e.note || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
