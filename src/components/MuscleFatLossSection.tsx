import React from "react";
import { Dumbbell, Flame, Check, ArrowRight } from "lucide-react";
import { GymImage } from "./GymImage";

export const MuscleFatLossSection: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const musclePillars = [
    "Progressive resistance overload on compound lifts",
    "Strict exercise technique under deliberate tempo",
    "Uncompromising sleep, hydration and recovery",
    "Consistent protein intake and clean caloric surplus",
  ];

  const fatLossPillars = [
    "Consistent physical activity and daily movement",
    "Preserving lean mass with heavy strength training",
    "Sustainable, realistic calorie management without starvation",
    "Metabolic conditioning and systematic consistency",
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#0F0F0F] relative border-t border-[#1C1C1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3 text-[#FF6A00] text-xs font-semibold tracking-widest uppercase">
            <span>TARGETED SPECIALIZATIONS</span>
          </div>
          <h2 className="font-athletic text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase mb-4">
            CHOOSE YOUR PRIMARY <span className="text-[#FF6A00]">PHYSIQUE TARGET</span>
          </h2>
          <p className="text-[#B3B3B3] text-base sm:text-lg">
            Two proven pathways tailored for real, sustainable progress. Built on exercise science, not quick gimmicks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Panel 1: Build Muscle */}
          <div className="rounded-2xl bg-[#141414] border border-[#282828] hover:border-[#FF6A00]/50 transition-all flex flex-col justify-between overflow-hidden group shadow-xl">
            {/* Visual header */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#181818]">
              <GymImage
                alt="Muscle Building Resistance Training"
                theme="workout"
                overlay={true}
              />
              <div className="absolute top-4 left-4 bg-black/80 px-3 py-1 rounded border border-[#333] text-xs font-bold text-[#FF6A00] uppercase tracking-wider flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5" />
                <span>HYPERTROPHY & POWER</span>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
              <div>
                <h3 className="font-athletic text-2xl sm:text-3xl font-bold text-white uppercase tracking-wide mb-3 group-hover:text-[#FF6A00] transition-colors">
                  BUILD LEAN MUSCLE
                </h3>
                <p className="text-sm text-[#B3B3B3] leading-relaxed mb-6">
                  Systematic hypertrophy programming that maximizes muscle fiber recruitment, builds structural joint integrity, and fosters substantial long-term mass.
                </p>

                <div className="space-y-3 mb-8">
                  {musclePillars.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#E0E0E0]">
                      <Check className="w-4 h-4 text-[#FF6A00] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => scrollTo("#plans")}
                className="w-full py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-black bg-[#FF6A00] hover:bg-[#E55E00] rounded-md transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>EXPLORE MUSCLE-BUILDING WORKOUTS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Panel 2: Fat Loss & Conditioning */}
          <div className="rounded-2xl bg-[#141414] border border-[#282828] hover:border-[#FF6A00]/50 transition-all flex flex-col justify-between overflow-hidden group shadow-xl">
            {/* Visual header */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#181818]">
              <GymImage
                alt="Fat Loss and Conditioning Workout"
                theme="cardio"
                overlay={true}
              />
              <div className="absolute top-4 left-4 bg-black/80 px-3 py-1 rounded border border-[#333] text-xs font-bold text-[#FF6A00] uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                <span>METABOLIC CONDITIONING</span>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
              <div>
                <h3 className="font-athletic text-2xl sm:text-3xl font-bold text-white uppercase tracking-wide mb-3 group-hover:text-[#FF6A00] transition-colors">
                  FAT LOSS & CONDITIONING
                </h3>
                <p className="text-sm text-[#B3B3B3] leading-relaxed mb-6">
                  Accelerate caloric expenditure while safeguarding dense muscle tissue through functional conditioning, compound lifts, and metabolic circuits.
                </p>

                <div className="space-y-3 mb-8">
                  {fatLossPillars.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#E0E0E0]">
                      <Check className="w-4 h-4 text-[#FF6A00] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => scrollTo("#plans")}
                className="w-full py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-black bg-[#FF6A00] hover:bg-[#E55E00] rounded-md transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>EXPLORE FAT-LOSS WORKOUTS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
