import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useGym } from '@/context/GymStore';
import { LineChart } from '@/components/ui/Charts';
import { StatusBadge, TabBar } from '@/components/ui/Common';
import { useState } from 'react';

export default function TrainerClientDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { members, trainers, assessments, workoutPlans, weightHistory, dietPlans, sessions, trainerNotes, addTrainerNote, settings } = useGym();
  const client = members.find((m) => m.id === id);
  const [activeTab, setActiveTab] = useState('overview');
  const [note, setNote] = useState('');
  const allowed = settings.permissions.trainerSeeAllClients || client?.trainerId === (user?.trainerId || 't1');

  if (client && !allowed) {
    return (
      <div className="card-dark p-12 text-center">
        <h3 className="text-lg font-semibold text-text-light">This client is not on your roster</h3>
        <p className="text-sm text-text-mute mt-2">Trainers only open assigned clients unless an admin grants broader access.</p>
        <Link to="/trainer/clients" className="btn-secondary mt-4 inline-flex">Back to Clients</Link>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="card-dark p-12 text-center">
        <h3 className="text-lg font-semibold text-text-light">Client Not Found</h3>
        <Link to="/trainer/clients" className="btn-secondary mt-4">Back to Clients</Link>
      </div>
    );
  }

  const trainer = trainers.find((t) => t.id === client.trainerId);
  const clientAssessments = assessments.filter((a) => a.memberId === client.id);
  const clientWorkouts = workoutPlans[client.id] || [];
  const wHistory = weightHistory[client.id] || [];
  const clientDietPlan = dietPlans.find((dp) => dp.memberId === client.id && dp.status === 'published') || dietPlans.find((dp) => dp.memberId === client.id);
  const clientSessions = sessions.filter((s) => s.memberId === client.id);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'assessments', label: 'Assessments' },
    { id: 'workouts', label: 'Workout History' },
    { id: 'diet', label: 'Diet & Preferences' },
    { id: 'notes', label: 'Trainer Notes' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Link to="/trainer/clients" className="text-sm text-text-mute hover:text-lime transition-colors flex items-center gap-1.5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        Back to Clients
      </Link>

      <div className="card-dark p-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <img src={client.profileImage} alt={client.name} className="w-20 h-20 rounded-xl object-cover" />
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-text-light">{client.name}</h2>
              <StatusBadge status={client.membershipStatus} />
            </div>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-text-mute">
              <span>{client.email}</span>
              <span>·</span>
              <span>{client.phone}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              <div><div className="text-xs text-text-mute">Height</div><div className="text-sm font-semibold text-text-light">{client.height}</div></div>
              <div><div className="text-xs text-text-mute">Weight</div><div className="text-sm font-semibold text-text-light">{client.weight} kg</div></div>
              <div><div className="text-xs text-text-mute">DOB</div><div className="text-sm font-semibold text-text-light">{client.dob}</div></div>
              <div><div className="text-xs text-text-mute">Goal</div><div className="text-sm font-semibold text-text-light">{client.goal}</div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === tab.id ? 'text-lime border-lime' : 'text-text-mute border-transparent hover:text-text-light'}`}
          >{tab.label}</button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card-dark p-6">
            <h3 className="text-lg font-bold text-text-light mb-4">Weight History</h3>
            {wHistory.length > 0 ? (
              <LineChart data={wHistory.map((w) => ({ label: w.date.slice(5), value: w.weight }))} height={200} />
            ) : <p className="text-sm text-text-mute py-8 text-center">No weight data recorded.</p>}
          </div>
          <div className="card-dark p-6">
            <h3 className="text-lg font-bold text-text-light mb-4">Latest Assessment</h3>
            {clientAssessments.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-ink-900 rounded-lg border border-border text-center">
                  <div className="text-xs text-text-mute uppercase">Weight</div>
                  <div className="text-2xl font-bold text-text-light mt-1">{clientAssessments[clientAssessments.length - 1].weight} kg</div>
                </div>
                <div className="p-4 bg-ink-900 rounded-lg border border-border text-center">
                  <div className="text-xs text-text-mute uppercase">Body Fat</div>
                  <div className="text-2xl font-bold text-text-light mt-1">{clientAssessments[clientAssessments.length - 1].bodyFat}%</div>
                </div>
                <div className="p-4 bg-ink-900 rounded-lg border border-border text-center">
                  <div className="text-xs text-text-mute uppercase">Muscle</div>
                  <div className="text-2xl font-bold text-text-light mt-1">{clientAssessments[clientAssessments.length - 1].muscleMass} kg</div>
                </div>
              </div>
            ) : <p className="text-sm text-text-mute py-8 text-center">No assessments yet.</p>}
            <div className="mt-4 pt-4 border-t border-border">
              <h4 className="text-xs font-semibold uppercase text-text-mute mb-2">Upcoming Sessions</h4>
              {clientSessions.filter((s) => s.status === 'upcoming').map((s) => (
                <div key={s.id} className="text-sm text-text-light">{s.date} at {s.time} — {s.type}</div>
              ))}
              {clientSessions.filter((s) => s.status === 'upcoming').length === 0 && <div className="text-sm text-text-mute">None scheduled.</div>}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'assessments' && (
        <div className="card-dark p-6">
          <h3 className="text-lg font-bold text-text-light mb-4">Assessment Records</h3>
          <div className="space-y-3">
            {clientAssessments.length > 0 ? clientAssessments.map((a) => (
              <div key={a.id} className="p-4 bg-ink-900 rounded-lg border border-border">
                <div className="text-sm font-semibold text-text-light mb-3">{a.date}</div>
                <div className="grid grid-cols-3 gap-4">
                  <div><div className="text-xs text-text-mute">Weight</div><div className="text-lg font-bold text-text-light">{a.weight} kg</div></div>
                  <div><div className="text-xs text-text-mute">Body Fat</div><div className="text-lg font-bold text-text-light">{a.bodyFat}%</div></div>
                  <div><div className="text-xs text-text-mute">Muscle Mass</div><div className="text-lg font-bold text-text-light">{a.muscleMass} kg</div></div>
                </div>
                {a.notes && <p className="text-xs text-text-mute mt-3 pt-3 border-t border-border">{a.notes}</p>}
              </div>
            )) : <p className="text-sm text-text-mute text-center py-8">No assessments recorded.</p>}
          </div>
        </div>
      )}

      {activeTab === 'workouts' && (
        <div className="card-dark p-6">
          <h3 className="text-lg font-bold text-text-light mb-4">Workout History</h3>
          <div className="space-y-3">
            {clientWorkouts.map((w) => (
              <div key={w.day} className="p-4 bg-ink-900 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-text-light">{w.day} — {w.focus}</span>
                  {w.completed ? <StatusBadge status="completed" /> : <span className="text-xs text-text-mute">Pending</span>}
                </div>
                <div className="text-xs text-text-mute">{w.duration} · {w.exercises.length} exercises</div>
              </div>
            ))}
            {clientWorkouts.length === 0 && <p className="text-sm text-text-mute text-center py-8">No workouts assigned.</p>}
          </div>
        </div>
      )}

      {activeTab === 'diet' && (
        <div className="space-y-4">
          <div className="card-dark p-6">
            <h3 className="text-lg font-bold text-text-light mb-4">Dietary Preferences & Allergies</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><div className="text-xs text-text-mute uppercase">Preferences</div><div className="text-sm text-text-light mt-1">{client.dietaryPrefs}</div></div>
              <div><div className="text-xs text-text-mute uppercase">Allergies</div><div className="text-sm text-text-light mt-1">{client.allergies}</div></div>
            </div>
          </div>
          {clientDietPlan && (
            <div className="card-dark p-6">
              <h3 className="text-lg font-bold text-text-light mb-4">Current Diet Plan: {clientDietPlan.planName}</h3>
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center p-3 bg-ink-900 rounded-lg border border-border"><div className="text-lg font-bold text-lime">{clientDietPlan.dailyCalories}</div><div className="text-xs text-text-mute">Calories</div></div>
                <div className="text-center p-3 bg-ink-900 rounded-lg border border-border"><div className="text-lg font-bold text-text-light">{clientDietPlan.proteinTarget}g</div><div className="text-xs text-text-mute">Protein</div></div>
                <div className="text-center p-3 bg-ink-900 rounded-lg border border-border"><div className="text-lg font-bold text-text-light">{clientDietPlan.carbsTarget}g</div><div className="text-xs text-text-mute">Carbs</div></div>
                <div className="text-center p-3 bg-ink-900 rounded-lg border border-border"><div className="text-lg font-bold text-text-light">{clientDietPlan.fatsTarget}g</div><div className="text-xs text-text-mute">Fats</div></div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="card-dark p-6">
          <h3 className="text-lg font-bold text-text-light mb-4">Trainer Notes</h3>
          <div className="space-y-3 mb-4">
            {trainerNotes.filter((n) => n.memberId === client.id).map((n) => (
              <div key={n.id} className="p-3 bg-ink-900 rounded-lg border border-border">
                <div className="text-xs text-text-mute">{n.date}</div>
                <p className="text-sm text-text-light mt-1">{n.note}</p>
              </div>
            ))}
          </div>
          <textarea className="input-field min-h-[140px] resize-y" placeholder="Add progress notes for this client..." value={note} onChange={(e) => setNote(e.target.value)} />
          <button className="btn-primary mt-4" onClick={() => { if (!note.trim()) return; addTrainerNote({ memberId: client.id, trainerId: user?.trainerId || 't1', note: note.trim() }); setNote(''); }}>Save Notes</button>
        </div>
      )}
    </div>
  );
}
