import { useAuth } from '@/context/AuthContext';
import { useGym } from '@/context/GymStore';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusBadge } from '@/components/ui/Common';
import { ProgressRing } from '@/components/ui/Charts';
import { Link } from 'react-router-dom';

export default function MemberDashboard() {
  const { user } = useAuth();
  const { members, trainers, sessions, assessments, workoutPlans, weightHistory } = useGym();
  const member = members.find((m) => m.id === user?.memberId) || members[0];
  const trainer = trainers.find((t) => t.id === member.trainerId);
  const upcomingSession = sessions.find((s) => s.memberId === member.id && s.status === 'upcoming');
  const latestAssessment = assessments.filter((a) => a.memberId === member.id).slice(-1)[0];
  const workouts = workoutPlans[member.id] || [];
  const completedWorkouts = workouts.filter((w) => w.completed).length;
  const wHistory = weightHistory[member.id] || [];
  const weightChange = wHistory.length >= 2 ? (wHistory[wHistory.length - 1].weight - wHistory[0].weight) : 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-text-light">{greeting}, {member.name.split(' ')[0]}.</h2>
        <p className="text-sm text-text-mute mt-1">Here's your training overview for today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Membership" value={member.membershipPlan} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2 15.09 8.26 22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" /></svg>} />
        <MetricCard label="Current Weight" value={`${member.weight} kg`} trend={weightChange !== 0 ? `${weightChange > 0 ? '+' : ''}${weightChange} kg this quarter` : 'No change'} trendUp={weightChange < 0} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>} />
        <MetricCard label="Expiry Date" value={member.expiryDate} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>} />
        <MetricCard label="Workouts Done" value={`${completedWorkouts}/${workouts.length}`} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card-dark p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-text-light">Upcoming Training Session</h3>
            <StatusBadge status="upcoming" />
          </div>
          {upcomingSession ? (
            <div className="flex items-center gap-4 p-4 bg-ink-900 rounded-lg border border-border">
              <div className="w-12 h-12 bg-lime/10 rounded-lg flex items-center justify-center text-lime">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-text-light">{upcomingSession.type}</div>
                <div className="text-xs text-text-mute mt-0.5">With {trainer?.name} · {upcomingSession.date} at {upcomingSession.time}</div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-text-mute py-4">No upcoming sessions scheduled.</p>
          )}

          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="text-sm font-semibold text-text-light mb-3">Latest Fitness Assessment</h4>
            {latestAssessment ? (
              <div className="grid grid-cols-3 gap-4">
                <div><div className="text-xs text-text-mute">Weight</div><div className="text-lg font-bold text-text-light">{latestAssessment.weight} kg</div></div>
                <div><div className="text-xs text-text-mute">Body Fat</div><div className="text-lg font-bold text-text-light">{latestAssessment.bodyFat}%</div></div>
                <div><div className="text-xs text-text-mute">Muscle Mass</div><div className="text-lg font-bold text-text-light">{latestAssessment.muscleMass} kg</div></div>
              </div>
            ) : <p className="text-sm text-text-mute">No assessments yet.</p>}
          </div>
        </div>

        <div className="card-dark p-6 flex flex-col items-center justify-center">
          <h3 className="text-sm font-semibold text-text-light mb-4 self-start">Weekly Progress</h3>
          <ProgressRing percentage={(completedWorkouts / workouts.length) * 100} value={`${completedWorkouts}/${workouts.length}`} label="Workouts" size={140} />
          <Link to="/member/workout" className="btn-ghost mt-4 text-lime">View Workout Plan →</Link>
        </div>
      </div>

      <div className="card-dark p-6">
        <h3 className="text-lg font-bold text-text-light mb-4">This Week's Workouts</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {workouts.map((w) => (
            <div key={w.day} className={`p-4 rounded-lg border ${w.completed ? 'border-success/30 bg-success/5' : 'border-border bg-ink-900'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-text-light">{w.day}</span>
                {w.completed ? <StatusBadge status="completed" /> : <span className="text-xs text-text-mute">Pending</span>}
              </div>
              <div className="text-xs text-text-mute">{w.focus}</div>
              <div className="text-xs text-text-mute mt-1">{w.duration} · {w.exercises.length} exercises</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
