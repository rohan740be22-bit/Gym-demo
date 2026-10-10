import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useGym } from '@/context/GymStore';
import type { WorkoutDay } from '@/data/mockData';
import { Modal } from '@/components/ui/Modal';

const exerciseLibrary = [
  { name: 'Barbell Bench Press', muscle: 'Chest', difficulty: 'Intermediate' },
  { name: 'Back Squat', muscle: 'Legs', difficulty: 'Intermediate' },
  { name: 'Deadlift', muscle: 'Back', difficulty: 'Advanced' },
  { name: 'Overhead Press', muscle: 'Shoulders', difficulty: 'Intermediate' },
  { name: 'Barbell Row', muscle: 'Back', difficulty: 'Intermediate' },
  { name: 'Pull-ups', muscle: 'Back', difficulty: 'Intermediate' },
  { name: 'Romanian Deadlift', muscle: 'Hamstrings', difficulty: 'Intermediate' },
  { name: 'Incline Dumbbell Press', muscle: 'Chest', difficulty: 'Beginner' },
  { name: 'Lateral Raises', muscle: 'Shoulders', difficulty: 'Beginner' },
  { name: 'Leg Press', muscle: 'Legs', difficulty: 'Beginner' },
  { name: 'Cable Flyes', muscle: 'Chest', difficulty: 'Beginner' },
  { name: 'Hammer Curls', muscle: 'Biceps', difficulty: 'Beginner' },
  { name: 'Tricep Pushdowns', muscle: 'Triceps', difficulty: 'Beginner' },
  { name: 'Face Pulls', muscle: 'Shoulders', difficulty: 'Beginner' },
  { name: 'Battle Ropes', muscle: 'Conditioning', difficulty: 'Intermediate' },
  { name: 'Box Jumps', muscle: 'Legs', difficulty: 'Intermediate' },
  { name: 'Kettlebell Swings', muscle: 'Full Body', difficulty: 'Intermediate' },
  { name: 'Plank', muscle: 'Core', difficulty: 'Beginner' },
];

interface SelectedExercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  instructions: string;
}

export default function TrainerWorkoutBuilder() {
  const { user } = useAuth();
  const { members, clientsForTrainer, publishWorkout } = useGym();
  const trainerId = user?.trainerId || 't1';
  const myClients = clientsForTrainer(trainerId);
  const [notice, setNotice] = useState('');
  const [showBuilder, setShowBuilder] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedClient, setSelectedClient] = useState('');
  const [planName, setPlanName] = useState('');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [duration, setDuration] = useState('');
  const [search, setSearch] = useState('');
  const [activeDay, setActiveDay] = useState('Monday');
  const [dayExercises, setDayExercises] = useState<Record<string, SelectedExercise[]>>({});

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const filteredExercises = exerciseLibrary.filter((ex) => ex.name.toLowerCase().includes(search.toLowerCase()) || ex.muscle.toLowerCase().includes(search.toLowerCase()));

  const addExercise = (name: string) => {
    setDayExercises((prev) => ({
      ...prev,
      [activeDay]: [...(prev[activeDay] || []), { name, sets: '3', reps: '8-12', rest: '60 sec', instructions: '' }],
    }));
  };

  const removeExercise = (day: string, index: number) => {
    setDayExercises((prev) => ({
      ...prev,
      [day]: (prev[day] || []).filter((_, i) => i !== index),
    }));
  };

  const updateExercise = (day: string, index: number, field: keyof SelectedExercise, value: string) => {
    setDayExercises((prev) => ({
      ...prev,
      [day]: (prev[day] || []).map((ex, i) => i === index ? { ...ex, [field]: value } : ex),
    }));
  };

  const totalExercises = Object.values(dayExercises).reduce((sum, exs) => sum + exs.length, 0);

  const publish = () => {
    const built: WorkoutDay[] = days
      .filter((day) => (dayExercises[day] || []).length > 0)
      .map((day) => ({
        day,
        focus: planName || 'Training',
        duration: `${duration || '60'} min`,
        completed: false,
        exercises: (dayExercises[day] || []).map((ex) => ({
          name: ex.name,
          sets: Number(ex.sets) || 0,
          reps: ex.reps,
          rest: ex.rest,
          notes: ex.instructions || undefined,
        })),
      }));
    const result = publishWorkout(selectedClient, built);
    setNotice(result.message);
    if (result.ok) setShowBuilder(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-light">Workout Builder</h2>
          <p className="text-sm text-text-mute mt-1">Create structured workout plans from the exercise library.</p>
        </div>
        {notice && <div className="px-4 py-3 rounded-lg border border-lime/30 bg-lime/10 text-sm text-lime sm:mr-auto">{notice}</div>}
        <button onClick={() => setShowBuilder(true)} className="btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          New Workout Plan
        </button>
      </div>

      <div className="card-dark p-6">
        <h3 className="text-lg font-bold text-text-light mb-4">Exercise Library</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {exerciseLibrary.map((ex) => (
            <div key={ex.name} className="p-3 bg-ink-900 rounded-lg border border-border">
              <div className="text-sm font-semibold text-text-light">{ex.name}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] px-1.5 py-0.5 bg-lime/10 text-lime rounded">{ex.muscle}</span>
                <span className="text-[10px] text-text-mute">{ex.difficulty}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={showBuilder} onClose={() => setShowBuilder(false)} title="Build Workout Plan" size="lg">
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Select Client</label>
              <select className="input-field cursor-pointer" value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}>
                <option value="" className="bg-ink-900">Choose a client...</option>
                {myClients.map((c) => <option key={c.id} value={c.id} className="bg-ink-900">{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">Plan Name</label>
              <input className="input-field" value={planName} onChange={(e) => setPlanName(e.target.value)} placeholder="e.g. Strength Phase 1" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="input-label">Difficulty</label>
              <select className="input-field cursor-pointer" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option className="bg-ink-900">Beginner</option>
                <option className="bg-ink-900">Intermediate</option>
                <option className="bg-ink-900">Advanced</option>
              </select>
            </div>
            <div>
              <label className="input-label">Effective Date</label>
              <input type="date" className="input-field" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} />
            </div>
            <div>
              <label className="input-label">Duration (min)</label>
              <input className="input-field" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="75" />
            </div>
          </div>

          {/* Day selector */}
          <div className="flex gap-1 overflow-x-auto border-b border-border">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`px-3 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeDay === day ? 'text-lime border-lime' : 'text-text-mute border-transparent hover:text-text-light'}`}
              >
                {day.slice(0, 3)}
                {dayExercises[day] && <span className="ml-1 text-xs text-lime">({dayExercises[day].length})</span>}
              </button>
            ))}
          </div>

          {/* Exercise search and add */}
          <div className="flex gap-3">
            <input className="input-field flex-1" placeholder="Search exercises..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
            {filteredExercises.map((ex) => (
              <button
                key={ex.name}
                onClick={() => addExercise(ex.name)}
                className="flex items-center justify-between p-2 bg-ink-900 rounded-lg border border-border hover:border-lime/30 transition-colors text-left"
              >
                <span className="text-xs font-medium text-text-light">{ex.name}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-lime flex-shrink-0"><path d="M12 5v14M5 12h14" /></svg>
              </button>
            ))}
          </div>

          {/* Selected exercises for active day */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-text-light">{activeDay} — {dayExercises[activeDay]?.length || 0} exercises</h4>
            {(dayExercises[activeDay] || []).map((ex, i) => (
              <div key={i} className="p-3 bg-ink-900 rounded-lg border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-text-light">{ex.name}</span>
                  <button onClick={() => removeExercise(activeDay, i)} className="text-text-mute hover:text-error transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input className="input-field text-xs" placeholder="Sets" value={ex.sets} onChange={(e) => updateExercise(activeDay, i, 'sets', e.target.value)} />
                  <input className="input-field text-xs" placeholder="Reps" value={ex.reps} onChange={(e) => updateExercise(activeDay, i, 'reps', e.target.value)} />
                  <input className="input-field text-xs" placeholder="Rest" value={ex.rest} onChange={(e) => updateExercise(activeDay, i, 'rest', e.target.value)} />
                </div>
                <input className="input-field text-xs" placeholder="Instructions (optional)" value={ex.instructions} onChange={(e) => updateExercise(activeDay, i, 'instructions', e.target.value)} />
              </div>
            ))}
            {(dayExercises[activeDay] || []).length === 0 && <p className="text-sm text-text-mute text-center py-4">No exercises added for {activeDay} yet.</p>}
          </div>

          <div className="flex gap-3 justify-end pt-2 border-t border-border">
            <button onClick={() => setShowPreview(true)} className="btn-secondary">Preview Plan</button>
            <button onClick={() => setShowBuilder(false)} className="btn-secondary">Save Draft</button>
            <button onClick={publish} className="btn-primary">Publish Plan</button>
          </div>
        </div>
      </Modal>

      <Modal open={showPreview} onClose={() => setShowPreview(false)} title="Workout Plan Preview" size="lg">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-text-light">{planName || 'Untitled Plan'}</h3>
            <p className="text-sm text-text-mute">{members.find((m) => m.id === selectedClient)?.name || 'No client'} · {difficulty} · {duration || '—'} min</p>
          </div>
          <div className="text-xs text-text-mute">Total: {totalExercises} exercises across {Object.keys(dayExercises).length} days</div>
          {days.filter((d) => dayExercises[d]?.length > 0).map((day) => (
            <div key={day} className="p-3 bg-ink-900 rounded-lg border border-border">
              <div className="text-sm font-semibold text-lime mb-2">{day}</div>
              {(dayExercises[day] || []).map((ex, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 text-sm">
                  <span className="text-text-light">{ex.name}</span>
                  <span className="text-text-mute text-xs">{ex.sets} × {ex.reps} · {ex.rest}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
