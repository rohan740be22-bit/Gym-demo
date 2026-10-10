import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navLinks } from '@/config/brand';
import { useGym } from '@/context/GymStore';

const pageMeta: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Forge Fitness Club | Built for Your Next Level',
    description: 'Premium strength, performance, and community training at Forge Fitness Club. Explore memberships, coaches, and facilities.',
  },
  '/about': {
    title: 'About Forge Fitness Club',
    description: 'How Forge approaches strength, consistency, coaching, and sustainable progress.',
  },
  '/facilities': {
    title: 'Facilities | Forge Fitness Club',
    description: 'Strength, cardio, functional training, personal coaching, recovery, and group classes.',
  },
  '/memberships': {
    title: 'Membership Plans | Forge Fitness Club',
    description: 'Compare Essential, Performance, and Elite memberships. Payments are not processed in this preview.',
  },
  '/trainers': {
    title: 'Trainers | Forge Fitness Club',
    description: 'Meet the sample coaching team across strength, conditioning, function, and mobility.',
  },
  '/occupancy': {
    title: 'Gym Occupancy | Forge Fitness Club',
    description: 'Demonstration occupancy for Forge Fitness Club. Figures update inside this preview and are not a live door count.',
  },
  '/contact': {
    title: 'Contact Forge Fitness Club',
    description: 'Visit, call, or message Forge Fitness Club. Opening hours and address for the sample club.',
  },
};

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { settings, content } = useGym();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const meta = pageMeta[location.pathname];
    if (!meta) return;
    document.title = meta.title.replace('Forge Fitness Club', settings.name);
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', 'description');
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', meta.description);
  }, [location.pathname, settings.name]);

  return (
    <div className="min-h-screen bg-ink-900 text-text-light">
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-ink-900/90 backdrop-blur-md border-b border-border' : 'bg-transparent'
      }`}>
        {content.announcement && (
          <div className="bg-lime text-ink-900 text-center text-xs font-semibold tracking-wide py-2 px-4">{content.announcement}</div>
        )}
        <nav className="section-padding">
          <div className="container-max flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-lime rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111315" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.4 14.4L9.6 9.6" />
                  <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" />
                  <path d="m21.5 21.5-1.4-1.4" />
                  <path d="M3.9 3.9 2.5 2.5" />
                  <path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z" />
                </svg>
              </div>
              <span className="font-display font-bold text-sm tracking-wide text-text-light hidden sm:block">{settings.name}</span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === link.path
                      ? 'text-lime'
                      : 'text-text-mute hover:text-text-light'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <Link to="/login" className="btn-ghost text-text-mute hover:text-text-light">
                Member Login
              </Link>
              <Link to="/memberships" className="btn-primary">
                Join the Club
              </Link>
            </div>

            <button
              className="lg:hidden text-text-light p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 12h16M4 6h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div className="lg:hidden bg-ink-900/95 backdrop-blur-md border-b border-border animate-slide-down">
            <div className="section-padding py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === link.path ? 'text-lime bg-ink-800' : 'text-text-mute hover:text-text-light'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-border mt-3 flex gap-3">
                <Link to="/login" className="btn-secondary flex-1">Member Login</Link>
                <Link to="/memberships" className="btn-primary flex-1">Join the Club</Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="bg-ink-800 border-t border-border">
        <div className="section-padding py-12 lg:py-16">
          <div className="container-max">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              <div className="lg:col-span-1">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 bg-lime rounded-lg flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111315" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.4 14.4L9.6 9.6" />
                      <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" />
                      <path d="m21.5 21.5-1.4-1.4" />
                      <path d="M3.9 3.9 2.5 2.5" />
                      <path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z" />
                    </svg>
                  </div>
                  <span className="font-display font-bold text-sm tracking-wide">{settings.name}</span>
                </div>
                <p className="text-sm text-text-mute leading-relaxed max-w-xs">
                  Premium strength, performance, and community. Built for your next level.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-text-mute mb-4">Explore</h4>
                <ul className="space-y-2">
                  {navLinks.map((link) => (
                    <li key={link.path}>
                      <Link to={link.path} className="text-sm text-text-mute hover:text-lime transition-colors">{link.label}</Link>
                    </li>
                  ))}
                  <li><Link to="/occupancy" className="text-sm text-text-mute hover:text-lime transition-colors">Live Occupancy</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-text-mute mb-4">Contact</h4>
                <ul className="space-y-2 text-sm text-text-mute">
                  <li>{settings.address}</li>
                  <li>{settings.phone}</li>
                  <li>{settings.email}</li>
                </ul>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-text-mute mt-6 mb-3">Hours</h4>
                <ul className="space-y-1 text-sm text-text-mute">
                  {settings.hours.map((h) => (
                    <li key={h.day} className="text-xs">{h.day}: {h.time}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-text-mute mb-4">Follow</h4>
                <div className="flex gap-3">
                  {['Instagram', 'Facebook', 'Twitter', 'YouTube'].map((social) => (
                    <a key={social} href="#" className="w-9 h-9 border border-border rounded-lg flex items-center justify-center text-text-mute hover:text-lime hover:border-lime/30 transition-colors" aria-label={social}>
                      <span className="text-[10px] font-bold">{social[0]}</span>
                    </a>
                  ))}
                </div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-text-mute mt-6 mb-3">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-text-mute hover:text-lime transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-sm text-text-mute hover:text-lime transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row justify-between gap-4">
              <p className="text-xs text-text-mute">© 2026 {settings.name}. All rights reserved.</p>
              <p className="text-xs text-text-mute">Prototype demo — simulated data, no real-time tracking.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
