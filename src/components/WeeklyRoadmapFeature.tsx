import React, { useState } from "react";
import {
  Flame,
  Target,
  Calendar,
  Clock,
  Activity,
  Award,
  Download,
  FileText,
  MessageCircle,
  ChevronRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { getWhatsAppUrl } from "../config/gymConfig";
import { useNavigation } from "../context/NavigationContext";
import { generateRoadmapPDF, DaySchedule } from "../utils/roadmapPdfGenerator";

type PlanType = "muscle-gain" | "fat-loss";
type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export const WeeklyRoadmapFeature: React.FC = () => {
  const { navigateTo } = useNavigation();
  const [activePlan, setActivePlan] = useState<PlanType>("muscle-gain");
  const [activeDay, setActiveDay] = useState<DayKey>("mon");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // ==========================================
  // 1. MUSCLE GAIN ROADMAP (MON - SAT + SUN)
  // ==========================================
  const muscleGainSchedule: Record<DayKey, DaySchedule> = {
    mon: {
      dayName: "Monday",
      shortDay: "Mon",
      title: "Chest & Triceps Hypertrophy",
      focus: "Horizontal Push & Upper Pec Density",
      duration: "65 mins",
      coachTip: "Slow down your negative to 3 seconds on bench press. Squeeze pecs at lockout without flaring elbows.",
      exercises: [
        { name: "Flat Barbell Bench Press", setsReps: "4 Sets × 6-8 Reps", notes: "Heavy compound lift, 2 mins rest between sets" },
        { name: "Incline Dumbbell Press (30°)", setsReps: "3 Sets × 8-10 Reps", notes: "Target upper clavicular head, deep stretch" },
        { name: "Cable Chest Crossover Flyes", setsReps: "3 Sets × 12-15 Reps", notes: "Continuous tension, 1s contraction squeeze at center" },
        { name: "Parallel Bar Dips (Leaning forward)", setsReps: "3 Sets × 8-10 Reps", notes: "Add dip belt weight if bodyweight is easy" },
        { name: "Overhead Rope Triceps Extension", setsReps: "3 Sets × 10-12 Reps", notes: "Flairs rope out at top for long triceps head" },
        { name: "Straight-Bar Triceps Pushdown", setsReps: "3 Sets × 12-15 Reps", notes: "Lock elbows to ribs, full lockout" },
      ],
    },
    tue: {
      dayName: "Tuesday",
      shortDay: "Tue",
      title: "Back Thickness & Biceps Peak",
      focus: "Vertical/Horizontal Pull & Lat Width",
      duration: "70 mins",
      coachTip: "Initiate every pull with your elbows, not hands. Drive your shoulder blades down and back.",
      exercises: [
        { name: "Conventional Barbell Deadlift", setsReps: "4 Sets × 5-6 Reps", notes: "Full posterior chain engagement, reset each rep" },
        { name: "Wide-Grip Lat Pulldown", setsReps: "3 Sets × 8-10 Reps", notes: "Pull to upper chest, resist the negative stretch" },
        { name: "Bent-Over Barbell Rows (Overhand)", setsReps: "4 Sets × 8-10 Reps", notes: "Torso 45-degree angle, bar touches sternum" },
        { name: "Single-Arm Dumbbell Row", setsReps: "3 Sets × 10 Reps / arm", notes: "Keep hips square, drive elbow straight back" },
        { name: "Standing Barbell Biceps Curls", setsReps: "3 Sets × 8-10 Reps", notes: "Strict form, zero back swinging" },
        { name: "Incline Dumbbell Hammer Curls", setsReps: "3 Sets × 10-12 Reps", notes: "Hits brachialis for thick arm appearance" },
      ],
    },
    wed: {
      dayName: "Wednesday",
      shortDay: "Wed",
      title: "Quad Power & Hamstring Sweep",
      focus: "Squat Mechanics & Knee Flexion",
      duration: "75 mins",
      coachTip: "Keep your chest high and drive directly through your mid-foot. Hit parallel depth on squats.",
      exercises: [
        { name: "Barbell Back Squats", setsReps: "4 Sets × 6-8 Reps", notes: "Primary lower compound, parallel or below" },
        { name: "Leg Press (Feet Shoulder-Width)", setsReps: "3 Sets × 10-12 Reps", notes: "Do not lock knees at the very top" },
        { name: "Dumbbell Bulgarian Split Squats", setsReps: "3 Sets × 10 Reps / leg", notes: "High unilateral quad & glute activation" },
        { name: "Romanian Deadlift (Dumbbell)", setsReps: "3 Sets × 8-10 Reps", notes: "Push hips back, feel hamstring stretch" },
        { name: "Lying Hamstring Leg Curls", setsReps: "3 Sets × 12-15 Reps", notes: "Control the eccentric descent" },
        { name: "Standing Calf Machine Raises", setsReps: "4 Sets × 15-20 Reps", notes: "Hold stretch at bottom 2s, peak pause at top" },
      ],
    },
    thu: {
      dayName: "Thursday",
      shortDay: "Thu",
      title: "3D Shoulders & Traps Builder",
      focus: "Anterior, Lateral & Posterior Deltoids",
      duration: "60 mins",
      coachTip: "Lateral delts grow with volume and strict time-under-tension, not ego swinging.",
      exercises: [
        { name: "Standing Barbell Overhead Press (OHP)", setsReps: "4 Sets × 6-8 Reps", notes: "Lock glutes and core, press vertical path" },
        { name: "Seated Dumbbell Arnold Press", setsReps: "3 Sets × 8-10 Reps", notes: "Smooth rotation from front to overhead" },
        { name: "Dumbbell Lateral Raises (Strict)", setsReps: "4 Sets × 12-15 Reps", notes: "Slight forward torso lean, lead with elbows" },
        { name: "Rope Face Pulls (High Pulley)", setsReps: "4 Sets × 15 Reps", notes: "Pull to eyes, external rotation for rear delts" },
        { name: "Reverse Pec Deck Fly", setsReps: "3 Sets × 12-15 Reps", notes: "Isolate posterior head, no shoulder shrug" },
        { name: "Heavy Dumbbell Shrugs", setsReps: "3 Sets × 12 Reps", notes: "2-second squeeze at apex, zero roll" },
      ],
    },
    fri: {
      dayName: "Friday",
      shortDay: "Fri",
      title: "Arm Hypertrophy & Upper Pump",
      focus: "Biceps/Triceps Superset & Upper Chest",
      duration: "60 mins",
      coachTip: "Alternate biceps and triceps movements to maximize blood flow and sleeve-stretching pump.",
      exercises: [
        { name: "EZ-Bar Skull Crushers", setsReps: "3 Sets × 8-10 Reps", notes: "Lower to crown of forehead, elbows tucked" },
        { name: "EZ-Bar Preacher Curls", setsReps: "3 Sets × 8-10 Reps", notes: "Eliminate shoulder momentum, full extension" },
        { name: "Seated Incline Dumbbell Curls", setsReps: "3 Sets × 10-12 Reps", notes: "Maximum bicep long head stretch" },
        { name: "Triceps V-Bar Cable Pushdown", setsReps: "3 Sets × 12-15 Reps", notes: "Pin elbows at sides, explosive press" },
        { name: "Low-to-High Cable Chest Flyes", setsReps: "3 Sets × 15 Reps", notes: "Targets upper chest inner fiber connection" },
        { name: "Hanging Leg Raises", setsReps: "3 Sets × 12-15 Reps", notes: "Curl pelvis upward, avoid swinging legs" },
      ],
    },
    sat: {
      dayName: "Saturday",
      shortDay: "Sat",
      title: "Posterior Chain & Functional Power",
      focus: "Full-Body Strength Overload & Core",
      duration: "65 mins",
      coachTip: "Finish the week with intense neural drive. Keep your core tight during every heavy pull.",
      exercises: [
        { name: "Trap Bar / Heavy Rack Pulls", setsReps: "4 Sets × 5 Reps", notes: "Maximum overload without lumbar fatigue" },
        { name: "Walking Dumbbell Lunges", setsReps: "3 Sets × 12 Steps / leg", notes: "Maintain upright torso, tap back knee lightly" },
        { name: "Lat Pullovers (Cable or Dumbbell)", setsReps: "3 Sets × 12 Reps", notes: "Deep ribcage and serratus stretch" },
        { name: "Heavy Farmer's Walks", setsReps: "3 Sets × 40 Meters", notes: "Braced core, upright posture, grip strength" },
        { name: "Ab Wheel Rollouts", setsReps: "3 Sets × 10-12 Reps", notes: "Posterior pelvic tilt, anti-extension core" },
      ],
    },
    sun: {
      dayName: "Sunday",
      shortDay: "Sun",
      title: "Active Muscle Recovery & Fueling",
      focus: "Nutrient Partitioning, Mobility & Sleep",
      duration: "30-40 mins",
      coachTip: "Muscles grow outside the gym when you rest and feed them. Hit your protein and sleep 8 hours.",
      exercises: [
        { name: "Zone 2 Low-Intensity Walk", setsReps: "40-45 Minutes", notes: "Outdoor brisk walk, flush lactic acid" },
        { name: "Full Body Dynamic Mobility Flow", setsReps: "15-20 Minutes", notes: "Hip 90/90s, thoracic rotations, ankle flex" },
        { name: "Foam Rolling IT Band & Lats", setsReps: "10 Minutes", notes: "Myofascial release for tight trigger points" },
        { name: "Weekly Meal Prep & Macro Plan", setsReps: "Check Targets", notes: "Ensure 2.0g protein/kg bodyweight daily" },
      ],
    },
  };

  // ==========================================
  // 2. FAT LOSS ROADMAP (MON - SAT + SUN)
  // ==========================================
  const fatLossSchedule: Record<DayKey, DaySchedule> = {
    mon: {
      dayName: "Monday",
      shortDay: "Mon",
      title: "Lower Body Conditioning + HIIT",
      focus: "High Calorie Burn & Muscle Preservation",
      duration: "60 mins",
      coachTip: "Keep rest under 60 seconds. Push hard on the finisher to elevate post-exercise metabolic rate (EPOC).",
      exercises: [
        { name: "Goblet Squats (Kettlebell / DB)", setsReps: "4 Sets × 12 Reps", notes: "Tempo 3-0-1, keeps quads under constant burn" },
        { name: "Dumbbell Walking Lunges", setsReps: "3 Sets × 12 Steps / leg", notes: "Fast transition, heart rate stays elevated" },
        { name: "Leg Press (Drop-set on last set)", setsReps: "3 Sets × 12-15 Reps", notes: "Empty the quad glycogen tank" },
        { name: "Lying Hamstring Leg Curls", setsReps: "3 Sets × 15 Reps", notes: "Controlled negative, squeeze at top" },
        { name: "HIIT Finisher: Assault Bike / Sprints", setsReps: "8 Rounds × 20s Work / 40s Rest", notes: "Max effort intervals, burns stubborn fat" },
      ],
    },
    tue: {
      dayName: "Tuesday",
      shortDay: "Tue",
      title: "Upper Body Push & Core Circuit",
      focus: "Shoulders, Chest & Core Torch",
      duration: "55 mins",
      coachTip: "Preserve bench and overhead pressing strength so you burn pure fat rather than losing muscle mass.",
      exercises: [
        { name: "Incline Dumbbell Bench Press", setsReps: "4 Sets × 10-12 Reps", notes: "Maintain heavy resistance on a cut" },
        { name: "Flat Dumbbell Floor Press", setsReps: "3 Sets × 12 Reps", notes: "Restricts shoulder strain, explosive press" },
        { name: "Standing Dumbbell Shoulder Press", setsReps: "3 Sets × 12 Reps", notes: "Strict overhead lockout" },
        { name: "Push-ups to Failure (3 Sets)", setsReps: "3 Sets × Max Reps", notes: "Chest pump without joint strain" },
        { name: "Cable Rope Triceps Pushdowns", setsReps: "3 Sets × 15 Reps", notes: "Short 45s rest" },
        { name: "Incline Treadmill Walk (12% incline)", setsReps: "15 Minutes @ 4.5 km/h", notes: "Fat-burning heart rate zone 2" },
      ],
    },
    wed: {
      dayName: "Wednesday",
      shortDay: "Wed",
      title: "Back Pull & Metabolic Circuit",
      focus: "Lat Width, Posture & High Energy Output",
      duration: "60 mins",
      coachTip: "Squeeze shoulder blades hard. Fast-paced pull day keeps metabolism firing for hours after.",
      exercises: [
        { name: "Wide-Grip Lat Pulldown", setsReps: "4 Sets × 10-12 Reps", notes: "Strict form, pull through elbows" },
        { name: "Seated Cable Row (Close Grip)", setsReps: "3 Sets × 12 Reps", notes: "1-second contraction pause at ribs" },
        { name: "Single-Arm Dumbbell Rows", setsReps: "3 Sets × 12 Reps / arm", notes: "Unilateral control, minimal rest" },
        { name: "Standing Dumbbell Bicep Curls", setsReps: "3 Sets × 12 Reps", notes: "Alternate arms without swinging" },
        { name: "Battle Rope Waves", setsReps: "4 Sets × 30s All-Out", notes: "Intense upper-body cardio expenditure" },
        { name: "Stairmaster Steady Climb", setsReps: "15 Minutes @ Level 7", notes: "Sweat out water retention and burn fat" },
      ],
    },
    thu: {
      dayName: "Thursday",
      shortDay: "Thu",
      title: "3D Delts & Tabata Core Burn",
      focus: "Shoulder Striations & Waist Tightening",
      duration: "50 mins",
      coachTip: "Triple drop-sets on lateral raises create unmatched shoulder roundness even in a caloric deficit.",
      exercises: [
        { name: "Seated Dumbbell Arnold Press", setsReps: "3 Sets × 12 Reps", notes: "Smooth continuous motion" },
        { name: "Lateral Raise Drop-Set (3 Drops)", setsReps: "3 Sets × 10+10+10 Reps", notes: "Drop weight by 30% each stage without rest" },
        { name: "Cable Face Pulls with External Rotation", setsReps: "4 Sets × 15 Reps", notes: "Rear delt and posture correction" },
        { name: "Medicine Ball Russian Twists", setsReps: "3 Sets × 20 Reps", notes: "Oblique rotational stability" },
        { name: "Hanging Knee Raises", setsReps: "3 Sets × 15 Reps", notes: "Lower abs vacuum tightening" },
        { name: "Rowing Machine Intervals", setsReps: "10 Minutes (1 min fast / 1 min slow)", notes: "Full body metabolic finish" },
      ],
    },
    fri: {
      dayName: "Friday",
      shortDay: "Fri",
      title: "Barbell Metabolic Complex",
      focus: "EPOC Oxygen Debt & Caloric Deficit",
      duration: "55 mins",
      coachTip: "Perform exercises back-to-back with the same barbell before resting. Maximum fat-loss acceleration.",
      exercises: [
        { name: "Barbell Romanian Deadlift", setsReps: "4 Sets × 10 Reps", notes: "Compound lower posterior driver" },
        { name: "Barbell Bent-Over Row", setsReps: "4 Sets × 10 Reps", notes: "Same barbell immediately after RDL" },
        { name: "Kettlebell Two-Hand Swings", setsReps: "4 Sets × 20 Reps", notes: "Explosive hip drive, core bracing" },
        { name: "Dumbbell Step-ups to Bench", setsReps: "3 Sets × 12 Reps / leg", notes: "Continuous unilateral leg burn" },
        { name: "Plank to Push-up Transitions", setsReps: "3 Sets × 12 Reps", notes: "Dynamic core & upper stabilizer" },
        { name: "Incline Treadmill Walk", setsReps: "15 Minutes @ 10% incline", notes: "Brisk fat oxidation pace" },
      ],
    },
    sat: {
      dayName: "Saturday",
      shortDay: "Sat",
      title: "High-Intensity Turf & Functional Shred",
      focus: "Full-Body Athletic Conditioning",
      duration: "60 mins",
      coachTip: "Saturday is your weekly championship round. Push the sled hard and sweat out every ounce.",
      exercises: [
        { name: "Sled / Turf Push", setsReps: "4 Rounds × 25 Meters", notes: "Heavy resistance, drive through calves" },
        { name: "Dumbbell Clean & Press", setsReps: "3 Sets × 10 Reps", notes: "Ground-to-overhead full athletic movement" },
        { name: "Speed Jump Rope", setsReps: "5 Rounds × 2 Minutes", notes: "Light on balls of feet, fast cadence" },
        { name: "Heavy Farmer's Carry", setsReps: "3 Sets × 50 Meters", notes: "Forearms, traps & core stabilization" },
        { name: "Burpees to Box Jump", setsReps: "3 Sets × 10 Reps", notes: "Explosive cardio peak" },
      ],
    },
    sun: {
      dayName: "Sunday",
      shortDay: "Sun",
      title: "Deficit Calibration & Low-Stress Recovery",
      focus: "Cortisol Reduction & Meal Precision",
      duration: "40 mins",
      coachTip: "High cortisol halts fat loss. Keep stress low, take a peaceful outdoor walk, and prep meals for Monday.",
      exercises: [
        { name: "Brisk Leisure Outdoor Walk", setsReps: "8,000-10,000 Steps", notes: "Low-stress NEAT non-exercise activity" },
        { name: "Full Body Hamstring & Hip Openers", setsReps: "15 Minutes", notes: "Stretches to release lumbar tension" },
        { name: "Hydration Target (3.5+ Liters)", setsReps: "All Day", notes: "Water with lemon & pinch of pink salt" },
        { name: "Weekly Weight & Waist Check-in", setsReps: "Morning Fasted", notes: "Send progress photo to Coach Aditya" },
      ],
    },
  };

  const currentSchedule = activePlan === "muscle-gain" ? muscleGainSchedule : fatLossSchedule;
  const currentDayData = currentSchedule[activeDay];

  const handleDownloadPDF = () => {
    try {
      setIsGeneratingPdf(true);
      setDownloadSuccess(false);

      // Trigger the high quality PDF compilation
      setTimeout(() => {
        generateRoadmapPDF({
          planType: activePlan,
          schedule: currentSchedule,
          daysOrder: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        });
        setIsGeneratingPdf(false);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 4000);
      }, 300);
    } catch (error) {
      console.error("PDF generation failed:", error);
      setIsGeneratingPdf(false);
    }
  };

  const handleWhatsAppInquiry = () => {
    const planTitle = activePlan === "muscle-gain" ? "Muscle Gain Hypertrophy Roadmap" : "Fat Loss Shred Roadmap";
    const waUrl = getWhatsAppUrl(
      `Hello Coach Aditya Experts, I am viewing the *${planTitle}* (Monday to Saturday Weekly Plan) on the Mahadev Gym Fitness website. I want to start this exact routine under your personal guidance.`
    );
    window.open(waUrl, "_blank");
  };

  return (
    <div className="w-full bg-[#FAF7F2] rounded-3xl border border-[#E5DFD5] p-5 sm:p-8 lg:p-10 shadow-[0_20px_60px_rgba(40,32,24,0.07)] relative overflow-hidden text-[#191919]">
      {/* Subtle Claude AI Warm Radial Glow */}
      <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full bg-[#E8DDD0]/40 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[#EADCC8]/30 blur-[100px] pointer-events-none" />

      {/* TOP HEADER OF THE CLAUDE-INSPIRED ROADMAP BOX */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E8E2D8] relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#F2EAE0] border border-[#DFCFC0] text-[#D95D0F] text-[11px] font-bold uppercase tracking-wider mb-2.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>MONDAY TO SATURDAY OFFICIAL WEEKLY ROADMAP</span>
          </div>

          <h3 className="font-athletic text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-[#191919]">
            {activePlan === "muscle-gain" ? (
              <>
                MUSCLE GAIN <span className="text-[#D95D0F]">HYPERTROPHY ROADMAP</span>
              </>
            ) : (
              <>
                FAT LOSS <span className="text-[#D95D0F]">METABOLIC SHRED ROADMAP</span>
              </>
            )}
          </h3>

          <p className="text-xs sm:text-sm text-[#57534E] max-w-2xl mt-1.5 leading-relaxed font-sans">
            {activePlan === "muscle-gain"
              ? "Structured progressive overload, targeted mechanical tension, and surplus nutrition blueprint curated by Coach Aditya Experts."
              : "High-density resistance workouts and EPOC metabolic conditioning engineered to burn stubborn fat while safeguarding 100% lean muscle."}
          </p>
        </div>

        {/* RIGHT CONTROLS: GOAL SWITCHER + DOWNLOAD PDF ACTION */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
          {/* GOAL SWITCHER TABS (MUSCLE GAIN ALAG / FAT LOSS ALAG) */}
          <div className="flex items-center p-1 bg-[#EFE9DF] rounded-xl border border-[#DFD6C9] shrink-0">
            <button
              type="button"
              onClick={() => setActivePlan("muscle-gain")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activePlan === "muscle-gain"
                  ? "bg-[#191919] text-white shadow-sm"
                  : "text-[#6B635B] hover:text-[#191919]"
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${activePlan === "muscle-gain" ? "text-[#FF7A29]" : ""}`} />
              <span>Muscle Gain</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePlan("fat-loss")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activePlan === "fat-loss"
                  ? "bg-[#191919] text-white shadow-sm"
                  : "text-[#6B635B] hover:text-[#191919]"
              }`}
            >
              <Target className={`w-3.5 h-3.5 ${activePlan === "fat-loss" ? "text-[#FF7A29]" : ""}`} />
              <span>Fat Loss</span>
            </button>
          </div>

          {/* DOWNLOAD ROADMAP PDF BUTTON */}
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border shadow-sm ${
              downloadSuccess
                ? "bg-[#166534] border-[#166534] text-white"
                : "bg-[#D95D0F] hover:bg-[#C2410C] border-[#D95D0F] text-white active:scale-98"
            }`}
          >
            {downloadSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>PDF Downloaded!</span>
              </>
            ) : isGeneratingPdf ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Roadmap PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* MONDAY TO SATURDAY (+ SUN) DAY SELECTOR PILL TABS */}
      <div className="pt-6 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#6B635B] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#D95D0F]" />
            <span>Select Workout Day (Monday to Saturday):</span>
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#D95D0F] bg-[#F7ECE1] px-2.5 py-0.5 rounded border border-[#EED7C4]">
              {currentDayData.duration} Session
            </span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {(["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as DayKey[]).map((dayKey) => {
            const dayData = currentSchedule[dayKey];
            const isSelected = activeDay === dayKey;
            const isSunday = dayKey === "sun";

            return (
              <button
                key={dayKey}
                type="button"
                onClick={() => setActiveDay(dayKey)}
                className={`py-3 px-1 sm:px-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  isSelected
                    ? "bg-[#191919] border-[#191919] text-white shadow-md scale-102"
                    : isSunday
                    ? "bg-[#F3EDE3] border-[#E5DDD2] text-[#8C8276] hover:text-[#191919] hover:bg-[#EBE2D5]"
                    : "bg-[#FFFFFF] border-[#E8E2D8] text-[#292524] hover:border-[#D5CABE] hover:bg-[#FAF6F0]"
                }`}
              >
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider block">
                  {dayData.shortDay}
                </span>
                <span className={`text-[9px] sm:text-[11px] font-medium hidden md:inline-block mt-0.5 line-clamp-1 ${
                  isSelected ? "text-[#E7E5E4]" : "text-[#78716C]"
                }`}>
                  {isSunday ? "Recovery" : dayData.title.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE DAY DETAILED WORKOUT BREAKDOWN */}
      <div className="mt-6 pt-6 border-t border-[#E8E2D8] grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* Left: Day Header & Exercises List (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <span className="text-xs font-bold text-[#D95D0F] uppercase tracking-wider block">
                  {currentDayData.dayName} Workout Routine
                </span>
                <h4 className="font-athletic text-2xl sm:text-3xl font-bold uppercase text-[#191919]">
                  {currentDayData.title}
                </h4>
              </div>
              <div className="flex items-center gap-2 bg-[#FFFFFF] border border-[#E5DFD5] px-3 py-1.5 rounded-lg text-xs text-[#44403C] shadow-xs">
                <Activity className="w-3.5 h-3.5 text-[#D95D0F]" />
                <span className="font-medium">{currentDayData.focus}</span>
              </div>
            </div>

            {/* Exercises List Cards (Off-White Cards on Cream Background) */}
            <div className="space-y-2.5 mb-6">
              {currentDayData.exercises.map((ex, index) => (
                <div
                  key={index}
                  className="p-3.5 sm:p-4 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF7F2] border border-[#E8E2D8] hover:border-[#D9CFC2] transition-colors flex items-start sm:items-center justify-between gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-[#F5EBE1] text-[#D95D0F] text-xs font-bold flex items-center justify-center shrink-0 border border-[#EED7C4]">
                      {index + 1}
                    </span>
                    <div>
                      <h5 className="text-sm font-semibold text-[#191919] tracking-wide">
                        {ex.name}
                      </h5>
                      <p className="text-xs text-[#6B635B] mt-0.5">
                        {ex.notes}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs sm:text-[13px] font-bold text-[#C2410C] whitespace-nowrap px-2.5 py-1 rounded bg-[#FEF3EB] border border-[#FCD9BD] shrink-0">
                    {ex.setsReps}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Coach Aditya Coaching Directive Callout */}
          <div className="p-4 rounded-xl bg-[#F6EFE6] border border-[#E8D7C6] flex items-start gap-3 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-[#D95D0F] text-white font-bold flex items-center justify-center shrink-0 shadow-sm">
              <Flame className="w-4 h-4 fill-current" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C2410C] block">
                Coach Aditya's Technique Directive
              </span>
              <p className="text-xs sm:text-sm text-[#292524] leading-relaxed mt-0.5 italic font-medium">
                "{currentDayData.coachTip}"
              </p>
            </div>
          </div>
        </div>

        {/* Right: Nutrition Protocol & Roadmap Summary Card (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-5">
          {/* Complete 12-Week Roadmap Progression Phases */}
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E8E2D8] space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#191919]">
              <Award className="w-4 h-4 text-[#D95D0F]" />
              <span>Full 12-Week Training Timeline</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#ECE5DA]">
                <div className="flex items-center justify-between text-[#191919] font-bold mb-1">
                  <span>Phase 1 (Weeks 1-4)</span>
                  <span className="text-[#D95D0F]">Base Lock</span>
                </div>
                <p className="text-[#6B635B] leading-relaxed">
                  Neuromuscular adaptation, movement groove calibration & RPE stabilization.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#ECE5DA]">
                <div className="flex items-center justify-between text-[#191919] font-bold mb-1">
                  <span>Phase 2 (Weeks 5-8)</span>
                  <span className="text-[#D95D0F]">Volume Overload</span>
                </div>
                <p className="text-[#6B635B] leading-relaxed">
                  Increment of load (+2.5kg to +5kg), density sets, and peak mechanical tension.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#ECE5DA]">
                <div className="flex items-center justify-between text-[#191919] font-bold mb-1">
                  <span>Phase 3 (Weeks 9-12)</span>
                  <span className="text-[#D95D0F]">Peak Results</span>
                </div>
                <p className="text-[#6B635B] leading-relaxed">
                  {activePlan === "muscle-gain"
                    ? "Maximum myofibrillar size, 1RM strength testing, and physique expansion."
                    : "Deep vascularity cut, stubborn visceral fat depletion, and sharp conditioning."}
                </p>
              </div>
            </div>
          </div>

          {/* Macro & Nutrition Target Box */}
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E8E2D8] space-y-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D95D0F] block">
              Nutrition & Macro Directive
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#ECE5DA]">
                <span className="text-[#78716C] text-[10px] block">PROTEIN TARGET</span>
                <span className="text-[#191919] font-bold text-sm">
                  {activePlan === "muscle-gain" ? "2.0g / kg" : "2.2g / kg"}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#ECE5DA]">
                <span className="text-[#78716C] text-[10px] block">CALORIE INTAKE</span>
                <span className="text-[#191919] font-bold text-sm">
                  {activePlan === "muscle-gain" ? "+350 Surplus" : "-450 Deficit"}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#ECE5DA]">
                <span className="text-[#78716C] text-[10px] block">HYDRATION</span>
                <span className="text-[#191919] font-bold text-sm">3.5 - 4.0 L</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#ECE5DA]">
                <span className="text-[#78716C] text-[10px] block">SLEEP RECOVERY</span>
                <span className="text-[#191919] font-bold text-sm">7.5 - 8.5 Hrs</span>
              </div>
            </div>
          </div>

          {/* Action Buttons inside the Box */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="w-full h-[46px] rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#191919] hover:bg-[#2A2A2A] border border-[#191919] flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-sm transition-all"
            >
              <FileText className="w-4 h-4 text-[#FF8A33]" />
              <span>
                {isGeneratingPdf
                  ? "GENERATING PDF DOCUMENT..."
                  : `DOWNLOAD ${activePlan === "muscle-gain" ? "MUSCLE GAIN" : "FAT LOSS"} PDF`}
              </span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppInquiry}
              className="w-full h-[44px] rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#15803D] hover:bg-[#166534] border border-[#15803D] flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>ASK COACH ADITYA ON WHATSAPP</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo("calculator")}
              className="w-full h-[40px] rounded-xl text-xs font-semibold uppercase tracking-wider text-[#292524] bg-[#FFFFFF] hover:bg-[#FAF7F2] border border-[#E5DFD5] flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
            >
              <span>Calculate Daily Calories & TDEE</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#D95D0F]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
