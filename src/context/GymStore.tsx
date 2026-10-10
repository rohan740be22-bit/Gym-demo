import { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { brand } from '@/config/brand';
import {
  members as seedMembers,
  trainers as seedTrainers,
  trainerProfiles as seedTrainerProfiles,
  membershipPlans as seedPlans,
  facilities as seedFacilities,
  testimonials as seedTestimonials,
  dietPlans as seedDietPlans,
  workoutPlans as seedWorkouts,
  sessions as seedSessions,
  assessments as seedAssessments,
  accessEvents as seedEvents,
  payments as seedPayments,
  membershipCards as seedCards,
  weightHistory as seedWeights,
  stats as seedStats,
  type Member,
  type TrainerProfile,
  type MembershipPlan,
  type Facility,
  type Testimonial,
  type DietPlan,
  type WorkoutDay,
  type Session,
  type Assessment,
  type AccessEvent,
  type Payment,
  type MembershipCard,
  type WeightEntry,
} from '@/data/mockData';

export interface SiteContent {
  tagline: string;
  heroHeadline: string;
  heroSupport: string;
  aboutHeading: string;
  aboutBody: string;
  ctaHeadline: string;
  announcement: string;
}

export interface GymSettings {
  name: string;
  shortName: string;
  email: string;
  phone: string;
  address: string;
  hours: { day: string; time: string }[];
  maxCapacity: number;
  notifications: { renewals: boolean; occupancyAlerts: boolean; paymentReminders: boolean };
  permissions: { trainerSeeAllClients: boolean; trainerEditMembership: boolean; staffIssueCards: boolean };
  readerConnected: boolean;
}

export interface SiteStats {
  members: number;
  trainers: number;
  programs: number;
  years: number;
}

export interface NamedPresence {
  memberId: string;
  name: string;
  enteredAt: string;
}

export interface TrainerNote {
  id: string;
  memberId: string;
  trainerId: string;
  date: string;
  note: string;
}

export interface ActionResult {
  ok: boolean;
  message: string;
}

export interface DietPlanInput {
  id?: string;
  memberId: string;
  trainerId: string;
  planName: string;
  effectiveDate: string;
  dailyCalories: number;
  proteinTarget: number;
  carbsTarget: number;
  fatsTarget: number;
  meals: DietPlan['meals'];
  notes: string;
  restrictions?: string;
  status: 'published' | 'draft';
}

export interface NewMemberInput {
  name: string;
  email: string;
  phone: string;
  membershipPlan: string;
  goal?: string;
  trainerId?: string;
  dob?: string;
  height?: string;
  weight?: number;
}

interface GymContextValue {
  members: Member[];
  trainers: TrainerProfile[];
  membershipPlans: MembershipPlan[];
  facilities: Facility[];
  testimonials: Testimonial[];
  dietPlans: DietPlan[];
  workoutPlans: Record<string, WorkoutDay[]>;
  sessions: Session[];
  assessments: Assessment[];
  accessEvents: AccessEvent[];
  payments: Payment[];
  cards: MembershipCard[];
  weightHistory: Record<string, WeightEntry[]>;
  trainerNotes: TrainerNote[];
  content: SiteContent;
  settings: GymSettings;
  siteStats: SiteStats;
  occupancy: {
    membersInside: number;
    maxCapacity: number;
    percentage: number;
    status: 'Quiet' | 'Moderate' | 'Busy';
    lastUpdated: string;
    anonymousInside: number;
    namedInside: NamedPresence[];
  };
  clientsForTrainer: (trainerId: string) => Member[];
  updateMember: (id: string, patch: Partial<Member>) => void;
  setMembershipStatus: (id: string, status: Member['membershipStatus']) => ActionResult;
  addMember: (input: NewMemberInput) => Member;
  updateTrainer: (id: string, patch: Partial<TrainerProfile>) => void;
  addTrainer: (input: Omit<TrainerProfile, 'id' | 'clients' | 'image' | 'alt'> & { image?: string }) => TrainerProfile;
  updatePlan: (id: string, patch: Partial<MembershipPlan>) => void;
  updateFacility: (id: string, patch: Partial<Facility>) => void;
  updateTestimonial: (id: string, patch: Partial<Testimonial>) => void;
  addTestimonial: (input: Omit<Testimonial, 'id'>) => void;
  removeTestimonial: (id: string) => void;
  updateContent: (patch: Partial<SiteContent>) => void;
  updateSettings: (patch: Partial<GymSettings>) => void;
  updateSiteStats: (patch: Partial<SiteStats>) => void;
  saveDietPlan: (input: DietPlanInput) => ActionResult;
  publishWorkout: (memberId: string, days: WorkoutDay[]) => ActionResult;
  toggleWorkoutDay: (memberId: string, day: string) => void;
  scheduleSession: (input: Omit<Session, 'id' | 'status'>) => ActionResult;
  updateSession: (id: string, patch: Partial<Session>) => void;
  addAssessment: (input: Omit<Assessment, 'id' | 'date'> & { date?: string }) => void;
  addTrainerNote: (input: Omit<TrainerNote, 'id' | 'date'>) => void;
  simulateEntry: (memberId: string) => ActionResult;
  simulateExit: (memberId: string) => ActionResult;
  simulateInvalidScan: () => ActionResult;
  setAnonymousInside: (count: number) => ActionResult;
  forceCheckout: (memberId: string) => ActionResult;
  clearStaleSessions: () => ActionResult;
  setCardStatus: (cardId: string, status: MembershipCard['status']) => void;
  replaceCard: (memberId: string) => ActionResult;
  issueCard: (memberId: string) => ActionResult;
  setPaymentStatus: (id: string, status: Payment['status']) => void;
  setReaderConnected: (connected: boolean) => void;
}

const GymContext = createContext<GymContextValue | undefined>(undefined);

export function todayIso(d = new Date()) {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function formatStamp(d = new Date()) {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${todayIso(d)} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function isStaleEntry(stamp: string) {
  const parsed = new Date(stamp.replace(' ', 'T'));
  if (Number.isNaN(parsed.getTime())) return false;
  return Date.now() - parsed.getTime() > 12 * 60 * 60 * 1000;
}

function occupancyStatus(pct: number): 'Quiet' | 'Moderate' | 'Busy' {
  if (pct < 35) return 'Quiet';
  if (pct < 70) return 'Moderate';
  return 'Busy';
}

const defaultContent: SiteContent = {
  tagline: brand.tagline,
  heroHeadline: 'BUILT FOR YOUR\nNEXT LEVEL.',
  heroSupport: 'Train with purpose. Track your progress. Become stronger every day.',
  aboutHeading: 'More Than a Gym.\nA Standard.',
  aboutBody:
    'We exist for people who take their training seriously. Forge is built on the principles of strength, consistency, and intelligent coaching — combining premium equipment with personalized programming to deliver sustainable, measurable progress.',
  ctaHeadline: 'YOUR STRONGEST CHAPTER\nSTARTS HERE.',
  announcement: '',
};

const defaultSettings: GymSettings = {
  name: brand.name,
  shortName: brand.shortName,
  email: brand.email,
  phone: brand.phone,
  address: brand.address,
  hours: brand.hours.map((h) => ({ ...h })),
  maxCapacity: 80,
  notifications: { renewals: true, occupancyAlerts: true, paymentReminders: true },
  permissions: { trainerSeeAllClients: false, trainerEditMembership: false, staffIssueCards: true },
  readerConnected: true,
};

export function GymProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>(() => seedMembers.map((m) => ({ ...m })));
  const [trainers, setTrainers] = useState<TrainerProfile[]>(() =>
    seedTrainerProfiles.map((t) => ({ ...t, certifications: [...t.certifications], workingHours: t.workingHours.map((h) => ({ ...h })), clients: [...t.clients] })),
  );
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>(() =>
    seedPlans.map((p) => ({
      ...p,
      benefits: [...p.benefits],
      renewalReminderDays: 14,
      accessNote: p.id === 'essential' ? 'Off-peak floor access' : 'All-hours floor access',
      active: true,
    })),
  );
  const [facilities, setFacilities] = useState<Facility[]>(() => seedFacilities.map((f) => ({ ...f, features: [...f.features] })));
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => seedTestimonials.map((t) => ({ ...t })));
  const [dietPlans, setDietPlans] = useState<DietPlan[]>(() => seedDietPlans.map((d) => ({ ...d, meals: { ...d.meals } })));
  const [workoutPlans, setWorkoutPlans] = useState<Record<string, WorkoutDay[]>>(() =>
    Object.fromEntries(Object.entries(seedWorkouts).map(([id, days]) => [id, days.map((day) => ({ ...day, exercises: day.exercises.map((e) => ({ ...e })) }))])),
  );
  const [sessions, setSessions] = useState<Session[]>(() => seedSessions.map((s) => ({ ...s })));
  const [assessments, setAssessments] = useState<Assessment[]>(() => seedAssessments.map((a) => ({ ...a })));
  const [accessEvents, setAccessEvents] = useState<AccessEvent[]>(() => seedEvents.map((e) => ({ ...e })));
  const [payments, setPayments] = useState<Payment[]>(() => seedPayments.map((p) => ({ ...p })));
  const [cards, setCards] = useState<MembershipCard[]>(() => seedCards.map((c) => ({ ...c, accessHistory: c.accessHistory.map((h) => ({ ...h })) })));
  const [weightHistory, setWeightHistory] = useState<Record<string, WeightEntry[]>>(() =>
    Object.fromEntries(Object.entries(seedWeights).map(([id, rows]) => [id, rows.map((r) => ({ ...r }))])),
  );
  const [trainerNotes, setTrainerNotes] = useState<TrainerNote[]>([
    {
      id: 'n1',
      memberId: 'm1',
      trainerId: 't1',
      date: '2026-10-08',
      note: 'Strength numbers are moving. Keep the lean bulk portions steady and film the next deadlift session for bar path.',
    },
  ]);
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [settings, setSettings] = useState<GymSettings>(defaultSettings);
  const [siteStats, setSiteStats] = useState<SiteStats>({ ...seedStats });
  const [anonymousInside, setAnonymousCount] = useState(41);
  const [namedInside, setNamedInside] = useState<NamedPresence[]>([
    { memberId: 'm2', name: 'Priya Sharma', enteredAt: '2026-10-10 10:15' },
  ]);
  const [updatedLabel, setUpdatedLabel] = useState('2 mins ago');

  const occupancy = useMemo(() => {
    const membersInside = anonymousInside + namedInside.length;
    const percentage = settings.maxCapacity === 0 ? 0 : Math.round((membersInside / settings.maxCapacity) * 1000) / 10;
    return {
      membersInside,
      maxCapacity: settings.maxCapacity,
      percentage,
      status: occupancyStatus(percentage),
      lastUpdated: updatedLabel,
      anonymousInside,
      namedInside,
    };
  }, [anonymousInside, namedInside, settings.maxCapacity, updatedLabel]);

  const logEvent = (event: Omit<AccessEvent, 'id'>) => {
    setAccessEvents((prev) => [{ ...event, id: `e${Date.now()}${Math.floor(Math.random() * 1000)}` }, ...prev]);
  };

  const touchCard = (memberId: string, stamp: string, result: string) => {
    setCards((prev) =>
      prev.map((c) =>
        c.memberId === memberId && (c.status === 'active' || c.status === 'inactive')
          ? { ...c, accessHistory: [{ date: stamp, result }, ...c.accessHistory].slice(0, 12) }
          : c,
      ),
    );
  };

  const value: GymContextValue = {
    members,
    trainers,
    membershipPlans,
    facilities,
    testimonials,
    dietPlans,
    workoutPlans,
    sessions,
    assessments,
    accessEvents,
    payments,
    cards,
    weightHistory,
    trainerNotes,
    content,
    settings,
    siteStats,
    occupancy,
    clientsForTrainer: (trainerId) =>
      settings.permissions.trainerSeeAllClients ? members : members.filter((m) => m.trainerId === trainerId),
    updateMember: (id, patch) => setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m))),
    setMembershipStatus: (id, status) => {
      const member = members.find((m) => m.id === id);
      if (!member) return { ok: false, message: 'Member not found.' };
      setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, membershipStatus: status } : m)));
      if (status !== 'Active') {
        setNamedInside((prev) => prev.filter((n) => n.memberId !== id));
        setUpdatedLabel('Just now');
      }
      return { ok: true, message: `${member.name} is now ${status}.` };
    },
    addMember: (input) => {
      const id = `m${Date.now()}`;
      const today = todayIso();
      const expiry = new Date();
      expiry.setFullYear(expiry.getFullYear() + 1);
      const membershipNumber = `FFC-${new Date().getFullYear()}-${String(members.length + 90).padStart(4, '0')}`;
      const member: Member = {
        id,
        name: input.name,
        email: input.email,
        phone: input.phone,
        dob: input.dob || '1994-01-01',
        height: input.height || `5'10"`,
        weight: input.weight ?? 75,
        goal: input.goal || 'General fitness',
        emergencyContact: 'Not provided',
        trainerId: input.trainerId || 't1',
        membershipPlan: input.membershipPlan,
        membershipStatus: 'Active',
        joinDate: today,
        expiryDate: todayIso(expiry),
        membershipNumber,
        profileImage: 'https://images.pexels.com/photos/29886673/pexels-photo-29886673.jpeg?auto=compress&cs=tinysrgb&w=400',
        allergies: 'None disclosed',
        dietaryPrefs: 'Not specified',
      };
      setMembers((prev) => [...prev, member]);
      setCards((prev) => [
        ...prev,
        { id: `c${Date.now()}`, memberId: id, cardId: `CARD-${membershipNumber.slice(-4)}-A`, status: 'active', issuedDate: today, accessHistory: [] },
      ]);
      setSiteStats((prev) => ({ ...prev, members: prev.members + 1 }));
      return member;
    },
    updateTrainer: (id, patch) => setTrainers((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t))),
    addTrainer: (input) => {
      const trainer: TrainerProfile = {
        id: `t${Date.now()}`,
        name: input.name,
        specialization: input.specialization,
        certifications: input.certifications,
        experience: input.experience,
        bio: input.bio,
        image: input.image || seedTrainers[0].image,
        alt: `Portrait of ${input.name}`,
        category: input.category,
        clients: [],
        workingHours: input.workingHours,
      };
      setTrainers((prev) => [...prev, trainer]);
      setSiteStats((prev) => ({ ...prev, trainers: prev.trainers + 1 }));
      return trainer;
    },
    updatePlan: (id, patch) =>
      setMembershipPlans((prev) =>
        prev.map((p) => {
          if (patch.recommended && p.id !== id) return { ...p, recommended: false };
          return p.id === id ? { ...p, ...patch } : p;
        }),
      ),
    updateFacility: (id, patch) => setFacilities((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f))),
    updateTestimonial: (id, patch) => setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t))),
    addTestimonial: (input) => setTestimonials((prev) => [...prev, { ...input, id: `test${Date.now()}` }]),
    removeTestimonial: (id) => setTestimonials((prev) => prev.filter((t) => t.id !== id)),
    updateContent: (patch) => setContent((prev) => ({ ...prev, ...patch })),
    updateSettings: (patch) => setSettings((prev) => ({ ...prev, ...patch, hours: patch.hours ? patch.hours.map((h) => ({ ...h })) : prev.hours })),
    updateSiteStats: (patch) => setSiteStats((prev) => ({ ...prev, ...patch })),
    saveDietPlan: (input) => {
      if (!input.memberId || !input.planName.trim()) return { ok: false, message: 'Choose a client and name the plan.' };
      const today = todayIso();
      if (input.id) {
        setDietPlans((prev) => prev.map((p) => {
          if (input.status === 'published' && p.memberId === input.memberId && p.id !== input.id && p.status === 'published') {
            return { ...p, status: 'draft' };
          }
          return p.id === input.id ? { ...p, ...input, id: input.id as string, lastUpdated: today } : p;
        }));
        return { ok: true, message: input.status === 'published' ? 'Plan updated and published to the member portal.' : 'Draft saved.' };
      }
      const plan: DietPlan = { ...input, id: `dp${Date.now()}`, lastUpdated: today };
      setDietPlans((prev) => [plan, ...prev.map((p) => (input.status === 'published' && p.memberId === input.memberId && p.status === 'published' ? { ...p, status: 'draft' as const } : p))]);
      return { ok: true, message: input.status === 'published' ? 'Plan published. It is now visible in the member portal.' : 'Draft saved. It stays hidden from the member until you publish it.' };
    },
    publishWorkout: (memberId, days) => {
      if (!memberId || days.length === 0) return { ok: false, message: 'Choose a client and add at least one exercise.' };
      setWorkoutPlans((prev) => ({ ...prev, [memberId]: days }));
      return { ok: true, message: 'Workout plan published to the member portal.' };
    },
    toggleWorkoutDay: (memberId, day) =>
      setWorkoutPlans((prev) => ({
        ...prev,
        [memberId]: (prev[memberId] || []).map((d) => (d.day === day ? { ...d, completed: !d.completed } : d)),
      })),
    scheduleSession: (input) => {
      const trainerClash = sessions.find((s) => s.trainerId === input.trainerId && s.date === input.date && s.time === input.time && s.status !== 'cancelled');
      if (trainerClash) return { ok: false, message: 'That time is already booked for you. Choose another slot.' };
      const clientClash = sessions.find((s) => s.memberId === input.memberId && s.date === input.date && s.time === input.time && s.status !== 'cancelled');
      if (clientClash) return { ok: false, message: 'This client already has a session at that time.' };
      setSessions((prev) => [...prev, { ...input, id: `s${Date.now()}`, status: 'upcoming' }]);
      return { ok: true, message: 'Session scheduled.' };
    },
    updateSession: (id, patch) => setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s))),
    addAssessment: (input) => {
      const date = input.date || todayIso();
      setAssessments((prev) => [...prev, { id: `a${Date.now()}`, memberId: input.memberId, date, weight: input.weight, bodyFat: input.bodyFat, muscleMass: input.muscleMass, notes: input.notes }]);
      setMembers((prev) => prev.map((m) => (m.id === input.memberId ? { ...m, weight: input.weight } : m)));
      setWeightHistory((prev) => ({ ...prev, [input.memberId]: [...(prev[input.memberId] || []), { date, weight: input.weight }] }));
    },
    addTrainerNote: (input) => setTrainerNotes((prev) => [{ ...input, id: `n${Date.now()}`, date: todayIso() }, ...prev]),
    simulateEntry: (memberId) => {
      const member = members.find((m) => m.id === memberId);
      if (!member) return { ok: false, message: 'Member not found.' };
      const stamp = formatStamp();
      const base = { memberId: member.membershipNumber, memberName: member.name, eventType: 'entry' as const, timestamp: stamp };
      if (!settings.readerConnected) {
        logEvent({ ...base, result: 'invalid', note: 'Reader offline — simulated' });
        return { ok: false, message: 'Reader is offline in this simulation. Entry was not counted.' };
      }
      const card = cards.find((c) => c.memberId === member.id && c.status === 'active');
      if (member.membershipStatus !== 'Active') {
        logEvent({ ...base, result: 'denied', note: `Membership ${member.membershipStatus}` });
        touchCard(member.id, stamp, `Denied — ${member.membershipStatus}`);
        return { ok: false, message: `${member.name} was denied. Membership is ${member.membershipStatus}.` };
      }
      if (!card) {
        logEvent({ ...base, result: 'denied', note: 'No active card' });
        return { ok: false, message: `${member.name} has no active card.` };
      }
      if (namedInside.some((n) => n.memberId === member.id)) {
        logEvent({ ...base, result: 'denied', note: 'Duplicate scan ignored' });
        touchCard(member.id, stamp, 'Denied — duplicate scan');
        return { ok: false, message: `Duplicate scan ignored. ${member.name} is already inside.` };
      }
      if (anonymousInside + namedInside.length >= settings.maxCapacity) {
        logEvent({ ...base, result: 'denied', note: 'At capacity' });
        return { ok: false, message: 'Gym is at capacity. Entry was not counted.' };
      }
      setNamedInside((prev) => [...prev, { memberId: member.id, name: member.name, enteredAt: stamp }]);
      setUpdatedLabel('Just now');
      logEvent({ ...base, result: 'granted', note: 'Simulated entry' });
      touchCard(member.id, stamp, 'Granted');
      return { ok: true, message: `${member.name} checked in. Occupancy now includes this visit.` };
    },
    simulateExit: (memberId) => {
      const member = members.find((m) => m.id === memberId);
      if (!member) return { ok: false, message: 'Member not found.' };
      const stamp = formatStamp();
      const base = { memberId: member.membershipNumber, memberName: member.name, eventType: 'exit' as const, timestamp: stamp };
      if (!namedInside.some((n) => n.memberId === member.id)) {
        logEvent({ ...base, result: 'denied', note: 'No open entry to close' });
        return { ok: false, message: `${member.name} has no open entry. Occupancy was not reduced.` };
      }
      setNamedInside((prev) => prev.filter((n) => n.memberId !== member.id));
      setUpdatedLabel('Just now');
      logEvent({ ...base, result: 'granted', note: 'Simulated exit' });
      touchCard(member.id, stamp, 'Exit granted');
      return { ok: true, message: `${member.name} checked out.` };
    },
    simulateInvalidScan: () => {
      logEvent({ memberId: 'UNKNOWN', memberName: 'Unknown Card', eventType: 'entry', timestamp: formatStamp(), result: 'invalid', note: 'Unrecognized card' });
      return { ok: false, message: 'Invalid card scan recorded. Occupancy did not change.' };
    },
    setAnonymousInside: (count) => {
      const safe = Math.max(0, Math.floor(Number.isFinite(count) ? count : 0));
      setAnonymousCount(safe);
      setUpdatedLabel('Just now');
      logEvent({ memberId: 'ADMIN', memberName: 'Manual correction', eventType: 'entry', timestamp: formatStamp(), result: 'granted', note: `Anonymous headcount set to ${safe}` });
      return { ok: true, message: `Aggregated headcount set to ${safe}. Named visits are unchanged.` };
    },
    forceCheckout: (memberId) => {
      const person = namedInside.find((n) => n.memberId === memberId);
      if (!person) return { ok: false, message: 'That member is not in the named inside list.' };
      setNamedInside((prev) => prev.filter((n) => n.memberId !== memberId));
      setUpdatedLabel('Just now');
      const member = members.find((m) => m.id === memberId);
      logEvent({
        memberId: member?.membershipNumber || memberId,
        memberName: person.name,
        eventType: 'exit',
        timestamp: formatStamp(),
        result: 'granted',
        note: 'Manual correction — forgotten exit',
      });
      return { ok: true, message: `${person.name} was checked out by an administrator.` };
    },
    clearStaleSessions: () => {
      const stale = namedInside.filter((n) => isStaleEntry(n.enteredAt));
      if (stale.length === 0) return { ok: true, message: 'No open visits older than 12 hours.' };
      setNamedInside((prev) => prev.filter((n) => !isStaleEntry(n.enteredAt)));
      setUpdatedLabel('Just now');
      stale.forEach((person) => {
        const member = members.find((m) => m.id === person.memberId);
        logEvent({
          memberId: member?.membershipNumber || person.memberId,
          memberName: person.name,
          eventType: 'exit',
          timestamp: formatStamp(),
          result: 'granted',
          note: 'Auto-cleared stale visit (12h safeguard)',
        });
      });
      return { ok: true, message: `Cleared ${stale.length} visit${stale.length === 1 ? '' : 's'} open longer than 12 hours.` };
    },
    setCardStatus: (cardId, status) => setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, status } : c))),
    replaceCard: (memberId) => {
      const member = members.find((m) => m.id === memberId);
      if (!member) return { ok: false, message: 'Member not found.' };
      const stamp = todayIso();
      setCards((prev) => {
        const retired = prev.map((c) => (c.memberId === memberId && c.status !== 'replaced' ? { ...c, status: 'replaced' as const } : c));
        return [...retired, { id: `c${Date.now()}`, memberId, cardId: `CARD-${member.membershipNumber.slice(-4)}-R${retired.filter((c) => c.memberId === memberId).length}`, status: 'active', issuedDate: stamp, accessHistory: [] }];
      });
      return { ok: true, message: `Replacement card issued for ${member.name}. The previous card is inactive.` };
    },
    issueCard: (memberId) => {
      const member = members.find((m) => m.id === memberId);
      if (!member) return { ok: false, message: 'Member not found.' };
      if (cards.some((c) => c.memberId === memberId && c.status === 'active')) return { ok: false, message: 'This member already has an active card.' };
      setCards((prev) => [...prev, { id: `c${Date.now()}`, memberId, cardId: `CARD-${member.membershipNumber.slice(-4)}-N`, status: 'active', issuedDate: todayIso(), accessHistory: [] }]);
      return { ok: true, message: `Card issued for ${member.name}.` };
    },
    setPaymentStatus: (id, status) => setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p))),
    setReaderConnected: (connected) => setSettings((prev) => ({ ...prev, readerConnected: connected })),
  };

  return <GymContext.Provider value={value}>{children}</GymContext.Provider>;
}

export function useGym() {
  const ctx = useContext(GymContext);
  if (!ctx) throw new Error('useGym must be used within GymProvider');
  return ctx;
}
