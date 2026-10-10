import { useAuth } from '@/context/AuthContext';
import { useGym, todayIso } from '@/context/GymStore';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusBadge } from '@/components/ui/Common';
import { Link } from 'react-router-dom';

export default function TrainerDashboard() {
  const { user } = useAuth();
  const { members, sessions, assessments, dietPlans, trainers, clientsForTrainer, accessEvents } = useGym();
  const trainerId = user?.trainerId || 't1';
  const trainerProfile = trainers.find((t) => t.id === trainerId);
  const myClients = clientsForTrainer(trainerId);
  const checkedInToday = accessEvents.filter((e) => e.eventType === 'entry' && e.result === 'granted' && e.timestamp.startsWith(todayIso()) && myClients.some((c) => c.name === e.memberName)).length;
  const mySessions = sessions.filter((s) => s.trainerId === trainerId && s.status === 'upcoming');
  const myDietPlans = dietPlans.filter((dp) => dp.trainerId === trainerId);
  const pendingAssessments = myClients.filter((c) => {
    const lastAssessment = assessments.filter((a) => a.memberId === c.id).slice(-1)[0];
    return !lastAssessment || new Date(lastAssessment.date) < new Date('2025-09-01');
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-text-light">Welcome back, {user?.name?.split(' ')[0]}.</h2>
        <p className="text-sm text-text-mute mt-1">{trainerProfile?.specialization}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Assigned Clients" value={myClients.length} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4" /><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /></svg>} />
        <MetricCard label="Checked In Today" value={checkedInToday} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 3h6v6M10 14L21 3M21 14v7H3V3h7" /></svg>} />
        <MetricCard label="Upcoming Sessions" value={mySessions.length} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>} />
        <MetricCard label="Pending Assessments" value={pendingAssessments.length} variant="accent" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-text-light">Upcoming Sessions</h3>
            <Link to="/trainer/appointments" className="text-xs text-lime hover:underline">View Calendar →</Link>
          </div>
          <div className="space-y-3">
            {mySessions.length > 0 ? mySessions.map((s) => {
              const client = members.find((m) => m.id === s.memberId);
              return (
                <div key={s.id} className="flex items-center gap-4 p-3 bg-ink-900 rounded-lg border border-border">
                  <div className="w-10 h-10 bg-lime/10 rounded-lg flex items-center justify-center text-lime">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-text-light">{s.type}</div>
                    <div className="text-xs text-text-mute">{client?.name} · {s.date} at {s.time}</div>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
              );
            }) : <p className="text-sm text-text-mute py-4 text-center">No upcoming sessions.</p>}
          </div>
        </div>

        <div className="card-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-text-light">Clients Needing Reviews</h3>
            <Link to="/trainer/clients" className="text-xs text-lime hover:underline">View All →</Link>
          </div>
          <div className="space-y-3">
            {pendingAssessments.length > 0 ? pendingAssessments.map((c) => (
              <div key={c.id} className="flex items-center gap-4 p-3 bg-ink-900 rounded-lg border border-border">
                <img src={c.profileImage} alt={c.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-text-light">{c.name}</div>
                  <div className="text-xs text-text-mute">{c.goal}</div>
                </div>
                <Link to={`/trainer/clients/${c.id}`} className="text-xs text-lime hover:underline">Review →</Link>
              </div>
            )) : <p className="text-sm text-text-mute py-4 text-center">All clients reviewed.</p>}
          </div>
        </div>
      </div>

      <div className="card-dark p-6">
        <h3 className="text-lg font-bold text-text-light mb-4">Recently Updated Plans</h3>
        <div className="space-y-3">
          {myDietPlans.map((dp) => {
            const client = members.find((m) => m.id === dp.memberId);
            return (
              <div key={dp.id} className="flex items-center justify-between p-3 bg-ink-900 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <img src={client?.profileImage} alt={client?.name} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <div className="text-sm font-semibold text-text-light">{dp.planName}</div>
                    <div className="text-xs text-text-mute">{client?.name} · Updated {dp.lastUpdated}</div>
                  </div>
                </div>
                <StatusBadge status={dp.status} />
              </div>
            );
          })}
          {myDietPlans.length === 0 && <p className="text-sm text-text-mute py-4 text-center">No plans created yet.</p>}
        </div>
      </div>
    </div>
  );
}
