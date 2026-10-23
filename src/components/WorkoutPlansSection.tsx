import React, { useState } from "react";
import { Dumbbell, Calendar, Check, ArrowRight, X, Clock, Layers, AlertCircle } from "lucide-react";
import { WORKOUT_PLANS, WorkoutPlan } from "../config/gymConfig";

export const WorkoutPlansSection: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);

  const weeklySchedule = [
    { day: "Monday", routine: "Chest & Triceps", focus: "Push Hypertrophy & Stability" },
    { day: "Tuesday", routine: "Back & Biceps", focus: "Pull Mechanics & Grip Strength" },
    { day: "Wednesday", routine: "Legs & Core", focus: "Quad/Hamstring Power & Abdominals" },
    { day: "Thursday", routine: "Shoulders & Conditioning", focus: "Deltoid Hypertrophy & Work Capacity" },
    { day: "Friday", routine: "Upper Body Training", focus: "Volume Balance & Weak Point Focus" },
    { day: "Saturday", routine: "Full Body / Goal Specialization", focus: "Athletic Conditioning or Lagging Groups" },
    { day: "Sunday", routine: "Rest & Active Recovery", focus: "Joint Mobility, Hydration & Tissue Repair" },
  ];

  return (
    <section id="plans" className="py-16 lg:py-24 bg-[#FAF7F2] relative text-[#191919]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3 text-[#D95D0F] text-xs font-semibold tracking-widest uppercase">
            <Layers className="w-4 h-4" />
            <span>PROGRESSIVE WORKOUT PLANS</span>
          </div>
          <h2 className="font-athletic text-3xl sm:text-5xl font-bold tracking-tight text-[#191919] uppercase mb-4">
            STRUCTURED TRAINING FOR <span className="text-[#D95D0F]">EVERY LEVEL.</span>
          </h2>
          <p className="text-[#57534E] text-base sm:text-lg leading-relaxed">
            Consistency begins with the right roadmap. Select your training experience to view our structured weekly splits.
          </p>
        </div>

        {/* 3 Training Level Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {WORKOUT_PLANS.map((plan) => (
            <div
              key={plan.id}
              className="rounded-2xl bg-[#FFFFFF] border border-[#E8E2D8] hover:border-[#D95D0F]/60 transition-all duration-300 flex flex-col justify-between p-6 sm:p-8 relative group shadow-[0_4px_24px_rgba(40,32,24,0.04)]"
            >
              {/* Level indicator */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#D95D0F] bg-[#F5ECE1] border border-[#EED7C4] px-3 py-1 rounded-md">
                  {plan.level}
                </span>
                <span className="text-xs text-[#78716C] font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#D95D0F]" />
                  {plan.frequency}
                </span>
              </div>

              <div>
                <h3 className="font-athletic text-2xl font-bold text-[#191919] uppercase tracking-wide mb-2 group-hover:text-[#D95D0F] transition-colors">
                  {plan.title}
                </h3>
                <p className="text-xs font-semibold text-[#D95D0F] uppercase tracking-wider mb-4">
                  {plan.tagline}
                </p>
                <p className="text-sm text-[#57534E] leading-relaxed mb-6">
                  {plan.description}
                </p>

                {/* Key components */}
                <div className="space-y-2.5 pt-4 border-t border-[#ECE5DA] mb-8">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#292524]">
                      <Check className="w-4 h-4 text-[#D95D0F] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* View Workout Action */}
              <button
                type="button"
                onClick={() => setSelectedPlan(plan)}
                className="w-full py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-white bg-[#191919] hover:bg-[#2A2A2A] rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>VIEW WORKOUT</span>
                <ArrowRight className="w-4 h-4 text-[#FF8A33]" />
              </button>
            </div>
          ))}
        </div>

        {/* Sample Weekly Workout Schedule */}
        <div className="rounded-2xl bg-[#FFFFFF] border border-[#E8E2D8] p-6 sm:p-10 shadow-[0_4px_24px_rgba(40,32,24,0.03)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#ECE5DA]">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#D95D0F] uppercase tracking-wider mb-1">
                <Calendar className="w-4 h-4" />
                <span>TRAINING TIMETABLE</span>
              </div>
              <h3 className="font-athletic text-2xl sm:text-3xl font-bold text-[#191919] uppercase">
                SAMPLE WEEKLY WORKOUT SCHEDULE
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE3D8] max-w-md">
              <p className="text-[11px] text-[#6B635B] leading-relaxed flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-[#D95D0F] shrink-0" />
                <span>Notice: Sample template. Individual programs are calibrated to personal schedule and physical recovery.</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {weeklySchedule.map((item) => {
              const isSunday = item.day === "Sunday";
              return (
                <div
                  key={item.day}
                  className={`p-4 rounded-xl border transition-all ${
                    isSunday
                      ? "bg-[#F3EDE3] border-[#E5DDD2]"
                      : "bg-[#FAF7F2] border-[#E8E2D8] hover:border-[#D95D0F]/40"
                  }`}
                >
                  <div className="text-xs font-bold uppercase tracking-wider text-[#D95D0F] mb-1">
                    {item.day}
                  </div>
                  <div className="font-athletic text-base font-bold text-[#191919] uppercase tracking-wide leading-tight mb-2">
                    {item.routine}
                  </div>
                  <div className="text-[11px] text-[#6B635B] leading-normal">
                    {item.focus}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Workout Plan Details Modal */}
      {selectedPlan && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#FFFFFF] border border-[#E5DFD5] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#191919]">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#ECE5DA] mb-6">
              <div>
                <span className="text-xs font-bold text-[#D95D0F] uppercase tracking-wider bg-[#F5ECE1] border border-[#EED7C4] px-2.5 py-1 rounded-md">
                  {selectedPlan.level} Split
                </span>
                <h3 className="font-athletic text-2xl sm:text-3xl font-bold text-[#191919] uppercase mt-2">
                  {selectedPlan.title}
                </h3>
                <p className="text-xs text-[#6B635B] mt-1">{selectedPlan.tagline} • {selectedPlan.frequency}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="p-2 text-[#78716C] hover:text-[#191919] rounded-xl bg-[#FAF7F2] hover:bg-[#EFE9DF] transition-colors border border-[#E5DFD5]"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Routine details */}
            <div className="space-y-6 mb-8">
              <div>
                <h4 className="text-xs font-bold text-[#191919] uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-[#D95D0F]" />
                  <span>Curated Routine Split</span>
                </h4>
                <div className="space-y-3">
                  {selectedPlan.sampleRoutine.map((step, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#ECE5DA]">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <span className="font-athletic text-sm font-bold text-[#D95D0F] uppercase">
                          {step.day}
                        </span>
                        <span className="text-xs text-[#6B635B]">{step.focus}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {step.exercises.map((ex, eIdx) => (
                          <span
                            key={eIdx}
                            className="text-xs bg-[#FFFFFF] text-[#292524] px-2.5 py-1 rounded-md border border-[#E5DFD5] shadow-2xs font-medium"
                          >
                            {ex}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#191919] uppercase tracking-widest mb-3">
                  Coach Execution Guidelines
                </h4>
                <ul className="space-y-2 text-xs text-[#44403C]">
                  {selectedPlan.guidelines.map((g, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D95D0F] shrink-0 mt-0.5" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Footer CTA */}
            <div className="pt-4 border-t border-[#ECE5DA] flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-[#6B635B] hover:text-[#191919] transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#D95D0F] hover:bg-[#C2410C] rounded-xl text-center shadow-sm cursor-pointer"
              >
                START THIS PLAN AT MAHADEV GYM
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
