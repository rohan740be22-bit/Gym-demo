import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { GymProvider } from '@/context/GymStore';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import type { ReactNode } from 'react';

// Public pages
import HomePage from '@/pages/public/Home';
import AboutPage from '@/pages/public/About';
import FacilitiesPage from '@/pages/public/Facilities';
import MembershipsPage from '@/pages/public/Memberships';
import TrainersPage from '@/pages/public/Trainers';
import OccupancyPage from '@/pages/public/Occupancy';
import ContactPage from '@/pages/public/Contact';
import LoginPage from '@/pages/public/Login';
import RegisterPage from '@/pages/public/Register';

// Member portal
import MemberDashboard from '@/pages/member/Dashboard';
import MemberProfile from '@/pages/member/Profile';
import MemberProgress from '@/pages/member/Progress';
import MemberDietPlan from '@/pages/member/DietPlan';
import MemberWorkout from '@/pages/member/Workout';
import MemberMembership from '@/pages/member/Membership';

// Trainer portal
import TrainerDashboard from '@/pages/trainer/Dashboard';
import TrainerClients from '@/pages/trainer/Clients';
import TrainerClientDetail from '@/pages/trainer/ClientDetail';
import TrainerDietBuilder from '@/pages/trainer/DietBuilder';
import TrainerWorkoutBuilder from '@/pages/trainer/WorkoutBuilder';
import TrainerAppointments from '@/pages/trainer/Appointments';

// Admin portal
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminMembers from '@/pages/admin/Members';
import AdminTrainers from '@/pages/admin/Trainers';
import AdminMemberships from '@/pages/admin/Memberships';
import AdminOccupancy from '@/pages/admin/Occupancy';
import AdminCards from '@/pages/admin/Cards';
import AdminPayments from '@/pages/admin/Payments';
import AdminContent from '@/pages/admin/Content';
import AdminSettings from '@/pages/admin/Settings';

const memberNav = [
  { path: '/member', label: 'Dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg> },
  { path: '/member/profile', label: 'My Profile', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4" /><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /></svg> },
  { path: '/member/progress', label: 'Fitness Progress', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg> },
  { path: '/member/diet', label: 'Diet Plan', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" /><line x1="6" y1="17" x2="18" y2="17" /></svg> },
  { path: '/member/workout', label: 'Workout Plan', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6.5 6.5 17.5 17.5" /><path d="m21 21-1-1" /><path d="m3 3 1 1" /><path d="M18 22l4-4" /><path d="M2 6l4-4" /><path d="m3 10 7-7" /><path d="m14 21 7-7" /></svg> },
  { path: '/member/membership', label: 'Membership', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg> },
];

const trainerNav = [
  { path: '/trainer', label: 'Dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg> },
  { path: '/trainer/clients', label: 'My Clients', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4" /><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /></svg> },
  { path: '/trainer/diet-builder', label: 'Diet Plan Builder', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" /><line x1="6" y1="17" x2="18" y2="17" /></svg> },
  { path: '/trainer/workout-builder', label: 'Workout Builder', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6.5 6.5 17.5 17.5" /><path d="m21 21-1-1" /><path d="m3 3 1 1" /><path d="M18 22l4-4" /><path d="M2 6l4-4" /><path d="m3 10 7-7" /><path d="m14 21 7-7" /></svg> },
  { path: '/trainer/appointments', label: 'Appointments', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg> },
];

const adminNav = [
  { path: '/admin', label: 'Dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg> },
  { path: '/admin/members', label: 'Members', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4" /><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /></svg> },
  { path: '/admin/trainers', label: 'Trainers', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
  { path: '/admin/memberships', label: 'Memberships', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2 15.09 8.26 22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" /></svg> },
  { path: '/admin/occupancy', label: 'Occupancy', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 3v18h18" /><path d="M18.7 8a8 8 0 0 0-7.5-5" /><path d="M18.7 8a8 8 0 0 1-7.5 5" /></svg> },
  { path: '/admin/cards', label: 'Cards & Access', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg> },
  { path: '/admin/payments', label: 'Payments', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg> },
  { path: '/admin/content', label: 'Website Content', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg> },
  { path: '/admin/settings', label: 'Settings', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg> },
];

function ProtectedRoute({ role, children }: { role: string; children: ReactNode }) {
  const { user } = useAuth();
  if (!user || user.role !== role) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
      <Route path="/facilities" element={<PublicLayout><FacilitiesPage /></PublicLayout>} />
      <Route path="/memberships" element={<PublicLayout><MembershipsPage /></PublicLayout>} />
      <Route path="/trainers" element={<PublicLayout><TrainersPage /></PublicLayout>} />
      <Route path="/occupancy" element={<PublicLayout><OccupancyPage /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Member */}
      <Route path="/member" element={<ProtectedRoute role="member"><DashboardLayout navItems={memberNav} roleLabel="Member">{<MemberDashboard />}</DashboardLayout></ProtectedRoute>} />
      <Route path="/member/profile" element={<ProtectedRoute role="member"><DashboardLayout navItems={memberNav} roleLabel="Member">{<MemberProfile />}</DashboardLayout></ProtectedRoute>} />
      <Route path="/member/progress" element={<ProtectedRoute role="member"><DashboardLayout navItems={memberNav} roleLabel="Member">{<MemberProgress />}</DashboardLayout></ProtectedRoute>} />
      <Route path="/member/diet" element={<ProtectedRoute role="member"><DashboardLayout navItems={memberNav} roleLabel="Member">{<MemberDietPlan />}</DashboardLayout></ProtectedRoute>} />
      <Route path="/member/workout" element={<ProtectedRoute role="member"><DashboardLayout navItems={memberNav} roleLabel="Member">{<MemberWorkout />}</DashboardLayout></ProtectedRoute>} />
      <Route path="/member/membership" element={<ProtectedRoute role="member"><DashboardLayout navItems={memberNav} roleLabel="Member">{<MemberMembership />}</DashboardLayout></ProtectedRoute>} />

      {/* Trainer */}
      <Route path="/trainer" element={<ProtectedRoute role="trainer"><DashboardLayout navItems={trainerNav} roleLabel="Trainer">{<TrainerDashboard />}</DashboardLayout></ProtectedRoute>} />
      <Route path="/trainer/clients" element={<ProtectedRoute role="trainer"><DashboardLayout navItems={trainerNav} roleLabel="Trainer">{<TrainerClients />}</DashboardLayout></ProtectedRoute>} />
      <Route path="/trainer/clients/:id" element={<ProtectedRoute role="trainer"><DashboardLayout navItems={trainerNav} roleLabel="Trainer">{<TrainerClientDetail />}</DashboardLayout></ProtectedRoute>} />
      <Route path="/trainer/diet-builder" element={<ProtectedRoute role="trainer"><DashboardLayout navItems={trainerNav} roleLabel="Trainer">{<TrainerDietBuilder />}</DashboardLayout></ProtectedRoute>} />
      <Route path="/trainer/workout-builder" element={<ProtectedRoute role="trainer"><DashboardLayout navItems={trainerNav} roleLabel="Trainer">{<TrainerWorkoutBuilder />}</DashboardLayout></ProtectedRoute>} />
      <Route path="/trainer/appointments" element={<ProtectedRoute role="trainer"><DashboardLayout navItems={trainerNav} roleLabel="Trainer">{<TrainerAppointments />}</DashboardLayout></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><DashboardLayout navItems={adminNav} roleLabel="Admin">{<AdminDashboard />}</DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/members" element={<ProtectedRoute role="admin"><DashboardLayout navItems={adminNav} roleLabel="Admin">{<AdminMembers />}</DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/trainers" element={<ProtectedRoute role="admin"><DashboardLayout navItems={adminNav} roleLabel="Admin">{<AdminTrainers />}</DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/memberships" element={<ProtectedRoute role="admin"><DashboardLayout navItems={adminNav} roleLabel="Admin">{<AdminMemberships />}</DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/occupancy" element={<ProtectedRoute role="admin"><DashboardLayout navItems={adminNav} roleLabel="Admin">{<AdminOccupancy />}</DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/cards" element={<ProtectedRoute role="admin"><DashboardLayout navItems={adminNav} roleLabel="Admin">{<AdminCards />}</DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/payments" element={<ProtectedRoute role="admin"><DashboardLayout navItems={adminNav} roleLabel="Admin">{<AdminPayments />}</DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/content" element={<ProtectedRoute role="admin"><DashboardLayout navItems={adminNav} roleLabel="Admin">{<AdminContent />}</DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute role="admin"><DashboardLayout navItems={adminNav} roleLabel="Admin">{<AdminSettings />}</DashboardLayout></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <GymProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </GymProvider>
    </AuthProvider>
  );
}
