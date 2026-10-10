import { useEffect, useState, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useGym } from '@/context/GymStore';

const portalRoots = new Set(['/member', '/trainer', '/admin']);

function navIsActive(path: string, current: string) {
  if (current === path) return true;
  if (portalRoots.has(path)) return false;
  return current.startsWith(`${path}/`);
}

interface NavItem {
  path: string;
  label: string;
  icon: ReactNode;
}

interface DashboardLayoutProps {
  navItems: NavItem[];
  children: ReactNode;
  roleLabel: string;
}

export function DashboardLayout({ navItems, children, roleLabel }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { settings } = useGym();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const currentLabel = navItems.find((n) => navIsActive(n.path, location.pathname))?.label || 'Dashboard';

  useEffect(() => {
    document.title = `${currentLabel} · ${roleLabel} · ${settings.shortName}`;
  }, [currentLabel, roleLabel, settings.shortName]);

  return (
    <div className="min-h-screen bg-ink-900 text-text-light flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-ink-800 border-r border-border z-50 flex flex-col transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="px-5 py-5 border-b border-border flex items-center gap-2.5">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-lime rounded-lg flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111315" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.4 14.4L9.6 9.6" />
                <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" />
                <path d="m21.5 21.5-1.4-1.4" />
                <path d="M3.9 3.9 2.5 2.5" />
                <path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z" />
              </svg>
            </div>
            <div>
              <div className="font-display font-bold text-xs tracking-wide text-text-light leading-tight">{settings.shortName}</div>
              <div className="text-[10px] text-text-mute">{roleLabel}</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {navItems.map((item) => {
            const active = navIsActive(item.path, location.pathname);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? 'bg-lime/10 text-lime' : 'text-text-mute hover:text-text-light hover:bg-ink-700'
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-border">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-mute hover:text-text-light hover:bg-ink-700 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Back to Website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-mute hover:text-error hover:bg-error/5 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
            Log Out
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-ink-900/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-ink-900/90 backdrop-blur-md border-b border-border">
          <div className="px-4 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-text-light p-1"
                aria-label="Open menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 12h16M4 6h16M4 18h16" /></svg>
              </button>
              <h1 className="text-lg font-bold text-text-light">{currentLabel}</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-lime/10 text-lime border border-lime/20 rounded">
                <span className="w-1.5 h-1.5 bg-lime rounded-full animate-pulse-lime" />
                Demo Preview
              </span>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-ink-700 border border-border flex items-center justify-center text-xs font-bold text-lime">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-semibold text-text-light leading-tight">{user?.name}</div>
                  <div className="text-[10px] text-text-mute">{user?.email}</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
