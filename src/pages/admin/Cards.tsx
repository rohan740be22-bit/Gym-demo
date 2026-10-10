import { useState } from 'react';
import { useGym } from '@/context/GymStore';
import { StatusBadge } from '@/components/ui/Common';
import { Modal } from '@/components/ui/Modal';
import type { MembershipCard } from '@/data/mockData';

export default function AdminCards() {
  const { cards, members, settings, setCardStatus, replaceCard, issueCard, setReaderConnected } = useGym();
  const [notice, setNotice] = useState('');
  const [history, setHistory] = useState<MembershipCard | null>(null);
  const [issueFor, setIssueFor] = useState(members[0]?.id || '');

  const memberName = (id: string) => members.find((m) => m.id === id)?.name || 'Unknown member';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-light">Membership Cards</h2>
          <p className="text-sm text-text-mute mt-1">Card IDs are simulated. Entry validation still requires a backend and a compatible reader.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg border ${settings.readerConnected ? 'text-lime border-lime/30 bg-lime/10' : 'text-warning border-warning/30 bg-warning/10'}`}>
            Reader {settings.readerConnected ? 'simulated online' : 'simulated offline'}
          </span>
          <button className="btn-secondary" onClick={() => setReaderConnected(!settings.readerConnected)}>Toggle reader</button>
        </div>
      </div>
      {notice && <div className="px-4 py-3 rounded-lg border border-lime/30 bg-lime/10 text-sm text-lime">{notice}</div>}

      <div className="card-dark p-5 flex flex-col sm:flex-row gap-3 sm:items-end">
        <div className="flex-1">
          <label className="input-label">Issue card</label>
          <select className="input-field" value={issueFor} onChange={(e) => setIssueFor(e.target.value)}>
            {members.map((m) => <option key={m.id} value={m.id} className="bg-ink-900">{m.name}</option>)}
          </select>
        </div>
        <button className="btn-primary" disabled={!settings.permissions.staffIssueCards} onClick={() => setNotice(settings.permissions.staffIssueCards ? issueCard(issueFor).message : 'Card issuing is turned off in settings.')}>Issue active card</button>
      </div>

      <div className="card-dark overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-text-mute border-b border-border">
              <th className="px-4 py-3">Card ID</th>
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Issued</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((c) => (
              <tr key={c.id} className="border-b border-border/50">
                <td className="px-4 py-3 font-semibold">{c.cardId}</td>
                <td className="px-4 py-3">{memberName(c.memberId)}</td>
                <td className="px-4 py-3 text-text-mute">{c.issuedDate}</td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {c.status === 'active' && <button className="btn-ghost text-xs" onClick={() => { setCardStatus(c.id, 'inactive'); setNotice(`${c.cardId} deactivated.`); }}>Deactivate</button>}
                    {c.status === 'inactive' && <button className="btn-ghost text-xs" onClick={() => { setCardStatus(c.id, 'active'); setNotice(`${c.cardId} activated.`); }}>Activate</button>}
                    {c.status !== 'replaced' && <button className="btn-ghost text-xs" onClick={() => setNotice(replaceCard(c.memberId).message)}>Replace lost card</button>}
                    <button className="btn-ghost text-xs" onClick={() => setHistory(c)}>History</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!history} onClose={() => setHistory(null)} title={history ? `${history.cardId} access history` : 'History'}>
        <div className="space-y-2">
          {history?.accessHistory.length ? history.accessHistory.map((h, i) => (
            <div key={`${h.date}-${i}`} className="flex justify-between text-sm py-2 border-b border-border/50">
              <span className="text-text-mute">{h.date}</span>
              <span>{h.result}</span>
            </div>
          )) : <p className="text-sm text-text-mute">No scans recorded for this card.</p>}
        </div>
      </Modal>
    </div>
  );
}
