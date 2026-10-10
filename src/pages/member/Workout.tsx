import { useAuth } from '@/context/AuthContext';
import { useGym } from '@/context/GymStore';
import { StatusBadge } from '@/components/ui/Common';

export default function MemberWorkout() {
  const { user } = useAuth();
  const { workoutPlans, trainers, members, toggleWorkoutDay } = useGym();
  const memberId = user?.memberId || 'm1';
  const member = members.find((m) => m.id === memberId);
  const workouts = workoutPlans[memberId] || [];
  const trainer = trainers.find((t) => t.id === member?.trainerId);

  const toggleDay = (day: string) => {
    toggleWorkoutDay(memberId, day);
  };

  if (workouts.length === 0) {
    return (
      <div className="card-dark p-12 text-center">
        <h3 className="text-lg font-semibold text-text-light">No Workout Plan Assigned</h3>
        <p className="text-sm text-text-mute mt-2">Your trainer hasn't created a workout plan yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-text-light">Workout Plan</h2>
        <p className="text-sm text-text-mute mt-1">Your weekly training schedule{trainer ? ` from ${trainer.name}` : ''}. Marking a day complete updates your progress in this preview.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-dark p-4">
          <div className="text-xs text-text-mute uppercase">Training Days</div>
          <div className="text-2xl font-bold text-text-light mt-1">{workouts.length}</div>
        </div>
        <div className="card-dark p-4">
          <div className="text-xs text-text-mute uppercase">Completed</div>
          <div className="text-2xl font-bold text-success mt-1">{workouts.filter((w) => w.completed).length}</div>
        </div>
        <div className="card-dark p-4">
          <div className="text-xs text-text-mute uppercase">Total Exercises</div>
          <div className="text-2xl font-bold text-text-light mt-1">{workouts.reduce((s, w) => s + w.exercises.length, 0)}</div>
        </div>
        <div className="card-dark p-4">
          <div className="text-xs text-text-mute uppercase">Avg Duration</div>
          <div className="text-2xl font-bold text-lime mt-1">{Math.round(workouts.reduce((s, w) => s + parseInt(w.duration), 0) / workouts.length)} min</div>
        </div>
      </div>

      <div className="space-y-4">
        {workouts.map((day) => {
          const isDone = day.completed;
          return (
            <div key={day.day} className={`card-dark overflow-hidden transition-all ${isDone ? 'border-success/30' : ''}`}>
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${isDone ? 'bg-success/10 text-success' : 'bg-ink-900 text-lime'}`}>
                    {day.day.slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-text-light">{day.day} — {day.focus}</h3>
                    <div className="flex items-center gap-3 text-xs text-text-mute mt-0.5">
                      <span>{day.duration}</span>
                      <span>·</span>
                      <span>{day.exercises.length} exercises</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {isDone && <StatusBadge status="completed" />}
                  <button
                    onClick={() => toggleDay(day.day)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${isDone ? 'bg-success/10 text-success border-success/30' : 'border-border text-text-mute hover:text-text-light'}`}
                  >
                    {isDone ? 'Completed' : 'Mark Done'}
                  </button>
                </div>
              </div>
              <div className="divide-y divide-border/50">
                {day.exercises.map((ex, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 hover:bg-ink-700/30 transition-colors">
                    <div className="w-8 h-8 bg-ink-900 rounded-lg flex items-center justify-center text-xs font-bold text-text-mute flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-text-light">{ex.name}</div>
                      {ex.notes && <div className="text-xs text-text-mute mt-0.5">{ex.notes}</div>}
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6 text-xs flex-shrink-0">
                      <div className="text-center"><div className="text-text-mute">Sets</div><div className="font-bold text-text-light mt-0.5">{ex.sets}</div></div>
                      <div className="text-center"><div className="text-text-mute">Reps</div><div className="font-bold text-text-light mt-0.5">{ex.reps}</div></div>
                      <div className="text-center hidden sm:block"><div className="text-text-mute">Rest</div><div className="font-bold text-text-light mt-0.5">{ex.rest}</div></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
