import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useGym } from '@/context/GymStore';

export default function MemberDietPlan() {
  const { user } = useAuth();
  const { dietPlans, trainers, members } = useGym();
  const memberId = user?.memberId || 'm1';
  const member = members.find((m) => m.id === memberId);
  const plan = dietPlans.find((dp) => dp.memberId === memberId && dp.status === 'published');
  const trainer = plan ? trainers.find((t) => t.id === plan.trainerId) : null;
  const [completedMeals, setCompletedMeals] = useState<Record<string, boolean>>({});

  if (!plan) {
    return (
      <div className="animate-fade-in">
        <div className="card-dark p-12 text-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-mute mx-auto mb-4"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" /><line x1="6" y1="17" x2="18" y2="17" /></svg>
          <h3 className="text-lg font-semibold text-text-light">No Diet Plan Assigned</h3>
          <p className="text-sm text-text-mute mt-2 max-w-sm mx-auto">Your trainer hasn't assigned a diet plan yet. Once assigned, it will appear here.</p>
        </div>
      </div>
    );
  }

  const meals = [
    { key: 'breakfast', ...plan.meals.breakfast, icon: '🌅', time: 'Morning' },
    { key: 'lunch', ...plan.meals.lunch, icon: '☀️', time: 'Midday' },
    { key: 'snack', ...plan.meals.snack, icon: '🍂', time: 'Evening' },
    { key: 'dinner', ...plan.meals.dinner, icon: '🌙', time: 'Night' },
  ];

  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0);
  const totalCarbs = meals.reduce((sum, m) => sum + m.carbs, 0);
  const totalFats = meals.reduce((sum, m) => sum + m.fats, 0);
  const completedCount = meals.filter((m) => completedMeals[m.key]).length;

  const toggleMeal = (key: string) => {
    setCompletedMeals((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-text-light">{plan.planName}</h2>
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <span className="text-sm text-text-mute">Assigned by</span>
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-lime/10 text-lime rounded-lg text-sm font-semibold border border-lime/20">
            {trainer?.image && <img src={trainer.image} alt={trainer.name} className="w-5 h-5 rounded-full object-cover" />}
            {trainer?.name}
          </span>
          <span className="text-xs text-text-mute">· Effective: {plan.effectiveDate} · Updated: {plan.lastUpdated}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-dark p-4">
          <div className="text-xs text-text-mute uppercase">Daily Calories</div>
          <div className="text-2xl font-bold text-lime mt-1">{plan.dailyCalories}</div>
          <div className="text-xs text-text-mute mt-1">Target</div>
        </div>
        <div className="card-dark p-4">
          <div className="text-xs text-text-mute uppercase">Protein</div>
          <div className="text-2xl font-bold text-text-light mt-1">{plan.proteinTarget}g</div>
          <div className="text-xs text-text-mute mt-1">Target</div>
        </div>
        <div className="card-dark p-4">
          <div className="text-xs text-text-mute uppercase">Carbs</div>
          <div className="text-2xl font-bold text-text-light mt-1">{plan.carbsTarget}g</div>
          <div className="text-xs text-text-mute mt-1">Target</div>
        </div>
        <div className="card-dark p-4">
          <div className="text-xs text-text-mute uppercase">Fats</div>
          <div className="text-2xl font-bold text-text-light mt-1">{plan.fatsTarget}g</div>
          <div className="text-xs text-text-mute mt-1">Target</div>
        </div>
      </div>

      <div className="card-dark p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-mute">Today's Progress: {completedCount}/{meals.length} meals completed</span>
          <div className="flex-1 max-w-[200px] mx-4 h-2 bg-ink-900 rounded-full overflow-hidden">
            <div className="h-full bg-lime rounded-full transition-all duration-500" style={{ width: `${(completedCount / meals.length) * 100}%` }} />
          </div>
          <span className="text-sm font-semibold text-lime">{Math.round((completedCount / meals.length) * 100)}%</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {meals.map((meal) => {
          const done = completedMeals[meal.key];
          return (
            <div key={meal.key} className={`card-dark p-5 transition-all ${done ? 'border-success/30 opacity-75' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-text-light">{meal.name}</h3>
                  <span className="text-xs text-text-mute">{meal.time}</span>
                </div>
                <button
                  onClick={() => toggleMeal(meal.key)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${done ? 'bg-success/10 text-success border-success/30' : 'border-border text-text-mute hover:text-text-light'}`}
                >
                  {done ? (
                    <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg> Completed</>
                  ) : (
                    <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /></svg> Mark Done</>
                  )}
                </button>
              </div>
              <p className="text-sm text-text-mute leading-relaxed">{meal.items}</p>
              <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-border">
                <div><div className="text-[10px] text-text-mute uppercase">Cal</div><div className="text-sm font-bold text-text-light">{meal.calories}</div></div>
                <div><div className="text-[10px] text-text-mute uppercase">Protein</div><div className="text-sm font-bold text-text-light">{meal.protein}g</div></div>
                <div><div className="text-[10px] text-text-mute uppercase">Carbs</div><div className="text-sm font-bold text-text-light">{meal.carbs}g</div></div>
                <div><div className="text-[10px] text-text-mute uppercase">Fats</div><div className="text-sm font-bold text-text-light">{meal.fats}g</div></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card-dark p-6">
        <h3 className="text-sm font-semibold text-text-light mb-2">Trainer's Notes</h3>
        <p className="text-sm text-text-mute leading-relaxed">{plan.notes}</p>
        <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-4 text-xs text-text-mute">
          <span>Marking meals as completed is for personal tracking only and does not modify your trainer's original plan.</span>
        </div>
        <div className="mt-2 text-xs text-warning flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="10" /></svg>
          Nutrition information is trainer-provided guidance, not medical advice.
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card-dark p-5">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-text-mute mb-2">Dietary Preferences</h4>
          <p className="text-sm text-text-light">{member?.dietaryPrefs || plan.restrictions || 'Not specified'}</p>
        </div>
        <div className="card-dark p-5">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-text-mute mb-2">Allergies</h4>
          <p className="text-sm text-text-light">{member?.allergies || 'None disclosed'}</p>
        </div>
      </div>

      <div className="card-dark p-6">
        <h3 className="text-sm font-semibold text-text-light mb-4">Daily Nutrition Summary</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-3 bg-ink-900 rounded-lg border border-border">
            <div className="text-2xl font-bold text-lime">{totalCalories}</div>
            <div className="text-xs text-text-mute mt-1">Total Cal</div>
          </div>
          <div className="text-center p-3 bg-ink-900 rounded-lg border border-border">
            <div className="text-2xl font-bold text-text-light">{totalProtein}g</div>
            <div className="text-xs text-text-mute mt-1">Protein</div>
          </div>
          <div className="text-center p-3 bg-ink-900 rounded-lg border border-border">
            <div className="text-2xl font-bold text-text-light">{totalCarbs}g</div>
            <div className="text-xs text-text-mute mt-1">Carbs</div>
          </div>
          <div className="text-center p-3 bg-ink-900 rounded-lg border border-border">
            <div className="text-2xl font-bold text-text-light">{totalFats}g</div>
            <div className="text-xs text-text-mute mt-1">Fats</div>
          </div>
        </div>
      </div>
    </div>
  );
}
