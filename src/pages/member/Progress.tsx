import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { milestones } from '@/data/mockData';
import { useGym } from '@/context/GymStore';
import { LineChart, BarChart, ProgressRing } from '@/components/ui/Charts';
import { StatusBadge } from '@/components/ui/Common';

const dateRanges = ['7 days', '30 days', '90 days'];

export default function MemberProgress() {
  const { user } = useAuth();
  const { weightHistory, assessments, workoutPlans } = useGym();
  const memberId = user?.memberId || 'm1';
  const [range, setRange] = useState('30 days');
  const [activeTab, setActiveTab] = useState('weight');

  const wHistory = weightHistory[memberId] || [];
  const workouts = workoutPlans[memberId] || [];
  const completedWorkouts = workouts.filter((w) => w.completed).length;
  const memberAssessments = assessments.filter((a) => a.memberId === memberId);

  const weightData = wHistory.map((w) => ({ label: w.date.slice(5), value: w.weight }));
  const workoutData = workouts.map((w) => ({ label: w.day.slice(0, 3), value: w.completed ? 1 : 0 }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-light">Fitness Progress</h2>
          <p className="text-sm text-text-mute mt-1">Track your journey over time. Illustrative demo data.</p>
        </div>
        <div className="flex gap-1 p-1 bg-ink-800 border border-border rounded-lg">
          {dateRanges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${range === r ? 'bg-lime text-ink-900' : 'text-text-mute hover:text-text-light'}`}
            >{r}</button>
          ))}
        </div>
      </div>

      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {[
          { id: 'weight', label: 'Weight History' },
          { id: 'assessments', label: 'Assessments' },
          { id: 'milestones', label: 'Milestones' },
          { id: 'workouts', label: 'Workout Stats' },
          { id: 'photos', label: 'Photos' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === tab.id ? 'text-lime border-lime' : 'text-text-mute border-transparent hover:text-text-light'}`}
          >{tab.label}</button>
        ))}
      </div>

      {activeTab === 'weight' && (
        <div className="card-dark p-6">
          <h3 className="text-lg font-bold text-text-light mb-1">Weight History</h3>
          <p className="text-xs text-text-mute mb-6">Showing data for {range.toLowerCase()}</p>
          {weightData.length > 0 ? (
            <LineChart data={weightData} height={250} />
          ) : (
            <p className="text-sm text-text-mute py-8 text-center">No weight data available for this period.</p>
          )}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
            <div>
              <div className="text-xs text-text-mute uppercase">Starting</div>
              <div className="text-xl font-bold text-text-light mt-1">{wHistory[0]?.weight || '—'} kg</div>
            </div>
            <div>
              <div className="text-xs text-text-mute uppercase">Current</div>
              <div className="text-xl font-bold text-lime mt-1">{wHistory[wHistory.length - 1]?.weight || '—'} kg</div>
            </div>
            <div>
              <div className="text-xs text-text-mute uppercase">Change</div>
              <div className="text-xl font-bold text-text-light mt-1">
                {wHistory.length >= 2 ? `${wHistory[wHistory.length - 1].weight - wHistory[0].weight > 0 ? '+' : ''}${wHistory[wHistory.length - 1].weight - wHistory[0].weight} kg` : '—'}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'assessments' && (
        <div className="card-dark p-6">
          <h3 className="text-lg font-bold text-text-light mb-4">Fitness Assessment History</h3>
          <div className="space-y-3">
            {memberAssessments.length > 0 ? memberAssessments.map((a) => (
              <div key={a.id} className="p-4 bg-ink-900 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-text-light">{a.date}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div><div className="text-xs text-text-mute">Weight</div><div className="text-lg font-bold text-text-light">{a.weight} kg</div></div>
                  <div><div className="text-xs text-text-mute">Body Fat</div><div className="text-lg font-bold text-text-light">{a.bodyFat}%</div></div>
                  <div><div className="text-xs text-text-mute">Muscle Mass</div><div className="text-lg font-bold text-text-light">{a.muscleMass} kg</div></div>
                </div>
                {a.notes && <p className="text-xs text-text-mute mt-3 pt-3 border-t border-border">{a.notes}</p>}
              </div>
            )) : <p className="text-sm text-text-mute text-center py-8">No assessments recorded yet.</p>}
          </div>
        </div>
      )}

      {activeTab === 'milestones' && (
        <div className="card-dark p-6">
          <h3 className="text-lg font-bold text-text-light mb-4">Progress Milestones</h3>
          <div className="space-y-4">
            {milestones.map((ms) => (
              <div key={ms.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-lime rounded-full" />
                  <div className="w-px h-full bg-border min-h-[40px]" />
                </div>
                <div className="pb-4">
                  <div className="text-sm font-semibold text-text-light">{ms.title}</div>
                  <div className="text-xs text-text-mute mt-0.5">{ms.date}</div>
                  <div className="text-xs text-text-mute mt-1">{ms.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'workouts' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="card-dark p-6 flex flex-col items-center justify-center">
            <h3 className="text-sm font-semibold text-text-light mb-4 self-start">Completion Rate</h3>
            <ProgressRing percentage={workouts.length > 0 ? (completedWorkouts / workouts.length) * 100 : 0} value={`${completedWorkouts}/${workouts.length}`} label="Completed" size={140} />
          </div>
          <div className="card-dark p-6 lg:col-span-2">
            <h3 className="text-lg font-bold text-text-light mb-4">Weekly Workout Completion</h3>
            <BarChart data={workoutData.map((w) => ({ label: w.label, value: w.value }))} height={200} />
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
              <div><div className="text-xs text-text-mute uppercase">Total Workouts</div><div className="text-xl font-bold text-text-light mt-1">{workouts.length}</div></div>
              <div><div className="text-xs text-text-mute uppercase">Completed</div><div className="text-xl font-bold text-success mt-1">{completedWorkouts}</div></div>
              <div><div className="text-xs text-text-mute uppercase">Remaining</div><div className="text-xl font-bold text-warning mt-1">{workouts.length - completedWorkouts}</div></div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'photos' && (
        <div className="card-dark p-6">
          <h3 className="text-lg font-bold text-text-light mb-1">Before & After Gallery</h3>
          <p className="text-xs text-text-mute mb-6">Upload progress photos to visually track your transformation.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['July 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025'].map((label, i) => (
              <div key={label} className="aspect-[3/4] bg-ink-900 border border-border rounded-lg flex flex-col items-center justify-center text-center p-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-mute mb-2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                <span className="text-xs text-text-mute">{label}</span>
                {i === 0 && <span className="text-[10px] text-lime mt-1">Before</span>}
                {i === 3 && <span className="text-[10px] text-lime mt-1">Current</span>}
              </div>
            ))}
          </div>
          <button className="btn-secondary mt-6">Upload Photo</button>
        </div>
      )}
    </div>
  );
}
