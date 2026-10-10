import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useGym, type DietPlanInput } from '@/context/GymStore';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/ui/Common';

export default function TrainerDietBuilder() {
  const { user } = useAuth();
  const { members, clientsForTrainer, dietPlans, trainers, saveDietPlan } = useGym();
  const trainerId = user?.trainerId || 't1';
  const myClients = clientsForTrainer(trainerId);
  const myPlans = dietPlans.filter((dp) => dp.trainerId === trainerId);
  const trainer = trainers.find((t) => t.id === trainerId);
  const [editingId, setEditingId] = useState<string | undefined>();
  const [notice, setNotice] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedClient, setSelectedClient] = useState('');
  const [planName, setPlanName] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [dailyCalories, setDailyCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [notes, setNotes] = useState('');
  const [restrictions, setRestrictions] = useState('');
  const [meals, setMeals] = useState({
    breakfast: { items: '', calories: '', protein: '', carbs: '', fats: '' },
    lunch: { items: '', calories: '', protein: '', carbs: '', fats: '' },
    snack: { items: '', calories: '', protein: '', carbs: '', fats: '' },
    dinner: { items: '', calories: '', protein: '', carbs: '', fats: '' },
  });

  const mealLabels: Record<string, string> = { breakfast: 'Breakfast', lunch: 'Lunch', snack: 'Evening Snack', dinner: 'Dinner' };

  const updateMeal = (key: string, field: string, value: string) => {
    setMeals((prev) => ({ ...prev, [key]: { ...prev[key as keyof typeof prev], [field]: value } }));
  };

  const resetForm = () => {
    setSelectedClient(''); setPlanName(''); setEffectiveDate(''); setDailyCalories('');
    setProtein(''); setCarbs(''); setFats(''); setNotes(''); setRestrictions('');
    setMeals({ breakfast: { items: '', calories: '', protein: '', carbs: '', fats: '' }, lunch: { items: '', calories: '', protein: '', carbs: '', fats: '' }, snack: { items: '', calories: '', protein: '', carbs: '', fats: '' }, dinner: { items: '', calories: '', protein: '', carbs: '', fats: '' } });
  };

  const previewClient = myClients.find((m) => m.id === selectedClient);

  const buildInput = (status: DietPlanInput['status']): DietPlanInput => ({
    id: editingId,
    memberId: selectedClient,
    trainerId,
    planName,
    effectiveDate: effectiveDate || new Date().toISOString().slice(0, 10),
    dailyCalories: Number(dailyCalories) || 0,
    proteinTarget: Number(protein) || 0,
    carbsTarget: Number(carbs) || 0,
    fatsTarget: Number(fats) || 0,
    restrictions,
    notes,
    status,
    meals: {
      breakfast: { name: 'Breakfast', items: meals.breakfast.items, calories: Number(meals.breakfast.calories) || 0, protein: Number(meals.breakfast.protein) || 0, carbs: Number(meals.breakfast.carbs) || 0, fats: Number(meals.breakfast.fats) || 0 },
      lunch: { name: 'Lunch', items: meals.lunch.items, calories: Number(meals.lunch.calories) || 0, protein: Number(meals.lunch.protein) || 0, carbs: Number(meals.lunch.carbs) || 0, fats: Number(meals.lunch.fats) || 0 },
      snack: { name: 'Evening Snack', items: meals.snack.items, calories: Number(meals.snack.calories) || 0, protein: Number(meals.snack.protein) || 0, carbs: Number(meals.snack.carbs) || 0, fats: Number(meals.snack.fats) || 0 },
      dinner: { name: 'Dinner', items: meals.dinner.items, calories: Number(meals.dinner.calories) || 0, protein: Number(meals.dinner.protein) || 0, carbs: Number(meals.dinner.carbs) || 0, fats: Number(meals.dinner.fats) || 0 },
    },
  });

  const persist = (status: DietPlanInput['status']) => {
    const result = saveDietPlan(buildInput(status));
    setNotice(result.message);
    if (!result.ok) return;
    setShowForm(false);
    if (status === 'draft' || status === 'published') {
      setEditingId(undefined);
      resetForm();
    }
  };

  const loadPlan = (planId: string) => {
    const plan = myPlans.find((p) => p.id === planId);
    if (!plan) return;
    setEditingId(plan.id);
    setSelectedClient(plan.memberId);
    setPlanName(plan.planName);
    setEffectiveDate(plan.effectiveDate);
    setDailyCalories(String(plan.dailyCalories));
    setProtein(String(plan.proteinTarget));
    setCarbs(String(plan.carbsTarget));
    setFats(String(plan.fatsTarget));
    setNotes(plan.notes);
    setRestrictions(plan.restrictions || '');
    setMeals({
      breakfast: { items: plan.meals.breakfast.items, calories: String(plan.meals.breakfast.calories), protein: String(plan.meals.breakfast.protein), carbs: String(plan.meals.breakfast.carbs), fats: String(plan.meals.breakfast.fats) },
      lunch: { items: plan.meals.lunch.items, calories: String(plan.meals.lunch.calories), protein: String(plan.meals.lunch.protein), carbs: String(plan.meals.lunch.carbs), fats: String(plan.meals.lunch.fats) },
      snack: { items: plan.meals.snack.items, calories: String(plan.meals.snack.calories), protein: String(plan.meals.snack.protein), carbs: String(plan.meals.snack.carbs), fats: String(plan.meals.snack.fats) },
      dinner: { items: plan.meals.dinner.items, calories: String(plan.meals.dinner.calories), protein: String(plan.meals.dinner.protein), carbs: String(plan.meals.dinner.carbs), fats: String(plan.meals.dinner.fats) },
    });
    setShowForm(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-light">Diet Plan Builder</h2>
          <p className="text-sm text-text-mute mt-1">Create personalized nutrition plans for your clients.</p>
        </div>
        <button onClick={() => { setEditingId(undefined); resetForm(); setShowForm(true); }} className="btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          New Diet Plan
        </button>
      </div>

      {notice && <div className="px-4 py-3 rounded-lg border border-lime/30 bg-lime/10 text-sm text-lime">{notice}</div>}

      <div className="card-dark p-6">
        <h3 className="text-lg font-bold text-text-light mb-4">Plan History</h3>
        <div className="space-y-3">
          {myPlans.map((dp) => {
            const client = members.find((m) => m.id === dp.memberId);
            return (
              <div key={dp.id} className="flex items-center justify-between p-4 bg-ink-900 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <img src={client?.profileImage} alt={client?.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="text-sm font-semibold text-text-light">{dp.planName}</div>
                    <div className="text-xs text-text-mute">{client?.name} · {dp.dailyCalories} cal · Updated {dp.lastUpdated}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={dp.status} />
                  <button className="btn-ghost text-xs" onClick={() => loadPlan(dp.id)}>Edit</button>
                </div>
              </div>
            );
          })}
          {myPlans.length === 0 && <p className="text-sm text-text-mute text-center py-8">No plans created yet.</p>}
        </div>
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Create Diet Plan" size="lg">
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
              <input className="input-field" value={planName} onChange={(e) => setPlanName(e.target.value)} placeholder="e.g. Lean Bulk Program" />
            </div>
          </div>

          <div>
            <label className="input-label">Effective Date</label>
            <input type="date" className="input-field" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div><label className="input-label">Daily Calories</label><input className="input-field" value={dailyCalories} onChange={(e) => setDailyCalories(e.target.value)} placeholder="2800" /></div>
            <div><label className="input-label">Protein (g)</label><input className="input-field" value={protein} onChange={(e) => setProtein(e.target.value)} placeholder="180" /></div>
            <div><label className="input-label">Carbs (g)</label><input className="input-field" value={carbs} onChange={(e) => setCarbs(e.target.value)} placeholder="320" /></div>
            <div><label className="input-label">Fats (g)</label><input className="input-field" value={fats} onChange={(e) => setFats(e.target.value)} placeholder="80" /></div>
          </div>

          <div className="space-y-4">
            {Object.entries(meals).map(([key, meal]) => (
              <div key={key} className="p-4 bg-ink-900 rounded-lg border border-border">
                <h4 className="text-sm font-semibold text-text-light mb-3">{mealLabels[key]}</h4>
                <input className="input-field mb-2" placeholder="Food items and quantities..." value={meal.items} onChange={(e) => updateMeal(key, 'items', e.target.value)} />
                <div className="grid grid-cols-4 gap-2">
                  <input className="input-field text-xs" placeholder="Cal" value={meal.calories} onChange={(e) => updateMeal(key, 'calories', e.target.value)} />
                  <input className="input-field text-xs" placeholder="Protein" value={meal.protein} onChange={(e) => updateMeal(key, 'protein', e.target.value)} />
                  <input className="input-field text-xs" placeholder="Carbs" value={meal.carbs} onChange={(e) => updateMeal(key, 'carbs', e.target.value)} />
                  <input className="input-field text-xs" placeholder="Fats" value={meal.fats} onChange={(e) => updateMeal(key, 'fats', e.target.value)} />
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="input-label">Dietary Restrictions</label>
            <input className="input-field" value={restrictions} onChange={(e) => setRestrictions(e.target.value)} placeholder="e.g. Lactose intolerant, vegetarian" />
          </div>

          <div>
            <label className="input-label">Notes & Recommendations</label>
            <textarea className="input-field min-h-[80px] resize-y" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add guidance for the client..." />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
            <button type="button" onClick={() => setShowPreview(true)} className="btn-secondary">Preview Plan</button>
            <button type="button" onClick={() => persist('draft')} className="btn-secondary">Save as Draft</button>
            <button type="button" onClick={() => persist('published')} className="btn-primary">Publish Plan</button>
          </div>
        </div>
      </Modal>

      <Modal open={showPreview} onClose={() => setShowPreview(false)} title="Plan Preview" size="lg">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-text-light">{planName || 'Untitled Plan'}</h3>
              <p className="text-sm text-text-mute">{previewClient?.name || 'No client selected'} · {effectiveDate || 'No date'}</p>
            </div>
            <span className="text-xs text-text-mute">By {trainer?.name}</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center p-3 bg-ink-900 rounded-lg border border-border"><div className="text-lg font-bold text-lime">{dailyCalories || '—'}</div><div className="text-xs text-text-mute">Calories</div></div>
            <div className="text-center p-3 bg-ink-900 rounded-lg border border-border"><div className="text-lg font-bold text-text-light">{protein || '—'}g</div><div className="text-xs text-text-mute">Protein</div></div>
            <div className="text-center p-3 bg-ink-900 rounded-lg border border-border"><div className="text-lg font-bold text-text-light">{carbs || '—'}g</div><div className="text-xs text-text-mute">Carbs</div></div>
            <div className="text-center p-3 bg-ink-900 rounded-lg border border-border"><div className="text-lg font-bold text-text-light">{fats || '—'}g</div><div className="text-xs text-text-mute">Fats</div></div>
          </div>
          {Object.entries(meals).map(([key, meal]) => (
            <div key={key} className="p-3 bg-ink-900 rounded-lg border border-border">
              <div className="text-sm font-semibold text-text-light">{mealLabels[key]}</div>
              <div className="text-xs text-text-mute mt-1">{meal.items || 'No items specified'}</div>
            </div>
          ))}
          {notes && <div className="p-3 bg-ink-900 rounded-lg border border-border"><div className="text-xs font-semibold text-text-mute mb-1">Notes</div><div className="text-sm text-text-light">{notes}</div></div>}
        </div>
      </Modal>
    </div>
  );
}
