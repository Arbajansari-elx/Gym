import React from "react";
import { PageBanner } from "../components/PageBanner";
import { Dumbbell, Target, Zap, Flame, CheckCircle2, ArrowRight } from "lucide-react";
import { GymImage } from "../components/GymImage";
import { useNavigation } from "../context/NavigationContext";

export const AboutPage: React.FC = () => {
  const { navigateTo } = useNavigation();

  const philosophyPillars = [
    {
      title: "1. Strength Training",
      subtitle: "Biomechanical Precision & Heavy Loads",
      desc: "Mastering fundamental barbell, dumbbell, and machine compound movements with uncompromising technique to build resilient raw power.",
      icon: Dumbbell,
    },
    {
      title: "2. Fitness & Conditioning",
      subtitle: "Stamina, Aerobic Capacity & Agility",
      desc: "High-density functional training, stamina development, and metabolic endurance tailored to elevate athletic performance and cardiovascular health.",
      icon: Zap,
    },
    {
      title: "3. Goal-Oriented Workouts",
      subtitle: "Structured Hypertrophy & Fat-Loss",
      desc: "Structured training splits designed around specific hypertrophy and fat-loss targets rather than random, ineffective gym sessions.",
      icon: Target,
    },
  ];

  const standards = [
    "Clean, disciplined training environment without intimidation or egos",
    "Calibrated Olympic barbells, heavy dumbbells, and reinforced safety racks",
    "Direct oversight from Head Coach Aditya Experts on exercise technique",
    "Evidence-grounded programming tailored to real, sustainable adaptations",
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#191919]">
      <PageBanner
        kicker="WHO WE ARE"
        title="MORE THAN A GYM."
        titleAccent="A STRONGER LIFESTYLE."
        subtitle="At Mahadev Gym Fitness, training is more than an occasional routine—it is a lifelong commitment to mental discipline, physical resilience, and sustained athletic power."
        customAction={{
          label: "JOIN MAHADEV GYM",
          onClick: () => navigateTo("contact"),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 space-y-20">
        {/* Section 1: Core Story & Facility Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-[#D95D0F] text-xs font-semibold tracking-widest uppercase">
              <Flame className="w-4 h-4" />
              <span>THE TRAINING ETHOS</span>
            </div>
            <h2 className="font-athletic text-3xl sm:text-5xl font-bold text-[#191919] uppercase leading-tight">
              DISCIPLINE FIRST. <br />
              <span className="text-[#D95D0F]">RESULTS INEVITABLE.</span>
            </h2>
            <p className="text-[#44403C] text-base leading-relaxed">
              Mahadev Gym Fitness was founded to provide trainees with a focused, serious environment where physical strength and mental discipline are forged. We reject fitness fads, extreme starvation diets, and false transformation promises.
            </p>
            <p className="text-[#57534E] text-base leading-relaxed">
              Instead, we ground every workout in proven movement mechanics: progressive overload on compound lifts, strict exercise form, deliberate recovery, and sustainable nutrition.
            </p>

            <div className="space-y-3 pt-2">
              {standards.map((s, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm text-[#292524]">
                  <CheckCircle2 className="w-5 h-5 text-[#D95D0F] shrink-0 mt-0.5" />
                  <span className="font-medium">{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-[#E5DFD5] bg-[#FFFFFF] aspect-[4/3] shadow-[0_12px_40px_rgba(40,32,24,0.06)]">
              <GymImage
                alt="Mahadev Gym Fitness Arena"
                theme="facility"
                overlay={true}
              />
              <div className="absolute bottom-6 left-6 right-6 bg-[#FFFFFF]/95 backdrop-blur-md p-4 rounded-xl border border-[#E5DFD5] shadow-sm">
                <div className="text-xs font-bold text-[#D95D0F] uppercase tracking-wider">
                  TRAINING ENVIRONMENT
                </div>
                <div className="text-sm font-semibold text-[#191919] mt-1">
                  Built for Lifters, Athletes, and Serious Fitness Enthusiasts
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Three Visual Highlights */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="font-athletic text-3xl sm:text-4xl font-bold text-[#191919] uppercase mb-3">
              THREE CORE PILLARS OF OUR FACILITY
            </h3>
            <p className="text-xs sm:text-sm text-[#6B635B]">
              Designed to cover the complete spectrum of human physical capability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {philosophyPillars.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="rounded-2xl bg-[#FFFFFF] border border-[#E8E2D8] hover:border-[#D95D0F]/60 p-8 transition-all flex flex-col justify-between group shadow-[0_4px_24px_rgba(40,32,24,0.04)]"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#F5ECE1] flex items-center justify-center text-[#D95D0F] mb-6 group-hover:bg-[#191919] group-hover:text-white transition-colors border border-[#EED7C4]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="font-athletic text-2xl font-bold text-[#191919] uppercase tracking-wide mb-1">
                      {p.title}
                    </h4>
                    <div className="text-xs font-bold text-[#D95D0F] uppercase tracking-wider mb-4">
                      {p.subtitle}
                    </div>
                    <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                      {p.desc}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-[#ECE5DA] mt-6 flex items-center justify-between text-xs text-[#78716C]">
                    <span>Standardized Coaching</span>
                    <span className="text-[#D95D0F] font-bold">Active</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Call to action bar (Claude Parchment / Charcoal Box) */}
        <div className="rounded-2xl bg-[#191919] text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_16px_50px_rgba(30,24,18,0.12)]">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-athletic text-3xl sm:text-4xl font-bold uppercase tracking-tight">
              EXPERIENCE THE FACILITY IN PERSON
            </h3>
            <p className="text-xs sm:text-sm text-[#D6D3D1] max-w-lg leading-relaxed">
              Tour our floor, try the machines, and talk with Coach Aditya Experts before making your decision.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigateTo("contact")}
              className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-[#D95D0F] hover:bg-[#C2410C] rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
            >
              VISIT GYM LOCATION
            </button>
            <button
              type="button"
              onClick={() => navigateTo("plans")}
              className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#191919] bg-[#FFFFFF] hover:bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl cursor-pointer transition-all active:scale-95"
            >
              EXPLORE WORKOUT PLANS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
