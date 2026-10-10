// Centralized mock data for FORGE FITNESS CLUB
// All data is illustrative for the frontend prototype.

export const images = {
  hero: 'https://images.pexels.com/photos/6389516/pexels-photo-6389516.jpeg?auto=compress&cs=tinysrgb&w=1920',
  heroAlt: 'A lone barbell on the gym floor with a misty background',
  about: 'https://images.pexels.com/photos/6389893/pexels-photo-6389893.jpeg?auto=compress&cs=tinysrgb&w=1600',
  aboutAlt: 'An individual standing on a gym floor behind two dumbbells',
  strength: 'https://images.pexels.com/photos/931321/pexels-photo-931321.jpeg?auto=compress&cs=tinysrgb&w=1200',
  cardio: 'https://images.pexels.com/photos/13211514/pexels-photo-13211514.jpeg?auto=compress&cs=tinysrgb&w=1200',
  functional: 'https://images.pexels.com/photos/7187951/pexels-photo-7187951.jpeg?auto=compress&cs=tinysrgb&w=1200',
  recovery: 'https://images.pexels.com/photos/4804321/pexels-photo-4804321.jpeg?auto=compress&cs=tinysrgb&w=1200',
  group: 'https://images.pexels.com/photos/6339401/pexels-photo-6339401.jpeg?auto=compress&cs=tinysrgb&w=1200',
  personal: 'https://images.pexels.com/photos/6455788/pexels-photo-6455788.jpeg?auto=compress&cs=tinysrgb&w=1200',
  cta: 'https://images.pexels.com/photos/4753884/pexels-photo-4753884.jpeg?auto=compress&cs=tinysrgb&w=1920',
  silhouette: 'https://images.pexels.com/photos/4753884/pexels-photo-4753884.jpeg?auto=compress&cs=tinysrgb&w=1600',
};

export const stats = {
  members: 1240,
  trainers: 18,
  programs: 32,
  years: 12,
};

export const occupancy = {
  membersInside: 42,
  maxCapacity: 80,
  percentage: 52.5,
  status: 'Moderate' as const,
  lastUpdated: '2 mins ago',
};

export interface Facility {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  features: string[];
}

export const facilities: Facility[] = [
  {
    id: 'strength',
    title: 'Strength & Free Weights',
    description: 'Olympic platforms, power racks, and a full complement of plates and dumbbells up to 50kg. Built for serious lifting.',
    image: images.strength,
    alt: 'Athlete lifting heavy barbell during strength training',
    features: ['8 Power Racks', 'Olympic Platforms', 'Dumbbells to 50kg', 'Plate-loaded Machines'],
  },
  {
    id: 'cardio',
    title: 'Cardio Training',
    description: 'Premium treadmills, rowers, assault bikes, and stair climbers with personal screens and heart-rate integration.',
    image: images.cardio,
    alt: 'Two men running on treadmills in a modern gym',
    features: ['24 Treadmills', 'Concept2 Rowers', 'Assault Bikes', 'Stair Climbers'],
  },
  {
    id: 'functional',
    title: 'Functional Training',
    description: 'A dedicated functional zone with sled tracks, battle ropes, kettlebells, and plyometric platforms for athletic conditioning.',
    image: images.functional,
    alt: 'Athletic man training with battle ropes in a gym',
    features: ['Sled Track', 'Battle Ropes', 'Kettlebell Rack', 'Plyo Boxes'],
  },
  {
    id: 'personal',
    title: 'Personal Training',
    description: 'Private coaching bays with one-on-one attention from certified trainers. Tailored programming for every goal.',
    image: images.personal,
    alt: 'Woman exercising with battle ropes near a professional instructor',
    features: ['Private Coaching Bays', '1-on-1 Sessions', 'Custom Programs', 'Progress Tracking'],
  },
  {
    id: 'recovery',
    title: 'Recovery & Mobility',
    description: 'Stretching areas, foam rollers, massage guns, and a dedicated recovery zone to keep you performing at your best.',
    image: images.recovery,
    alt: 'Man stretching on gym floor',
    features: ['Recovery Zone', 'Foam Rollers', 'Massage Guns', 'Stretching Area'],
  },
  {
    id: 'group',
    title: 'Group Fitness Classes',
    description: 'HIIT, spin, yoga, and strength-focused group classes in a dedicated studio. Limited spots for maximum coaching quality.',
    image: images.group,
    alt: 'Adults exercising in a yoga studio',
    features: ['HIIT Classes', 'Spin Studio', 'Yoga & Mobility', 'Strength Circuits'],
  },
];

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  recommended?: boolean;
  description: string;
  benefits: string[];
  renewalReminderDays?: number;
  accessNote?: string;
  active?: boolean;
}

export const membershipPlans: MembershipPlan[] = [
  {
    id: 'essential',
    name: 'Essential',
    price: 39,
    duration: 'month',
    description: 'Full access to the gym floor and cardio zone during off-peak hours.',
    benefits: [
      'Gym floor access (off-peak)',
      'Cardio zone access',
      '2 group classes / month',
      'Locker room access',
      'Fitness assessment (quarterly)',
    ],
  },
  {
    id: 'performance',
    name: 'Performance',
    price: 79,
    duration: 'month',
    recommended: true,
    description: 'Unlimited access plus group classes and monthly trainer check-ins.',
    benefits: [
      'Unlimited gym access (all hours)',
      'Unlimited group classes',
      '1 PT session / month',
      'Personalized workout program',
      'Monthly fitness assessment',
      'Recovery zone access',
    ],
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 149,
    duration: 'month',
    description: 'Everything included with priority booking and dedicated trainer support.',
    benefits: [
      'Everything in Performance',
      '4 PT sessions / month',
      'Dedicated trainer support',
      'Custom diet plan',
      'Priority class booking',
      'Guest passes (2 / month)',
      'Quarterly body composition scan',
    ],
  },
];

export interface Trainer {
  id: string;
  name: string;
  specialization: string;
  certifications: string[];
  experience: number;
  bio: string;
  image: string;
  alt: string;
  category: string;
}

export const trainers: Trainer[] = [
  {
    id: 't1',
    name: 'Marcus Reilly',
    specialization: 'Strength & Powerlifting',
    certifications: ['NSCA-CSCS', 'USAW Level 2'],
    experience: 9,
    bio: 'Former national powerlifter specializing in barbell mechanics and progressive overload systems for serious lifters.',
    image: 'https://images.pexels.com/photos/10305231/pexels-photo-10305231.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Portrait of a muscular male bodybuilder',
    category: 'Strength Training',
  },
  {
    id: 't2',
    name: 'Elena Vasquez',
    specialization: 'Weight Management & Conditioning',
    certifications: ['NASM-CPT', 'PN Level 1 Nutrition'],
    experience: 7,
    bio: 'Helps clients transform body composition through sustainable nutrition strategies and metabolic conditioning.',
    image: 'https://images.pexels.com/photos/31245340/pexels-photo-31245340.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Portrait of a confident athletic woman in sportswear',
    category: 'Weight Management',
  },
  {
    id: 't3',
    name: 'James Okonkwo',
    specialization: 'Functional Fitness & Athletics',
    certifications: ['CrossFit L3', 'NSCA-CSCS'],
    experience: 6,
    bio: 'Competitive CrossFit athlete bringing high-intensity functional training to all fitness levels.',
    image: 'https://images.pexels.com/photos/13211450/pexels-photo-13211450.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Athletic man in a red tank top showing biceps',
    category: 'Functional Fitness',
  },
  {
    id: 't4',
    name: 'Sofia Lindqvist',
    specialization: 'Mobility & Recovery',
    certifications: ['FRC Certified', 'RYT-200 Yoga'],
    experience: 8,
    bio: 'Physical therapist turned trainer, focusing on movement quality, mobility, and injury prevention.',
    image: 'https://images.pexels.com/photos/30246174/pexels-photo-30246174.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Woman in gym clothing posing confidently',
    category: 'Mobility',
  },
];

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 'test1',
    name: 'David K.',
    role: 'Member since 2022',
    quote: 'The coaching at Forge is unlike anything I have experienced. My deadlift went from 120kg to 200kg in a year.',
  },
  {
    id: 'test2',
    name: 'Sarah M.',
    role: 'Performance member',
    quote: 'The personalized diet plan and weekly check-ins kept me accountable. I lost 15kg and feel stronger than ever.',
  },
  {
    id: 'test3',
    name: 'Tom R.',
    role: 'Elite member',
    quote: 'Having a dedicated trainer who actually tracks my progress changed everything. This is a real fitness community.',
  },
];

// ---- Portal Mock Data ----

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  height: string;
  weight: number;
  goal: string;
  emergencyContact: string;
  trainerId: string;
  membershipPlan: string;
  membershipStatus: 'Active' | 'Expiring' | 'Suspended' | 'Inactive';
  joinDate: string;
  expiryDate: string;
  membershipNumber: string;
  profileImage: string;
  allergies: string;
  dietaryPrefs: string;
}

export const members: Member[] = [
  {
    id: 'm1',
    name: 'Alex Chen',
    email: 'alex.chen@email.com',
    phone: '+1 555 234 8890',
    dob: '1992-03-15',
    height: "5'10\"",
    weight: 78,
    goal: 'Build muscle mass and improve overall strength',
    emergencyContact: 'Jenny Chen — +1 555 234 8891',
    trainerId: 't1',
    membershipPlan: 'Performance',
    membershipStatus: 'Active',
    joinDate: '2024-01-15',
    expiryDate: '2026-01-15',
    membershipNumber: 'FFC-2024-0012',
    profileImage: 'https://images.pexels.com/photos/29886673/pexels-photo-29886673.jpeg?auto=compress&cs=tinysrgb&w=400',
    allergies: 'None',
    dietaryPrefs: 'No restrictions',
  },
  {
    id: 'm2',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+1 555 345 7781',
    dob: '1995-08-22',
    height: "5'6\"",
    weight: 62,
    goal: 'Weight loss and improved cardiovascular endurance',
    emergencyContact: 'Raj Sharma — +1 555 345 7782',
    trainerId: 't2',
    membershipPlan: 'Elite',
    membershipStatus: 'Active',
    joinDate: '2023-11-01',
    expiryDate: '2026-11-01',
    membershipNumber: 'FFC-2023-0087',
    profileImage: 'https://images.pexels.com/photos/31245340/pexels-photo-31245340.jpeg?auto=compress&cs=tinysrgb&w=400',
    allergies: 'Lactose intolerant',
    dietaryPrefs: 'Vegetarian',
  },
  {
    id: 'm3',
    name: 'James Wilson',
    email: 'james.wilson@email.com',
    phone: '+1 555 456 1122',
    dob: '1988-12-01',
    height: "6'1\"",
    weight: 92,
    goal: 'Functional fitness and athletic conditioning',
    emergencyContact: 'Mary Wilson — +1 555 456 1123',
    trainerId: 't3',
    membershipPlan: 'Performance',
    membershipStatus: 'Expiring',
    joinDate: '2024-03-20',
    expiryDate: '2026-11-20',
    membershipNumber: 'FFC-2024-0034',
    profileImage: 'https://images.pexels.com/photos/30165254/pexels-photo-30165254.jpeg?auto=compress&cs=tinysrgb&w=400',
    allergies: 'Peanuts',
    dietaryPrefs: 'High protein',
  },
  {
    id: 'm4',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '+1 555 567 9981',
    dob: '1997-05-18',
    height: "5'8\"",
    weight: 58,
    goal: 'Improve mobility and recover from knee injury',
    emergencyContact: 'Robert Davis — +1 555 567 9982',
    trainerId: 't4',
    membershipPlan: 'Elite',
    membershipStatus: 'Active',
    joinDate: '2024-06-10',
    expiryDate: '2026-06-10',
    membershipNumber: 'FFC-2024-0056',
    profileImage: 'https://images.pexels.com/photos/30246174/pexels-photo-30246174.jpeg?auto=compress&cs=tinysrgb&w=400',
    allergies: 'None',
    dietaryPrefs: 'Pescatarian',
  },
  {
    id: 'm5',
    name: 'Chris Taylor',
    email: 'chris.taylor@email.com',
    phone: '+1 555 678 4451',
    dob: '1990-09-30',
    height: "5'11\"",
    weight: 85,
    goal: 'Powerlifting competition prep',
    emergencyContact: 'Lisa Taylor — +1 555 678 4452',
    trainerId: 't1',
    membershipPlan: 'Elite',
    membershipStatus: 'Active',
    joinDate: '2023-08-12',
    expiryDate: '2026-08-12',
    membershipNumber: 'FFC-2023-0065',
    profileImage: 'https://images.pexels.com/photos/8875302/pexels-photo-8875302.jpeg?auto=compress&cs=tinysrgb&w=400',
    allergies: 'None',
    dietaryPrefs: 'No restrictions',
  },
  {
    id: 'm6',
    name: 'Nina Patel',
    email: 'nina.patel@email.com',
    phone: '+1 555 789 3320',
    dob: '1993-02-14',
    height: "5'5\"",
    weight: 55,
    goal: 'General fitness and body recomposition',
    emergencyContact: 'Amit Patel — +1 555 789 3321',
    trainerId: 't2',
    membershipPlan: 'Essential',
    membershipStatus: 'Suspended',
    joinDate: '2024-07-01',
    expiryDate: '2026-07-01',
    membershipNumber: 'FFC-2024-0078',
    profileImage: 'https://images.pexels.com/photos/31245340/pexels-photo-31245340.jpeg?auto=compress&cs=tinysrgb&w=400',
    allergies: 'Gluten',
    dietaryPrefs: 'Gluten-free',
  },
];

export interface WeightEntry {
  date: string;
  weight: number;
}

export const weightHistory: Record<string, WeightEntry[]> = {
  m1: [
    { date: '2025-07-10', weight: 82 },
    { date: '2025-08-10', weight: 81 },
    { date: '2025-09-10', weight: 80 },
    { date: '2025-10-10', weight: 78 },
  ],
  m2: [
    { date: '2025-07-10', weight: 68 },
    { date: '2025-08-10', weight: 66 },
    { date: '2025-09-10', weight: 64 },
    { date: '2025-10-10', weight: 62 },
  ],
};

export interface DietMeal {
  name: string;
  items: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface DietPlan {
  id: string;
  memberId: string;
  trainerId: string;
  planName: string;
  effectiveDate: string;
  lastUpdated: string;
  dailyCalories: number;
  proteinTarget: number;
  carbsTarget: number;
  fatsTarget: number;
  meals: {
    breakfast: DietMeal;
    lunch: DietMeal;
    snack: DietMeal;
    dinner: DietMeal;
  };
  notes: string;
  restrictions?: string;
  status: 'published' | 'draft';
}

export const dietPlans: DietPlan[] = [
  {
    id: 'dp1',
    memberId: 'm1',
    trainerId: 't1',
    planName: 'Lean Bulk Program',
    effectiveDate: '2025-10-01',
    lastUpdated: '2025-10-08',
    dailyCalories: 2800,
    proteinTarget: 180,
    carbsTarget: 320,
    fatsTarget: 80,
    meals: {
      breakfast: {
        name: 'Breakfast',
        items: '4 egg whites, 2 whole eggs, 80g oats with banana, 1 tbsp peanut butter',
        calories: 620,
        protein: 38,
        carbs: 72,
        fats: 18,
      },
      lunch: {
        name: 'Lunch',
        items: '200g grilled chicken breast, 150g brown rice, 100g steamed broccoli, olive oil',
        calories: 720,
        protein: 52,
        carbs: 85,
        fats: 20,
      },
      snack: {
        name: 'Evening Snack',
        items: '1 scoop whey protein, 1 apple, 30g almonds',
        calories: 380,
        protein: 28,
        carbs: 32,
        fats: 16,
      },
      dinner: {
        name: 'Dinner',
        items: '200g salmon, 120g sweet potato, mixed green salad with avocado',
        calories: 650,
        protein: 42,
        carbs: 45,
        fats: 28,
      },
    },
    notes: 'Focus on caloric surplus with clean carbs. Drink 3L water daily. Adjust portions based on weekly weigh-in.',
    status: 'published',
  },
  {
    id: 'dp2',
    memberId: 'm2',
    trainerId: 't2',
    planName: 'Cutting Phase',
    effectiveDate: '2025-09-15',
    lastUpdated: '2025-10-05',
    dailyCalories: 1600,
    proteinTarget: 120,
    carbsTarget: 140,
    fatsTarget: 45,
    meals: {
      breakfast: {
        name: 'Breakfast',
        items: '2 eggs, 40g oats with berries, black coffee',
        calories: 380,
        protein: 22,
        carbs: 42,
        fats: 12,
      },
      lunch: {
        name: 'Lunch',
        items: '150g grilled chicken, 100g quinoa, cucumber salad',
        calories: 450,
        protein: 38,
        carbs: 48,
        fats: 10,
      },
      snack: {
        name: 'Evening Snack',
        items: 'Greek yogurt 150g with handful of walnuts',
        calories: 220,
        protein: 18,
        carbs: 15,
        fats: 10,
      },
      dinner: {
        name: 'Dinner',
        items: '150g white fish, 100g roasted vegetables, 1 tsp olive oil',
        calories: 380,
        protein: 32,
        carbs: 25,
        fats: 13,
      },
    },
    notes: 'Maintain caloric deficit. No added sugar. Increase water intake to 2.5L daily.',
    status: 'published',
  },
];

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  duration: string;
  exercises: WorkoutExercise[];
  completed: boolean;
}

export const workoutPlans: Record<string, WorkoutDay[]> = {
  m1: [
    {
      day: 'Monday',
      focus: 'Chest & Triceps',
      duration: '75 min',
      completed: true,
      exercises: [
        { name: 'Barbell Bench Press', sets: 4, reps: '6-8', rest: '2 min', notes: 'Heavy — focus on form' },
        { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: '90 sec' },
        { name: 'Cable Flyes', sets: 3, reps: '12-15', rest: '60 sec' },
        { name: 'Tricep Pushdowns', sets: 3, reps: '12-15', rest: '60 sec' },
        { name: 'Overhead Tricep Extension', sets: 3, reps: '10-12', rest: '60 sec' },
      ],
    },
    {
      day: 'Tuesday',
      focus: 'Back & Biceps',
      duration: '75 min',
      completed: true,
      exercises: [
        { name: 'Deadlift', sets: 4, reps: '5', rest: '3 min', notes: 'Working sets at 80% 1RM' },
        { name: 'Pull-ups', sets: 3, reps: '8-10', rest: '90 sec' },
        { name: 'Barbell Row', sets: 3, reps: '8-10', rest: '90 sec' },
        { name: 'Barbell Curl', sets: 3, reps: '10-12', rest: '60 sec' },
        { name: 'Hammer Curls', sets: 3, reps: '12', rest: '60 sec' },
      ],
    },
    {
      day: 'Wednesday',
      focus: 'Rest / Active Recovery',
      duration: '30 min',
      completed: false,
      exercises: [
        { name: 'Foam Rolling', sets: 1, reps: '15 min', rest: '—' },
        { name: 'Light Walk', sets: 1, reps: '15 min', rest: '—' },
      ],
    },
    {
      day: 'Thursday',
      focus: 'Legs',
      duration: '90 min',
      completed: false,
      exercises: [
        { name: 'Back Squat', sets: 4, reps: '6-8', rest: '3 min', notes: 'Focus on depth' },
        { name: 'Romanian Deadlift', sets: 3, reps: '8-10', rest: '90 sec' },
        { name: 'Walking Lunges', sets: 3, reps: '12 each leg', rest: '90 sec' },
        { name: 'Leg Press', sets: 3, reps: '12-15', rest: '60 sec' },
        { name: 'Calf Raises', sets: 4, reps: '15-20', rest: '45 sec' },
      ],
    },
    {
      day: 'Friday',
      focus: 'Shoulders & Core',
      duration: '60 min',
      completed: false,
      exercises: [
        { name: 'Overhead Press', sets: 4, reps: '6-8', rest: '2 min' },
        { name: 'Lateral Raises', sets: 3, reps: '12-15', rest: '60 sec' },
        { name: 'Face Pulls', sets: 3, reps: '15-20', rest: '60 sec' },
        { name: 'Hanging Leg Raises', sets: 3, reps: '12-15', rest: '60 sec' },
        { name: 'Plank', sets: 3, reps: '45 sec', rest: '45 sec' },
      ],
    },
    {
      day: 'Saturday',
      focus: 'Conditioning',
      duration: '45 min',
      completed: false,
      exercises: [
        { name: 'Rowing Intervals', sets: 6, reps: '250m', rest: '90 sec' },
        { name: 'Battle Ropes', sets: 4, reps: '30 sec', rest: '30 sec' },
        { name: 'Box Jumps', sets: 4, reps: '12', rest: '60 sec' },
      ],
    },
  ],
};

export interface Session {
  id: string;
  memberId: string;
  trainerId: string;
  date: string;
  time: string;
  type: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export const sessions: Session[] = [
  { id: 's1', memberId: 'm1', trainerId: 't1', date: '2026-10-12', time: '10:00 AM', type: 'Strength Session', status: 'upcoming' },
  { id: 's2', memberId: 'm5', trainerId: 't1', date: '2026-10-12', time: '11:30 AM', type: 'Squat Technique', status: 'upcoming' },
  { id: 's3', memberId: 'm2', trainerId: 't2', date: '2026-10-11', time: '2:00 PM', type: 'Conditioning', status: 'upcoming' },
  { id: 's4', memberId: 'm3', trainerId: 't3', date: '2026-10-11', time: '4:00 PM', type: 'Functional Training', status: 'upcoming' },
  { id: 's5', memberId: 'm4', trainerId: 't4', date: '2026-10-13', time: '9:00 AM', type: 'Mobility Assessment', status: 'upcoming' },
];

export interface Assessment {
  id: string;
  memberId: string;
  date: string;
  weight: number;
  bodyFat: number;
  muscleMass: number;
  notes: string;
}

export const assessments: Assessment[] = [
  { id: 'a1', memberId: 'm1', date: '2025-07-15', weight: 82, bodyFat: 18, muscleMass: 64, notes: 'Good progress, increase protein intake' },
  { id: 'a2', memberId: 'm1', date: '2025-10-08', weight: 78, bodyFat: 15, muscleMass: 65, notes: 'Excellent strength gains, lean bulk working' },
  { id: 'a3', memberId: 'm2', date: '2025-09-20', weight: 64, bodyFat: 22, muscleMass: 47, notes: 'On track with cutting phase' },
];

export interface AccessEvent {
  id: string;
  memberId: string;
  memberName: string;
  eventType: 'entry' | 'exit';
  timestamp: string;
  result: 'granted' | 'denied' | 'invalid';
  note?: string;
}

export const accessEvents: AccessEvent[] = [
  { id: 'e1', memberId: 'FFC-2024-0012', memberName: 'Alex Chen', eventType: 'entry', timestamp: '2026-10-10 08:14', result: 'granted' },
  { id: 'e2', memberId: 'FFC-2023-0065', memberName: 'Chris Taylor', eventType: 'entry', timestamp: '2026-10-10 08:22', result: 'granted' },
  { id: 'e3', memberId: 'FFC-2024-0034', memberName: 'James Wilson', eventType: 'entry', timestamp: '2026-10-10 09:01', result: 'granted' },
  { id: 'e4', memberId: 'FFC-2024-0012', memberName: 'Alex Chen', eventType: 'exit', timestamp: '2026-10-10 09:35', result: 'granted' },
  { id: 'e5', memberId: 'UNKNOWN', memberName: 'Unknown Card', eventType: 'entry', timestamp: '2026-10-10 09:42', result: 'invalid' },
  { id: 'e6', memberId: 'FFC-2024-0087', memberName: 'Priya Sharma', eventType: 'entry', timestamp: '2026-10-10 10:15', result: 'granted' },
  { id: 'e7', memberId: 'FFC-2023-0065', memberName: 'Chris Taylor', eventType: 'exit', timestamp: '2026-10-10 10:30', result: 'granted' },
  { id: 'e8', memberId: 'FFC-2024-0034', memberName: 'James Wilson', eventType: 'exit', timestamp: '2026-10-10 10:45', result: 'granted' },
];

export interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  date: string;
  method: string;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
}

export const payments: Payment[] = [
  { id: 'p1', memberId: 'm1', memberName: 'Alex Chen', amount: 79, date: '2025-10-01', method: 'Card ending 4421', status: 'paid', description: 'Performance — October' },
  { id: 'p2', memberId: 'm2', memberName: 'Priya Sharma', amount: 149, date: '2025-10-01', method: 'Card ending 8830', status: 'paid', description: 'Elite — October' },
  { id: 'p3', memberId: 'm3', memberName: 'James Wilson', amount: 79, date: '2025-10-05', method: 'Card ending 1192', status: 'pending', description: 'Performance — October' },
  { id: 'p4', memberId: 'm4', memberName: 'Emily Davis', amount: 149, date: '2025-10-01', method: 'Card ending 5544', status: 'paid', description: 'Elite — October' },
  { id: 'p5', memberId: 'm5', memberName: 'Chris Taylor', amount: 149, date: '2025-10-01', method: 'Card ending 7733', status: 'paid', description: 'Elite — October' },
  { id: 'p6', memberId: 'm6', memberName: 'Nina Patel', amount: 39, date: '2025-09-01', method: 'Card ending 2200', status: 'overdue', description: 'Essential — September' },
];

export interface MembershipCard {
  id: string;
  memberId: string;
  cardId: string;
  status: 'active' | 'inactive' | 'lost' | 'replaced';
  issuedDate: string;
  accessHistory: { date: string; result: string }[];
}

export const membershipCards: MembershipCard[] = [
  { id: 'c1', memberId: 'm1', cardId: 'CARD-0012-A', status: 'active', issuedDate: '2024-01-15', accessHistory: [{ date: '2026-10-10 08:14', result: 'Granted' }, { date: '2026-10-09 17:20', result: 'Granted' }] },
  { id: 'c2', memberId: 'm2', cardId: 'CARD-0087-B', status: 'active', issuedDate: '2023-11-01', accessHistory: [{ date: '2026-10-10 10:15', result: 'Granted' }] },
  { id: 'c3', memberId: 'm3', cardId: 'CARD-0034-A', status: 'active', issuedDate: '2024-03-20', accessHistory: [{ date: '2026-10-10 09:01', result: 'Granted' }] },
  { id: 'c4', memberId: 'm6', cardId: 'CARD-0078-A', status: 'inactive', issuedDate: '2024-07-01', accessHistory: [{ date: '2026-10-08 14:30', result: 'Denied — Suspended' }] },
];

// Trainer data for portal
export interface TrainerProfile extends Trainer {
  clients: string[];
  workingHours: { day: string; hours: string }[];
}

export const trainerProfiles: TrainerProfile[] = trainers.map((t) => ({
  ...t,
  clients: members.filter((m) => m.trainerId === t.id).map((m) => m.id),
  workingHours: [
    { day: 'Mon–Thu', hours: '6:00 AM – 2:00 PM' },
    { day: 'Fri', hours: '8:00 AM – 12:00 PM' },
    { day: 'Sat–Sun', hours: 'Off' },
  ],
}));

// Admin dashboard data
export const adminStats = {
  totalMembers: members.length,
  activeMemberships: members.filter((m) => m.membershipStatus === 'Active').length,
  expiringSoon: members.filter((m) => m.membershipStatus === 'Expiring').length,
  membersInside: 42,
  totalTrainers: trainers.length,
  todayCheckIns: 28,
  monthlyRevenue: 18650,
  pendingPayments: payments.filter((p) => p.status !== 'paid').length,
};

export const monthlyRevenueData = [
  { month: 'May', revenue: 14200 },
  { month: 'Jun', revenue: 15800 },
  { month: 'Jul', revenue: 16200 },
  { month: 'Aug', revenue: 17400 },
  { month: 'Sep', revenue: 18100 },
  { month: 'Oct', revenue: 18650 },
];

export const membershipGrowth = [
  { month: 'May', count: 980 },
  { month: 'Jun', count: 1050 },
  { month: 'Jul', count: 1120 },
  { month: 'Aug', count: 1180 },
  { month: 'Sep', count: 1210 },
  { month: 'Oct', count: 1240 },
];

export const attendanceTrend = [
  { day: 'Mon', checkIns: 85 },
  { day: 'Tue', checkIns: 72 },
  { day: 'Wed', checkIns: 90 },
  { day: 'Thu', checkIns: 78 },
  { day: 'Fri', checkIns: 95 },
  { day: 'Sat', checkIns: 120 },
  { day: 'Sun', checkIns: 55 },
];

export const hourlyOccupancy = [
  { hour: '5 AM', count: 12 },
  { hour: '6 AM', count: 28 },
  { hour: '7 AM', count: 45 },
  { hour: '8 AM', count: 52 },
  { hour: '9 AM', count: 38 },
  { hour: '10 AM', count: 25 },
  { hour: '11 AM', count: 20 },
  { hour: '12 PM', count: 18 },
  { hour: '1 PM', count: 15 },
  { hour: '2 PM', count: 22 },
  { hour: '3 PM', count: 30 },
  { hour: '4 PM', count: 48 },
  { hour: '5 PM', count: 65 },
  { hour: '6 PM', count: 72 },
  { hour: '7 PM', count: 58 },
  { hour: '8 PM', count: 35 },
  { hour: '9 PM', count: 20 },
  { hour: '10 PM', count: 8 },
];

// Demo accounts
export const demoAccounts = [
  { role: 'member', email: 'member@forgefitness.club', password: 'demo', name: 'Alex Chen', memberId: 'm1' },
  { role: 'trainer', email: 'trainer@forgefitness.club', password: 'demo', name: 'Marcus Reilly', trainerId: 't1' },
  { role: 'admin', email: 'admin@forgefitness.club', password: 'demo', name: 'Admin' },
];

// Milestones
export const milestones = [
  { id: 'ms1', date: '2025-07-01', title: 'Joined Forge Fitness', description: 'Started fitness journey' },
  { id: 'ms2', date: '2025-08-15', title: 'First 100kg Bench Press', description: 'Hit personal record' },
  { id: 'ms3', date: '2025-09-20', title: '10kg Muscle Gain', description: 'Surpassed initial target' },
  { id: 'ms4', date: '2025-10-08', title: 'Body Fat Under 15%', description: 'Achieved lean composition goal' },
];
