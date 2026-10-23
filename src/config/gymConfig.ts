/**
 * CENTRAL CONFIGURATION FOR MAHADEV GYM FITNESS
 * 
 * Edit this file to update the trainer phone number, gym address,
 * Google Maps link, operating hours, and package details.
 */

// Configure Trainer WhatsApp Number here (Country code + 10-digit phone number without +, spaces or hyphens)
// Indian country code is 91. Replace placeholder with real number (e.g., '919876543210')
export const WHATSAPP_PHONE_NUMBER = "919876543210"; 

// Flag to indicate if real WhatsApp number is ready or is a setup placeholder
export const IS_WHATSAPP_CONFIGURED = true;

// Actual uploaded trainer hero photograph
export const TRAINER_HERO_IMAGE = "/assets/aistudio/file_0000000027c88207852e7b13d8141a46_1ee657f1.png";

// Gym Brand Details
export const GYM_CONFIG = {
  name: "MAHADEV GYM FITNESS",
  shortName: "MAHADEV GYM",
  tagline: "BUILD YOUR STRONGER SELF.",
  subTagline: "TRAIN HARD. STAY DISCIPLINED. BECOME UNSTOPPABLE.",
  trainerName: "Aditya Experts",
  trustStatement: "YOUR FITNESS. YOUR DISCIPLINE. YOUR TRANSFORMATION.",
  
  // Gym Location & Maps
  address: "Near City Sports Complex, Main Bypass Road, Opposite Metro Pillar 142",
  city: "City Center",
  googleMapsUrl: "https://maps.app.goo.gl/TPq1TJqFB5FnozFfA?g_st=ac",
  googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112000!2d77.2!3d28.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjh8NzcuMg!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin",
  
  // Operating Hours
  hours: {
    weekdays: "Monday – Saturday: 5:30 AM – 10:30 PM",
    sunday: "Sunday: 7:00 AM – 12:00 PM (Recovery & Mobility)",
  },

  // Contact
  phoneFormatted: "+91 98765 43210 (Aditya Experts)",
  email: "contact@mahadevgymfitness.com",
};

/**
 * Helper to construct WhatsApp click-to-chat links
 */
export function getWhatsAppUrl(prefilledMessage?: string): string {
  const base = `https://wa.me/${WHATSAPP_PHONE_NUMBER}`;
  if (!prefilledMessage) return base;
  return `${base}?text=${encodeURIComponent(prefilledMessage.trim())}`;
}

export interface WorkoutPlan {
  id: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  title: string;
  tagline: string;
  description: string;
  frequency: string;
  features: string[];
  sampleRoutine: { day: string; focus: string; exercises: string[] }[];
  guidelines: string[];
}

export const WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: "beginner",
    level: "Beginner",
    title: "Beginner Foundation Plan",
    tagline: "Technique, Consistency & Base Strength",
    description: "For people starting their fitness journey and learning correct exercise techniques.",
    frequency: "3 - 4 Days / Week",
    features: [
      "Basic strength training movements",
      "Exercise technique and safe form mastery",
      "Introductory conditioning & mobility",
      "Rest and recovery fundamentals",
    ],
    sampleRoutine: [
      { day: "Day 1 (Full Body A)", focus: "Compound Technique", exercises: ["Goblet Squats 3x10", "Dumbbell Flat Press 3x10", "Seated Cable Rows 3x12", "Plank 3x30s"] },
      { day: "Day 2", focus: "Rest / Light Walking", exercises: ["Active recovery & hydration"] },
      { day: "Day 3 (Full Body B)", focus: "Posterior Chain & Push", exercises: ["Romanian Deadlifts (Light) 3x10", "Seated Dumbbell Overhead Press 3x10", "Lat Pulldown 3x12", "Glute Bridges 3x15"] },
      { day: "Day 4", focus: "Rest", exercises: ["Mobility & foam rolling"] },
      { day: "Day 5 (Full Body C)", focus: "Conditioning & Core", exercises: ["Leg Press 3x12", "Incline Dumbbell Bench 3x10", "Face Pulls 3x15", "Hanging Knee Raises 3x10"] },
    ],
    guidelines: [
      "Master the movement before adding external load.",
      "Rest 60-90 seconds between sets.",
      "Focus on controlled eccentric (lowering) tempo.",
    ],
  },
  {
    id: "intermediate",
    level: "Intermediate",
    title: "Intermediate Hypertrophy & Power",
    tagline: "Progressive Overload & Muscle Balance",
    description: "For people who have developed basic training consistency and want to improve strength and conditioning.",
    frequency: "4 - 5 Days / Week",
    features: [
      "Structured workout splits (Upper / Lower or Push-Pull-Legs)",
      "Progressive overload tracking principles",
      "Targeted muscle-group hypertrophy",
      "Recovery, hydration and consistency habits",
    ],
    sampleRoutine: [
      { day: "Day 1 (Push)", focus: "Chest, Shoulders & Triceps", exercises: ["Barbell Bench Press 4x8", "Incline Dumbbell Press 3x10", "Dumbbell Lateral Raises 4x15", "Tricep Rope Pushdowns 3x12"] },
      { day: "Day 2 (Pull)", focus: "Back, Rear Delts & Biceps", exercises: ["Conventional Deadlift / Barbell Row 4x6-8", "Neutral Grip Pulldown 3x10", "Chest-Supported Row 3x12", "Incline Bicep Curls 3x12"] },
      { day: "Day 3 (Legs)", focus: "Quads, Hamstrings & Calves", exercises: ["Barbell Back Squat 4x8", "Romanian Deadlift 3x10", "Bulgarian Split Squats 3x10/leg", "Standing Calf Raises 4x15"] },
      { day: "Day 4 (Upper Focus)", focus: "Shoulders, Upper Chest & Lats", exercises: ["Overhead Military Press 3x8", "Weighted Pull-ups / Lat Machine 4x8", "Cable Crossover 3x12", "Hammer Curls 3x12"] },
      { day: "Day 5 (Conditioning)", focus: "Core & Athletic Agility", exercises: ["Farmer's Walk 4x40m", "Hanging Leg Raises 4x12", "Rowing Machine Intervals 15 mins"] },
    ],
    guidelines: [
      "Aim to increase weight or repetitions weekly.",
      "Keep 1-2 reps in reserve (RIR) on compound lifts.",
      "Track workout logs consistently.",
    ],
  },
  {
    id: "advanced",
    level: "Advanced",
    title: "Advanced Athletic Conditioning",
    tagline: "High Volume, Periodization & Maximal Intensity",
    description: "For experienced trainees seeking a more structured and demanding training routine.",
    frequency: "5 - 6 Days / Week",
    features: [
      "Advanced training structures & periodization",
      "Strategic exercise variations & angles",
      "Strength and hypertrophy intensity techniques",
      "Planned deloads and recovery protocols",
    ],
    sampleRoutine: [
      { day: "Day 1 (Chest & Delts)", focus: "Maximum Hypertrophy", exercises: ["Incline Barbell Press 4x6-8", "Flat Dumbbell Press with Pause 4x8-10", "Seated Dumbbell OHP 4x8", "Cable Lateral Raise 4x15"] },
      { day: "Day 2 (Back & Traps)", focus: "Thickness & V-Taper", exercises: ["Heavy Weighted Pull-ups 4x6", "Pendlay Rows 4x8", "Meadows Rows 3x10", "Shrugs & Face Pulls Superset 4x15"] },
      { day: "Day 3 (Legs Anterior)", focus: "Quad Dominant & Calves", exercises: ["Front Squats / Safety Bar Squats 4x6", "Leg Press (Foot Placed Low) 4x12", "Walking Dumbbell Lunges 3x16 paces", "Seated Calf Raise 4x15"] },
      { day: "Day 4 (Arms & Core)", focus: "Biceps, Triceps & Abs", exercises: ["Barbell Skullcrushers 4x10", "EZ-Bar Preacher Curls 4x10", "Dips (Weighted) 3x10", "Dragon Flags 3x8"] },
      { day: "Day 5 (Posterior Chain)", focus: "Hamstrings & Glutes", exercises: ["Barbell Romanian Deadlift 4x8", "Lying Hamstring Curls 4x12 (Drop Set)", "Hip Thrusts 3x10", "Ab Wheel Rollouts 4x12"] },
      { day: "Day 6 (Weak Point Specialization)", focus: "High Intensity Functional", exercises: ["Sled Push 5x30m", "Battle Ropes 6x30s", "Farmer Carries 4x50m"] },
    ],
    guidelines: [
      "Utilize RPE 8-9 and respect deload weeks.",
      "Prioritize 8+ hours of sleep and high protein intake.",
      "Strict form over ego lifting on every repetition.",
    ],
  },
];

export interface CoachingPackage {
  id: string;
  name: string;
  tagline: string;
  description: string;
  frequency: string;
  duration: string;
  priceNote: string;
  features: string[];
}

export const COACHING_PACKAGES: CoachingPackage[] = [
  {
    id: "starter",
    name: "Personal Training Starter",
    tagline: "Foundation & Form Correction",
    description: "Ideal for trainees who need dedicated technique correction, biomechanics analysis, and a structured start.",
    frequency: "3 Sessions / Week",
    duration: "Monthly / Flexible",
    priceNote: "Contact for Pricing",
    features: [
      "1-on-1 technique assessment with Aditya Experts",
      "Tailored workout roadmap tailored to your body type",
      "Posture correction and joint mobility checks",
      "Form video reviews & WhatsApp progress support",
    ],
  },
  {
    id: "plus",
    name: "Personal Training Plus",
    tagline: "Hypertrophy, Strength & Nutrition Roadmap",
    description: "Comprehensive coaching designed for sustained muscle development, fat loss acceleration, and habit building.",
    frequency: "5 Sessions / Week",
    duration: "3-Month Transformation Commitment",
    priceNote: "Contact for Pricing",
    features: [
      "Daily guided training sessions with Aditya Experts",
      "Customized calorie and macronutrient guidelines",
      "Bi-weekly body measurement & progressive overload tracking",
      "Injury prevention & active recovery protocols",
      "Direct priority WhatsApp mentorship",
    ],
  },
  {
    id: "dedicated",
    name: "Dedicated One-to-One Elite",
    tagline: "Exclusive Athlete-Level Mentorship",
    description: "Complete hands-on personal guidance for serious physique transformation, contest prep, or peak athletic conditioning.",
    frequency: "6 Sessions / Week + Daily Oversight",
    duration: "Custom Periodization",
    priceNote: "Contact for Pricing",
    features: [
      "Exclusive private coaching slots with Aditya Experts",
      "Continuous form adjustment and spotter support",
      "Weekly routine adaptations based on recovery metrics",
      "Personalized supplement guidance & meal timing",
      "Full ongoing progress monitoring and video analysis",
    ],
  },
];

export interface MembershipOption {
  id: string;
  title: string;
  period: string;
  pricingLabel: string;
  description: string;
  badge?: string;
  features: string[];
}

export const MEMBERSHIP_OPTIONS: MembershipOption[] = [
  {
    id: "monthly",
    title: "Monthly Membership",
    period: "Per Month",
    pricingLabel: "Contact for Pricing",
    description: "Flexible month-to-month gym access with complete equipment availability and general floor support.",
    features: [
      "Full gym floor & free-weight zone access",
      "Cardio machines & functional turf area",
      "Locker room and shower facilities",
      "Initial general fitness orientation",
    ],
  },
  {
    id: "quarterly",
    title: "Quarterly Membership",
    period: "3 Months",
    pricingLabel: "Contact for Pricing",
    badge: "Most Popular",
    description: "Consistent 90-day training commitment allowing real physical transformation and habit formation.",
    features: [
      "Everything in Monthly Membership",
      "Complimentary workout split orientation",
      "Monthly body composition check",
      "Preferred personal training inquiry booking",
    ],
  },
  {
    id: "annual",
    title: "Annual Membership",
    period: "12 Months",
    pricingLabel: "Contact for Pricing",
    badge: "Best Value",
    description: "For athletes and dedicated lifters committed to long-term discipline, strength, and transformation.",
    features: [
      "Unlimited 365-day gym access during all open hours",
      "Quarterly 1-on-1 form consultation with Aditya Experts",
      "Locker facility privileges",
      "Guest pass vouchers for workout partners",
    ],
  },
];

export interface ExerciseItem {
  id: string;
  name: string;
  targetMuscle: string;
  category: "Chest" | "Back" | "Legs" | "Shoulders" | "Arms" | "Core";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  instructions: string[];
  commonMistakes: string[];
  proTip: string;
  videoPlaceholderUrl?: string;
}

export const EXERCISE_LIBRARY: ExerciseItem[] = [
  {
    id: "flat-barbell-bench",
    name: "Flat Barbell Bench Press",
    targetMuscle: "Pectoralis Major, Anterior Deltoids, Triceps",
    category: "Chest",
    difficulty: "Intermediate",
    instructions: [
      "Lie flat on the bench with eyes positioned directly under the barbell.",
      "Grip the bar slightly wider than shoulder-width, plant feet firmly into the floor.",
      "Retract shoulder blades and establish a stable arch in the mid-to-upper back.",
      "Unrack, inhale into your diaphragm, and lower the bar under control to the lower chest.",
      "Press explosively through the palms while driving feet into the floor.",
    ],
    commonMistakes: [
      "Flaring elbows out at a 90-degree angle to the torso (places high stress on rotator cuffs).",
      "Bouncing the barbell off the sternum.",
      "Lifting hips/butt off the bench during the concentric push.",
    ],
    proTip: "Keep elbows tucked at roughly 45 to 60 degrees and squeeze the barbell tightly to engage triceps and forearms.",
  },
  {
    id: "barbell-romanian-deadlift",
    name: "Barbell Romanian Deadlift (RDL)",
    targetMuscle: "Hamstrings, Gluteus Maximus, Erector Spinae",
    category: "Legs",
    difficulty: "Intermediate",
    instructions: [
      "Stand tall holding the barbell with an overhand grip, feet hip-width apart.",
      "Unlock knees slightly, then hinge back at the hips while keeping chest tall.",
      "Slide the barbell close down along the thighs and shins until maximum hamstring stretch is achieved.",
      "Keep spine completely neutral; do not round the lumbar back.",
      "Drive hips forward through the glutes to return to the upright starting position.",
    ],
    commonMistakes: [
      "Squatting down instead of hinging backwards with the hips.",
      "Allowing the barbell to drift away from the legs, putting pressure on lower back.",
      "Hyperextending the spine at the top of the lift.",
    ],
    proTip: "Think of pushing your hips back to touch an imaginary wall behind you rather than thinking about bending down.",
  },
  {
    id: "barbell-bent-over-row",
    name: "Barbell Bent-Over Row",
    targetMuscle: "Latissimus Dorsi, Rhomboids, Middle Trapezius",
    category: "Back",
    difficulty: "Intermediate",
    instructions: [
      "Hinge forward at the hips with a flat back at approximately 45 degrees.",
      "Hold the barbell with an overhand or underhand grip just wider than shoulder width.",
      "Pull the barbell toward the lower abdomen/navel, driving elbows up and back.",
      "Squeeze shoulder blades tightly together at the top of the movement.",
      "Lower the bar slowly under tension without losing torso angle.",
    ],
    commonMistakes: [
      "Using jerking body momentum to heave the barbell up.",
      "Standing too upright, shifting the tension from lats to upper traps.",
      "Rounding the upper or lower spine.",
    ],
    proTip: "Initiate the movement by retracting your scapulae before your arms pull.",
  },
  {
    id: "standing-overhead-press",
    name: "Standing Barbell Overhead Press (OHP)",
    targetMuscle: "Deltoids (Anterior & Lateral), Triceps, Upper Chest",
    category: "Shoulders",
    difficulty: "Advanced",
    instructions: [
      "Rest the bar on upper chest and clavicle with elbows pointed slightly forward.",
      "Brace glutes, quads, and abs into a solid kinetic chain.",
      "Tilt head slightly back as you press the bar vertically in a straight path.",
      "Once the bar clears the forehead, push head back through and lock out overhead with active traps.",
      "Lower under control back to the collarbone shelf.",
    ],
    commonMistakes: [
      "Excessive arching of the lumbar spine.",
      "Pressing the bar forward instead of directly vertical.",
      "Neglecting full glute and core bracing.",
    ],
    proTip: "Squeeze your glutes as hard as possible throughout the press to protect your lower back.",
  },
  {
    id: "incline-dumbbell-curl",
    name: "Incline Dumbbell Bicep Curl",
    targetMuscle: "Biceps Brachii (Long Head)",
    category: "Arms",
    difficulty: "Beginner",
    instructions: [
      "Set an adjustable bench to an incline of 45-60 degrees.",
      "Sit back with arms hanging fully extended, holding dumbbells in neutral grip.",
      "Curl the weights up while supinating (turning palms up) as you ascend.",
      "Hold the peak contraction for one second at the top.",
      "Lower the dumbbells through the full range of motion for a deep bicep stretch.",
    ],
    commonMistakes: [
      "Swinging elbows forward to cheat the weight up.",
      "Cutting the stretch short at the bottom.",
      "Lifting head or shoulders off the incline bench.",
    ],
    proTip: "The incline angle stretches the bicep long head across the shoulder joint, stimulating superior hypertrophy.",
  },
  {
    id: "hanging-leg-raise",
    name: "Hanging Leg / Knee Raise",
    targetMuscle: "Rectus Abdominis, Hip Flexors, Grip Strength",
    category: "Core",
    difficulty: "Intermediate",
    instructions: [
      "Hang from a pull-up bar with an overhand grip and engaged shoulders.",
      "Brace the core to prevent body swinging.",
      "Curl knees or straight legs upward toward chest by tilting the pelvis upward.",
      "Hold for a brief beat at the top, focusing on crunching the lower abs.",
      "Lower legs slowly back down without allowing the body to swing back and forth.",
    ],
    commonMistakes: [
      "Using swinging momentum like a pendulum.",
      "Only flexing the hips without tilting the pelvis (neglects the abdominal muscles).",
    ],
    proTip: "Exhale sharply at the top of the contraction to maximize abdominal firing.",
  },
];

// Sample transformation pairs for showcase
export const SAMPLE_TRANSFORMATIONS = [
  {
    id: "t1",
    label: "Strength & Muscle Foundation",
    focus: "Progressive Overload & Caloric Surplus",
    timeline: "24-Week Dedication",
    description: "Consistent compound lifting combined with structured protein intake and coach form assessments.",
    note: "Sample transformation illustration. Real member journeys shared with explicit authorization.",
  },
  {
    id: "t2",
    label: "Body Recomposition & Lean Mass",
    focus: "Fat-Loss Conditioning & Technique",
    timeline: "16-Week Consistency",
    description: "Targeted conditioning splits paired with daily deficit monitoring and recovery protocols.",
    note: "Sample transformation illustration. Real member journeys shared with explicit authorization.",
  },
  {
    id: "t3",
    label: "Athletic Mobility & Core Power",
    focus: "Strength Training & Functional Agility",
    timeline: "20-Week Training",
    description: "Transition from sedentary lifestyle to athletic posture, high stamina, and core stability.",
    note: "Sample transformation illustration. Real member journeys shared with explicit authorization.",
  },
];
