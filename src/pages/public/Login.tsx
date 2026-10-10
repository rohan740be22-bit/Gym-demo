import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { brand } from '@/config/brand';
import { demoAccounts, images } from '@/data/mockData';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const account = demoAccounts.find((a) => a.email === email && a.password === password);
    if (account) {
      login(account.role as 'member' | 'trainer' | 'admin', account.name, account.email, account.memberId || account.trainerId);
      navigate(`/${account.role}`);
    } else if (email && password) {
      setError('Invalid credentials. Use a demo account below or the provided credentials.');
    }
  };

  const handleDemoLogin = (account: typeof demoAccounts[0]) => {
    login(account.role as 'member' | 'trainer' | 'admin', account.name, account.email, account.memberId || account.trainerId);
    navigate(`/${account.role}`);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-ink-900">
      {/* Left: image */}
      <div className="relative hidden lg:block">
        <img src={images.silhouette} alt="Athletic silhouette in gym" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/50 to-ink-900/30" />
        <div className="absolute bottom-0 left-0 right-0 p-12">
          <h2 className="text-4xl font-bold text-text-light leading-tight">WELCOME BACK<br />TO THE FORGE.</h2>
          <p className="mt-4 text-text-mute text-lg max-w-md">Your training journey continues here. Log in to access your dashboard, plans, and progress.</p>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12">
        <div className="w-full max-w-sm mx-auto">
          <Link to="/" className="flex items-center gap-2.5 mb-12">
            <div className="w-9 h-9 bg-lime rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111315" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.4 14.4L9.6 9.6" />
                <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" />
                <path d="m21.5 21.5-1.4-1.4" />
                <path d="M3.9 3.9 2.5 2.5" />
                <path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z" />
              </svg>
            </div>
            <span className="font-display font-bold text-sm tracking-wide text-text-light">{brand.name}</span>
          </Link>

          <h1 className="text-3xl font-bold text-text-light">Member Login</h1>
          <p className="mt-2 text-sm text-text-mute">Sign in to access your portal.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="input-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="input-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-sm text-error">{error}</p>}
            <button type="submit" className="btn-primary w-full">Sign In</button>
          </form>

          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs font-semibold uppercase tracking-wider text-text-mute">Demo Role Selector</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <p className="text-xs text-text-mute mb-4 text-center">
              Preview each portal instantly. This is for demonstration only — not secure authentication.
            </p>
            <div className="grid gap-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.role}
                  onClick={() => handleDemoLogin(account)}
                  className="flex items-center justify-between px-4 py-3 border border-border rounded-lg hover:border-lime/30 hover:bg-ink-800 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold uppercase bg-ink-700 text-lime group-hover:bg-lime group-hover:text-ink-900 transition-colors">
                      {account.role[0]}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-text-light capitalize">{account.role} Portal</div>
                      <div className="text-xs text-text-mute">{account.email}</div>
                    </div>
                  </div>
                  <svg className="text-text-mute group-hover:text-lime transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center space-y-2">
            <p className="text-sm text-text-mute">New here? <Link to="/register" className="text-lime">Create a membership</Link></p>
            <Link to="/" className="text-sm text-text-mute hover:text-lime transition-colors">← Back to website</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
