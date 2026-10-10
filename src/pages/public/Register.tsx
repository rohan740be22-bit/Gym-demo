import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useGym } from '@/context/GymStore';
import { images } from '@/data/mockData';

export default function RegisterPage() {
  const [params] = useSearchParams();
  const { membershipPlans, members, addMember, settings } = useGym();
  const { login } = useAuth();
  const navigate = useNavigate();
  const visiblePlans = membershipPlans.filter((p) => p.active !== false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    plan: params.get('plan') ? visiblePlans.find((p) => p.id === params.get('plan'))?.name || 'Performance' : 'Performance',
    goal: '',
  });
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return setError('Enter your full name.');
    if (!form.email.includes('@')) return setError('Enter a valid email.');
    if (form.phone.trim().length < 7) return setError('Enter a phone number.');
    if (form.password.length < 6) return setError('Use at least 6 characters. This password is not stored.');
    if (members.some((m) => m.email.toLowerCase() === form.email.toLowerCase())) return setError('That email is already in the sample directory. Sign in instead.');
    const member = addMember({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), membershipPlan: form.plan, goal: form.goal || 'General fitness' });
    login('member', member.name, member.email, member.id);
    navigate('/member');
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-ink-900">
      <div className="relative hidden lg:block">
        <img src={images.hero} alt="Premium gym floor prepared for strength training" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/50 to-ink-900/20" />
        <div className="absolute bottom-0 p-12 max-w-lg">
          <h2 className="text-4xl font-bold leading-tight">JOIN THE CLUB.</h2>
          <p className="mt-4 text-text-mute">Registration creates a sample member profile so you can preview onboarding. No payment is taken.</p>
        </div>
      </div>
      <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12">
        <div className="max-w-sm w-full mx-auto">
          <Link to="/" className="text-sm font-bold tracking-wide text-text-light">{settings.name}</Link>
          <h1 className="mt-8 text-3xl font-bold">Create your membership</h1>
          <p className="mt-2 text-sm text-text-mute">You will land in the member portal. This is a preview, not a real enrollment.</p>
          <form onSubmit={submit} className="mt-8 space-y-4">
            <div><label className="input-label">Full name</label><input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div><label className="input-label">Email</label><input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
            <div><label className="input-label">Phone</label><input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></div>
            <div>
              <label className="input-label">Plan</label>
              <select className="input-field" value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}>
                {visiblePlans.map((p) => <option key={p.id} className="bg-ink-900" value={p.name}>{p.name} · ${p.price}/mo</option>)}
              </select>
            </div>
            <div><label className="input-label">Fitness goal</label><input className="input-field" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} placeholder="Strength, weight management…" /></div>
            <div><label className="input-label">Password</label><input type="password" className="input-field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></div>
            {error && <p className="text-sm text-error">{error}</p>}
            <button className="btn-primary w-full" type="submit">Continue to member portal</button>
          </form>
          <p className="mt-6 text-sm text-text-mute">Already registered? <Link to="/login" className="text-lime">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
